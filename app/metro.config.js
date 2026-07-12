// Learn more: https://docs.expo.dev/guides/monorepos/
// Metro must watch the workspace root so it can resolve the symlinked
// `@fit-and-fed/design-system` workspace package (imported by name) and the
// real, cited content under `../data/` that the screens sample from.
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '..');

const config = getDefaultConfig(projectRoot);

// 1. Watch the whole workspace (design-system source + data/*.json live here).
config.watchFolders = [workspaceRoot];

// 2. Resolve modules from the app first, then the hoisted workspace root.
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

module.exports = config;
