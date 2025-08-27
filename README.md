# Electron File System API Permission Bug

This repository demonstrates a bug with persistent permissions in Electron's File System Access API implementation.

## Issue

When an Electron app tries to request permissions for a previously stored directory handle on startup (without user activation), it throws a SecurityError: "User activation is required to request permissions." This prevents persistent permissions from working properly in Electron.

## How to reproduce

1. Run the app: `npm start`
2. Click "Choose Directory" and select a folder
3. Note it shows "granted" permission status
4. Close and restart the app
5. The directory is remembered but shows "prompt (SecurityError: User activation required)" in red

## Attribution

Based on [bradisbell's gist](https://gist.github.com/bradisbell/86ae72ea9709c471a0c4f49fea9dd0e0) with modifications to demonstrate the permission bug more clearly.