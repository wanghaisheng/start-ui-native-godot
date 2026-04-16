const { ConfigPlugin, withDangerousMod } = require('expo/config-plugins');
const fs = require('fs');
const path = require('path');

// Recursively copy a directory
function copyDirectory(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

const withGodotFiles = (config) => {
  return withDangerousMod(config, [
    'android',
    async (config) => {
      const projectRoot = config.modRequest.projectRoot;

      // Source path: assets/godot/godot-files/main
      const sourcePath = path.join(
        projectRoot,
        'assets',
        'godot',
        'godot-files',
        'main'
      );

      // Destination path: android/app/src/main/assets/main
      const destPath = path.join(
        projectRoot,
        'android',
        'app',
        'src',
        'main',
        'assets',
        'main'
      );

      if (!fs.existsSync(sourcePath)) {
        console.warn(`Godot files not found at ${sourcePath}`);
        return config;
      }

      // Ensure the assets directory exists
      const assetsDir = path.join(
        projectRoot,
        'android',
        'app',
        'src',
        'main',
        'assets'
      );
      if (!fs.existsSync(assetsDir)) {
        fs.mkdirSync(assetsDir, { recursive: true });
      }

      // Copy the directory
      try {
        copyDirectory(sourcePath, destPath);
        console.log(`Copied Godot files from ${sourcePath} to ${destPath}`);
      } catch (error) {
        console.error(`Error copying Godot files: ${error}`);
      }

      return config;
    },
  ]);
};

module.exports = withGodotFiles;
