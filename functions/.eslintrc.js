const isProduction =
  process.env.NODE_ENV === 'production' || process.env.CI === 'true';

module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  parser: '@babel/eslint-parser',
  parserOptions: {
    requireConfigFile: false,
  },
  extends: ['eslint:recommended', 'google', 'prettier'],
  plugins: ['prettier', 'import'],
  rules: {
    'prefer-promise-reject-errors': 'off',
    'prettier/prettier': [
      'warn',
      { singleQuote: true, semi: true, trailingComma: 'all' },
    ],
    'no-console': isProduction ? 'error' : 'warn',
    'no-debugger': isProduction ? 'error' : 'warn',
    'no-continue': 'off',
    'no-unused-vars': 'warn',
    'no-useless-catch': 'warn',
    'no-async-promise-executor': 'off',
    'valid-jsdoc': 'warn',
    'import/prefer-default-export': 'warn',
    'no-redeclare': ['error', { builtinGlobals: true }],
    'no-underscore-dangle': ['error', { allow: ['_id', '_rev'] }],
    'linebreak-style': 'off',
    'no-shadow': 'off',
    'lines-between-class-members': 'warn',
    'import/no-useless-path-segments': 'off',
    'import/order': [
      'warn',
      {
        pathGroupsExcludedImportTypes: ['builtin'],
        groups: [
          ['builtin', 'external'],
          'internal',
          ['parent', 'sibling', 'index'],
        ],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
        warnOnUnassignedImports: true,
      },
    ],

    'react/no-access-state-in-setstate': 'off',
    'no-else-return': 'off',
    camelcase: 'off',
  },
};
