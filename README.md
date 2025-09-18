# File System Access API Persistent Permissions Test

This test case demonstrates **persistent filesystem permissions** working correctly in **Electron nightly** (40.x+) following the implementation in [PR #48170](https://github.com/electron/electron/pull/48170).

## What This Tests

- **File System Access API** persistent permissions in Electron
- **IndexedDB storage** of directory handles across app restarts
- **Session permission handlers** for both initial and persistent permission requests
- **No user activation required** for accessing previously granted permissions

## Quick Start

1. **Install Electron nightly:**
   ```bash
   npm install electron-nightly
   ```

2. **Update package.json start script if necessary to use electron-nightly:**
   ```json
   {
     "scripts": {
       "start": "npx electron-nightly ."
     }
   }
   ```

3. **Run the test:**
   ```bash
   npm start
   ```

## How It Works

The implementation requires **both session handlers** in `main.js`:

- `session.defaultSession.setPermissionRequestHandler()` - handles initial permission requests
- `session.defaultSession.setPermissionCheckHandler()` - handles persistent permission checks

When a stored directory handle calls `queryPermission()`, it triggers the **check handler** rather than requiring new user activation.

## Test Steps

1. Click "Choose Directory" and select a folder
2. Verify it shows "granted" status in green
3. **Restart the app**
4. The directory should still be there with "granted" status ✅

If you see "prompt" with a SecurityError, persistent permissions are not working.

## Browser Support

- ✅ **Electron (nightly) (40.x+)** - with proper session handlers
- ✅ **Chrome/Edge** - with native persistent permissions support

## Related

- **Original issue:** [electron/electron#41957](https://github.com/electron/electron/issues/41957)
- **Implementation PR:** [electron/electron#48170](https://github.com/electron/electron/pull/48170)
- **File System Access API:** [MDN Documentation](https://developer.mozilla.org/en-US/docs/Web/API/File_System_API)