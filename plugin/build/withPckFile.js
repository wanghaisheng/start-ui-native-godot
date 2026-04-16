import { withXcodeProject } from 'expo/config-plugins';
import * as fs from 'fs';
import * as path from 'path';
const withPckFiles = (config) => {
  return withXcodeProject(config, async (config) => {
    const projectRoot = config.modRequest.projectRoot;
    const project = config.modResults;
    // Source path: src/assets/godot/main.pck
    const sourcePath = path.join(
      projectRoot,
      'src',
      'assets',
      'godot',
      'main.pck'
    );
    // Destination path: ios/main.pck
    const destPath = path.join(projectRoot, 'ios', 'main.pck');
    // Check if source file exists
    if (!fs.existsSync(sourcePath)) {
      console.warn('main.pck not found at assets/godot/main.pck');
      return config;
    }
    // Copy the file
    fs.copyFileSync(sourcePath, destPath);
    console.log('Copied main.pck to iOS project');
    // Check if file already exists in the project
    const existingFile = project.hasFile('main.pck');
    if (existingFile) {
      console.log('main.pck already exists in Xcode project');
      return config;
    }
    // Get the main group
    const firstProject = project.getFirstProject();
    const mainGroupKey = firstProject.firstProject.mainGroup;
    if (!mainGroupKey) {
      console.error('Could not find main group');
      return config;
    }
    // Add the file reference
    const file = project.addFile('main.pck', mainGroupKey, {
      lastKnownFileType: 'file',
      defaultEncoding: 4,
    });
    if (!file) {
      console.log('Could not add file - it may already exist');
      return config;
    }
    // Get target UUID
    const targetUuid = project.getFirstTarget().uuid;
    // Generate UUID for build file
    const buildFileUuid = project.generateUuid();
    // Add to PBXBuildFile section
    project.addToPbxBuildFileSection({
      uuid: buildFileUuid,
      isa: 'PBXBuildFile',
      fileRef: file.fileRef,
      basename: 'main.pck',
      group: 'Resources',
    });
    // Add to Resources build phase
    project.addToPbxResourcesBuildPhase({
      uuid: buildFileUuid,
      basename: 'main.pck',
      group: 'Resources',
      target: targetUuid,
    });
    return config;
  });
};
export default withPckFiles;
