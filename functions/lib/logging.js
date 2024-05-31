const {
  logger: { error },
  https: { HttpsError },
} = require('firebase-functions');

/**
 * See https://firebase.google.com/docs/reference/node/firebase.functions#functionserrorcode
 * @param {String} code "ok" | "cancelled" | "unknown" | "invalid-argument" | "deadline-exceeded" | "not-found" | "already-exists" | "permission-denied" | "resource-exhausted" | "failed-precondition" | "aborted" | "out-of-range" | "unimplemented" | "internal" | "unavailable" | "data-loss" | "unauthenticated"
 * @param {String} message
 * @param {Object} payload
 */
exports.error = (code, message, payload) => {
  error(message, payload);
  throw new HttpsError(code, message);
};
