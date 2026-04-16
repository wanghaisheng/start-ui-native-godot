const fs = require('fs');
const path = require('path');

const sourceDir = path.join(
  __dirname,
  '../ref/react-native-godot-demo/assets/godot'
);
const targetDir = path.join(__dirname, '../src/assets/godot');

console.log('📋 Copying Godot assets from reference project...');

// Create target directory
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
  console.log('✅ Created target directory:', targetDir);
}

// Copy main.pck
const mainPckSource = path.join(sourceDir, 'main.pck');
const mainPckTarget = path.join(targetDir, 'main.pck');

if (fs.existsSync(mainPckSource)) {
  fs.copyFileSync(mainPckSource, mainPckTarget);
  console.log('✅ Copied main.pck');
} else {
  console.log('⚠️  main.pck not found in source');
}

// Copy godot-files directory
const godotFilesSource = path.join(sourceDir, 'godot-files');
const godotFilesTarget = path.join(targetDir, 'godot-files');

if (fs.existsSync(godotFilesSource)) {
  // Copy directory recursively
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
        console.log('  ✅ Copied:', entry.name);
      }
    }
  }

  copyDirectory(godotFilesSource, godotFilesTarget);
  console.log('✅ Copied godot-files directory');
} else {
  console.log('⚠️  godot-files directory not found in source');
}

console.log('\n✨ Godot assets copied successfully!');
console.log('📁 Target directory:', targetDir);
