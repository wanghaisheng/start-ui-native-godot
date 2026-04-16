const { ConfigPlugin } = require('expo/config-plugins');
const withGodotFiles = require('./withGodotFiles.js');
const withPckFile = require('./withPckFile.js');

const withPlugin = (config) => {
  // Copy Godot files to Android assets
  config = withGodotFiles(config);
  // Copy main.pck to iOS project
  return withPckFile(config);
};

module.exports = withPlugin;
