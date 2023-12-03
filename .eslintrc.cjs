// reference: https://typescript-eslint.io/linting/typed-linting/monorepos
module.exports = {
  root: true,
  extends: ['@resume-generator/eslint-config'],
  // root eslint config will ignore workspaces
  ignorePatterns: ['apps/**', 'packages/**'],
};
