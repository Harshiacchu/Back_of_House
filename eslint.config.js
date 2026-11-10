// ESLint flat config for the whole repo (backend + frontend).
// Run from the root: `npm run lint` (or `npm run lint:fix`).
// Formatting is Prettier's job; eslint-config-prettier (last) turns off every
// stylistic rule that would fight it.

import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';

// Libraries the course does not allow. Importing any of them is a lint error.
const PROHIBITED_PACKAGES = [
  { name: 'axios', message: 'Use the Fetch API (frontend/src/api/client.js).' },
  { name: 'mongoose', message: 'Use the native MongoDB driver (backend/src/db/connection.js).' },
  { name: 'cors', message: 'Not needed: Vite proxies /api in dev and Express serves the build.' },
  { name: 'jquery', message: 'Use React.' },
];

// Correctness and best-practice rules shared by Node and browser code.
const sharedRules = {
  // Possible problems
  'array-callback-return': ['error', { allowImplicit: true }],
  'no-await-in-loop': 'warn',
  'no-constructor-return': 'error',
  'no-duplicate-imports': 'error',
  'no-promise-executor-return': 'error',
  'no-self-compare': 'error',
  'no-template-curly-in-string': 'error',
  'no-unmodified-loop-condition': 'error',
  'no-unreachable-loop': 'error',
  'no-unused-private-class-members': 'error',
  'no-unused-vars': [
    'error',
    { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrors: 'none' },
  ],
  'no-use-before-define': ['error', { functions: false, classes: true, variables: true }],
  'require-atomic-updates': 'off',

  // Suggestions
  'consistent-return': 'error',
  curly: ['error', 'multi-line'],
  'default-case-last': 'error',
  'default-param-last': 'error',
  eqeqeq: ['error', 'always', { null: 'ignore' }],
  'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
  'no-else-return': ['error', { allowElseIf: false }],
  'no-eval': 'error',
  'no-implied-eval': 'error',
  'no-lonely-if': 'error',
  'no-nested-ternary': 'error',
  'no-new-func': 'error',
  'no-new-wrappers': 'error',
  'no-param-reassign': ['error', { props: false }],
  'no-restricted-imports': ['error', { paths: PROHIBITED_PACKAGES }],
  'no-return-assign': 'error',
  'no-sequences': 'error',
  'no-throw-literal': 'error',
  'no-unneeded-ternary': 'error',
  'no-useless-concat': 'error',
  'no-useless-rename': 'error',
  'no-useless-return': 'error',
  'no-var': 'error',
  'object-shorthand': ['error', 'always'],
  'prefer-arrow-callback': 'error',
  'prefer-const': 'error',
  'prefer-object-spread': 'error',
  'prefer-promise-reject-errors': 'error',
  'prefer-template': 'error',
  radix: 'error',
  yoda: 'error',
};

export default [
  // ---------------------------------------------------------------- ignores
  {
    ignores: ['**/node_modules/', '**/dist/', '**/coverage/', 'backend/scripts/data/'],
  },

  // --------------------------------------------------------------- baseline
  js.configs.recommended,
  {
    linterOptions: { reportUnusedDisableDirectives: 'error' },
    languageOptions: { ecmaVersion: 'latest', sourceType: 'module' },
    rules: sharedRules,
  },

  // ---------------------------------------------------- backend (Node + ESM)
  {
    files: ['backend/**/*.js', '*.config.js', 'frontend/vite.config.js'],
    languageOptions: { globals: globals.node },
    rules: {
      'no-process-exit': 'off',
      // Backend code must not reach into the frontend and vice versa.
      'no-restricted-imports': [
        'error',
        {
          paths: PROHIBITED_PACKAGES,
          patterns: [
            { group: ['**/frontend/**'], message: 'Backend cannot import frontend code.' },
          ],
        },
      ],
    },
  },
  {
    // Seed and maintenance scripts print progress on purpose.
    files: ['backend/scripts/**/*.js', 'backend/src/server.js'],
    rules: { 'no-console': 'off', 'no-await-in-loop': 'off' },
  },

  // ------------------------------------------------- frontend (React + JSX)
  {
    files: ['frontend/src/**/*.{js,jsx}'],
    ...react.configs.flat.recommended,
    ...react.configs.flat['jsx-runtime'],
    languageOptions: {
      ...react.configs.flat.recommended.languageOptions,
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'jsx-a11y': jsxA11y,
    },
    settings: { react: { version: 'detect' } },
    rules: {
      ...react.configs.flat.recommended.rules,
      ...react.configs.flat['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.flatConfigs.recommended.rules,

      // Hooks
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'error',

      // Fast refresh: component files export components only.
      'react-refresh/only-export-components': ['error', { allowConstantExport: true }],

      // PropTypes on every component (rubric).
      'react/prop-types': 'error',
      'react/require-default-props': 'off',
      'react/forbid-prop-types': ['error', { forbid: ['any'] }],
      'react/no-unused-prop-types': 'error',

      // Component hygiene
      'react/function-component-definition': [
        'error',
        { namedComponents: 'function-declaration', unnamedComponents: 'arrow-function' },
      ],
      'react/jsx-filename-extension': ['error', { extensions: ['.jsx'] }],
      'react/jsx-pascal-case': 'error',
      'react/no-multi-comp': ['error', { ignoreStateless: false }],
      'react/jsx-no-useless-fragment': ['error', { allowExpressions: true }],
      'react/jsx-curly-brace-presence': ['error', { props: 'never', children: 'never' }],
      'react/self-closing-comp': 'error',
      'react/jsx-boolean-value': ['error', 'never'],
      'react/jsx-no-constructed-context-values': 'error',
      'react/no-array-index-key': 'error',
      'react/no-danger': 'error',
      'react/no-unstable-nested-components': 'error',
      'react/hook-use-state': 'error',
      'react/button-has-type': 'error',
      'react/jsx-no-target-blank': 'error',

      // Standard HTML elements for standard jobs (rubric): no clickable divs/spans.
      'jsx-a11y/no-static-element-interactions': 'error',
      'jsx-a11y/click-events-have-key-events': 'error',
      'jsx-a11y/no-noninteractive-element-interactions': 'error',
      'jsx-a11y/anchor-is-valid': 'error',
      'jsx-a11y/label-has-associated-control': ['error', { assert: 'either' }],
      // Off: it wrongly flags role="img" on <svg>, the standard accessible-SVG pattern.
      'jsx-a11y/prefer-tag-over-role': 'off',

      // Boundaries: no implicit window.event, no backend imports.
      'no-restricted-globals': [
        'error',
        { name: 'event', message: 'Use the handler argument instead.' },
      ],
      'no-restricted-imports': [
        'error',
        {
          paths: PROHIBITED_PACKAGES,
          patterns: [{ group: ['**/backend/**'], message: 'Frontend cannot import backend code.' }],
        },
      ],
    },
  },
  {
    // Context and hook modules are plain .js files with no JSX.
    files: ['frontend/src/context/**/*.js', 'frontend/src/hooks/**/*.js'],
    rules: { 'react-refresh/only-export-components': 'off' },
  },

  // Must stay last: disables rules that conflict with Prettier.
  prettier,
];
