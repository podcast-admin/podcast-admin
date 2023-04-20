const isProduction =
  process.env.NODE_ENV === 'production' || process.env.CI === 'true';

module.exports = {
  extends: 'react-app',
  env: {
    browser: true,
    jest: true,
    es6: true,
    node: true,
  },
  plugins: ['prettier'],
  rules: {
    'prefer-promise-reject-errors': 'off',
    'prettier/prettier': [
      'warn',
      { singleQuote: true, semi: true, trailingComma: 'all' },
    ],
    'no-console': isProduction ? 'error' : 'warn',
    'no-debugger': isProduction ? 'error' : 'warn',
    'no-continue': 'off',
    'import/prefer-default-export': 'warn',
    'react/forbid-prop-types': 'off',
    'react/jsx-filename-extension': ['warn', { extensions: ['.js', '.jsx'] }],
    'react/jsx-sort-props': ['off', { callbacksLast: true }],
    'react/sort-prop-types': ['off', { callbacksLast: true }],
    'react/jsx-boolean-value': 'error',
    'react/jsx-handler-names': 'error',
    'jsx-a11y/label-has-for': 'off',
    'no-redeclare': ['error', { builtinGlobals: true }],
    'no-underscore-dangle': ['error', { allow: ['_id', '_rev'] }],
    'jsx-a11y/no-noninteractive-element-interactions': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',
    'linebreak-style': 'off',
    'react/sort-comp': 'off',
    'no-shadow': 'off',
    'jsx-a11y/anchor-is-valid': [
      'error',
      {
        components: ['Link'],
        specialLink: ['to'],
      },
    ],
    'react/jsx-props-no-spreading': 'off',
    'react/destructuring-assignment': 'off',
    'lines-between-class-members': 'warn',
    'react/state-in-constructor': 'off',
    'react/jsx-curly-brace-presence': 'off',
    'react/jsx-fragments': 'off',
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
    'jsx-a11y/label-has-associated-control': 'off',
    'jsx-a11y/control-has-associated-label': 'off',
    camelcase: 'off',
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
      classes: true,
    },
  },
  settings: {
    'import/resolver': {
      node: {
        moduleDirectory: ['node_modules', 'src'],
      },
    },
  },
};
