// .eslintrc.js
module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./app/tsconfig.json'],
  },
  settings: {
    'import/resolver': {
      typescript: {
        project: ['./app/tsconfig.json'],
      },
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  extends: [
    'airbnb-base',
    'airbnb-typescript/base',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    'prettier/prettier': 'error',
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
    'no-underscore-dangle': 'off',
    'no-console': 'off',
    'no-nested-ternary': 'off'
  },
  ignorePatterns: [
    '.eslintrc.js',
    'commitlint.config.js',
    'docker-compose.yml',
    'Dockerfile',
    '*.config.js',
    '*.config.ts',
    'setup.sh',
    'docker-husky.sh',
    'app/dist',
    'app/dist-electron',
    'app/build',
    'app/node_modules',
    'app/public',
    'app/release',
    'app/vite.config.flat.txt',
  ],
  overrides: [
    {
      files: ['.eslintrc.{js,cjs}'],
      env: {
        node: true,
      },
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
};
