# Electron File System API Permission Bug

This repository demonstrates a bug with persistent permissions in Electron's File System Access API implementation.

## Issue

When an Electron app tries to request permissions for a previously stored directory handle on startup (without user activation), it throws a SecurityError: "User activation is required to request permissions." This prevents persistent permissions from working properly in Electron.

## How to reproduce

### Testing in Electron
1. Clone the repo
2. Delete the existing electron -> dist folder in node_modules
3. Add the dist folder from the artefact you wish to test
4. Run the app: `npm start`
5. Click "Choose Directory" and select a folder
6. Note it shows "granted" permission status with a green checkmark
7. Close and restart the app
8. The directory is remembered but shows "prompt (SecurityError: User activation required)" in red if the bug is still present in the version of Electron you are testing.

### Testing in Browser Context (Expected Behavior)
**Note: Must be tested in a Chromium-based browser (Chrome, Edge, etc.) as Firefox doesn't support persistent permissions for File System Access API.**

1. Install dependencies: `npm install`
2. Start the development server: `npm run serve`
3. The app will open in your default browser at http://localhost:8080
4. Click "Choose Directory" and select a folder
5. Note it shows "granted" permission status with a green checkmark
6. Refresh the page or close and reopen the tab
7. The directory should still be remembered and show "granted" status (this is the correct behavior that should also work in Electron)

## Attribution

Based on [bradisbell's gist](https://gist.github.com/bradisbell/86ae72ea9709c471a0c4f49fea9dd0e0) with modifications to demonstrate the permission bug more clearly.