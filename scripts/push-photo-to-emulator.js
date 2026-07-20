/**
 * Push an image from your PC into the Android emulator gallery.
 *
 * Usage:
 *   npm run push-photo -- "D:\Pictures\fox.jpg"
 *
 * Requires: emulator running, ANDROID_HOME set (or Android SDK at default path).
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const localPath = process.argv[2];
if (!localPath) {
  console.error('\nUsage: npm run push-photo -- "<path-to-image>"\n');
  console.error('Example: npm run push-photo -- "D:\\Pictures\\fox.jpg"\n');
  process.exit(1);
}

const resolved = path.resolve(localPath);
if (!fs.existsSync(resolved)) {
  console.error(`\nFile not found: ${resolved}\n`);
  process.exit(1);
}

const sdkRoot =
  process.env.ANDROID_HOME ||
  process.env.ANDROID_SDK_ROOT ||
  path.join(process.env.LOCALAPPDATA || '', 'Android', 'Sdk');

const adb = path.join(sdkRoot, 'platform-tools', process.platform === 'win32' ? 'adb.exe' : 'adb');
if (!fs.existsSync(adb)) {
  console.error(`\nadb not found at: ${adb}`);
  console.error('Set ANDROID_HOME or install the Android SDK platform-tools.\n');
  process.exit(1);
}

const fileName = path.basename(resolved);
const remotePath = `/sdcard/DCIM/Camera/${fileName}`;

function run(cmd) {
  execSync(cmd, { stdio: 'inherit', shell: true });
}

try {
  run(`"${adb}" devices`);
  console.log(`\nPushing to emulator: ${remotePath}\n`);
  run(`"${adb}" push "${resolved}" "${remotePath}"`);
  run(
    `"${adb}" shell am broadcast -a android.intent.action.MEDIA_SCANNER_SCAN_FILE -d file://${remotePath}"`
  );
  console.log('\nDone. Open Gallery in the app (close and reopen the picker if needed).\n');
} catch {
  console.error('\nFailed. Is the emulator running? Start it, then try again.\n');
  process.exit(1);
}
