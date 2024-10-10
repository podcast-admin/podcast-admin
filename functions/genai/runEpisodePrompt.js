const { VertexAI } = require('@google-cloud/vertexai');
const { getFirestore } = require('firebase-admin/firestore');
const { getStorage } = require('firebase-admin/storage');
const { onCall } = require('firebase-functions/v2/https');
const yup = require('yup');

const { info, error } = require('../lib/logging');

const bucket = getStorage().bucket();
const db = getFirestore();

// Initialize Vertex with your Cloud project and location
const vertex_ai = new VertexAI({
  project: 'podcast-admin',
  location: 'europe-west3',
});
const model = 'gemini-1.5-flash-002';

// Instantiate the models
const generativeModel = vertex_ai.preview.getGenerativeModel({
  model: model,
  generationConfig: {
    maxOutputTokens: 8192,
    temperature: 1,
    topP: 0.95,
  },
  safetySettings: [
    {
      category: 'HARM_CATEGORY_HATE_SPEECH',
      threshold: 'BLOCK_MEDIUM_AND_ABOVE',
    },
    {
      category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
      threshold: 'BLOCK_MEDIUM_AND_ABOVE',
    },
    {
      category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
      threshold: 'BLOCK_MEDIUM_AND_ABOVE',
    },
    {
      category: 'HARM_CATEGORY_HARASSMENT',
      threshold: 'BLOCK_MEDIUM_AND_ABOVE',
    },
  ],
});

module.exports = onCall(async (request) => {
  const requestDataSchema = yup.object({
    podcastId: yup.string().required(),
    episodeId: yup.string().required(),
    promptId: yup.string().required(),
  });

  // Reject the call if the required data is not provided
  try {
    requestDataSchema.validateSync(request.data);
  } catch (e) {
    error('invalid-argument', 'The required data is not provided.', {
      e,
      request,
    });
  }

  const podcastId = request.data.podcastId;
  const episodeId = request.data.episodeId;
  const promptId = request.data.promptId;

  // Reject the call if the user is not authenticated
  if (!request.auth) {
    error('unauthenticated', 'The user is not unauthenticated.', request);
  }

  const token = request.auth.token;

  // Only owners of the podcast are allowed to execute this operation
  if (!token.podcasts?.includes(podcastId)) {
    error(
      'permission-denied',
      'The user is not authorized to execute this operation.',
      request,
    );
  }

  const podastDoc = db.doc(`podcasts/${podcastId}`);
  const podcast = await podastDoc.get();
  const podcastData = podcast.data();

  const { prompt } = podcastData.genAiPrompts.find(({ id }) => id === promptId);

  const episodePath = `podcasts/${podcastId}/episodes/${episodeId}`;

  const episodeDoc = db.doc(episodePath);
  const episode = await episodeDoc.get();
  const episodeData = episode.data();

  if (episodeData.transcript?.status !== 'done') {
    error(
      'failed-precondition',
      'The transcript for this podcast does not exist.',
      { request, episode },
    );
  }

  const readJsonFromFile = async (gcsUri) =>
    new Promise((resolve, reject) => {
      let buf = '';

      const filepath = gcsUri.match(/gs:\/\/.*?\/(.*)/);

      bucket
        .file(filepath[1])
        .createReadStream()
        .on('data', (d) => (buf += d))
        .on('end', () => resolve(buf))
        .on('error', (e) => reject(e));
    });

  const transcriptRaw = await readJsonFromFile(episodeData.transcript.gcsUri);
  const transcript = JSON.parse(transcriptRaw)
    .results.map((result) =>
      result.alternatives?.map((alternative) => alternative.transcript),
    )
    .join('');

  const req = {
    contents: [
      {
        role: 'user',
        parts: [
          { text: transcript },
          {
            text: prompt,
          },
        ],
      },
    ],
  };

  info(`Running Gen AI Job for ${episodeId}`, {
    podcastId,
    episodeId,
    promptId,
    prompt,
  });

  const contentResult = await generativeModel.generateContent(req);

  return contentResult.response.candidates[0].content.parts[0].text;
});
