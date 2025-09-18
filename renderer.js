class Directories {
  static #db = new Promise((resolve, reject) => {
    const req = indexedDB.open('handles', 1);
    req.addEventListener('blocked', reject);
    req.addEventListener('error', reject);
    req.addEventListener('upgradeneeded', (e) => { // Occurs before 'success' event
      e.target.result.createObjectStore('handles');
    });
    req.addEventListener('success', e => {
      resolve(e.target.result);
    });
  });

  static async #getObjectStore () {
    return (await this.#db)
      .transaction(['handles'], 'readwrite')
      .objectStore('handles')
    ;
  }

  static async setBaseDir(dir) {
    console.log('📁 Storing directory handle in IndexedDB:', dir.name);
    return await new Promise(async (resolve, reject) => {
      const req = (await this.#getObjectStore()).put(dir, 'baseDir');
      req.addEventListener('success', () => {
        console.log('✅ Directory handle stored successfully');
        resolve();
      });
      req.addEventListener('error', (e) => {
        console.error('❌ Failed to store directory handle:', e);
        reject(e);
      });
    });
  }

  static async getBaseDir() {
    console.log('🔍 Retrieving directory handle from IndexedDB...');
    return await new Promise(async (resolve, reject) => {
      const req = (await this.#getObjectStore()).get('baseDir');
      req.addEventListener('success', () => {
        const result = req.result;
        if (result) {
          console.log('✅ Retrieved directory handle:', result.name);
        } else {
          console.log('📭 No directory handle found in IndexedDB');
        }
        resolve(result);
      });
      req.addEventListener('error', (e) => {
        console.error('❌ Failed to retrieve directory handle:', e);
        reject(e);
      });
    });
  }
}


document.querySelector('[data-action="setDir"]').addEventListener('click', async e => {
  console.log('🎯 User clicked setDir button');

  try {
    console.log('📂 Opening directory picker...');
    const dir = await window.showDirectoryPicker();
    console.log('📂 Directory selected:', dir.name);

    console.log('🔒 Requesting readwrite permission...');
    const permissionResult = await dir.requestPermission({
      mode: 'readwrite'
    });
    console.log('🔒 Permission request result:', permissionResult);

    const finalStatus = await dir.queryPermission({ mode: 'readwrite' });
    console.log('🔒 Final permission status:', finalStatus);

    await Directories.setBaseDir(dir);
    await refreshDir();
  } catch (error) {
    console.error('❌ Error in setDir process:', error);
  }
});

async function refreshDir() {
  console.log('🔄 Refreshing directory status...');
  const dir = await Directories.getBaseDir();
  let permissionStatus = '';
  let errorInfo = '';

  if (dir) {
    console.log('📂 Found stored directory handle:', dir.name);

    // First, check current permission status without requesting
    console.log('🔐 Checking current permission status...');
    const currentStatus = await dir.queryPermission({ mode: 'readwrite' });
    console.log('🔐 Current permission status:', currentStatus);

    if (currentStatus === 'granted') {
      console.log('✅ Permissions already granted - no need to request');
      permissionStatus = currentStatus;
    } else {
      console.log('⚠️ Permissions not granted, attempting to request...');
      try {
        // Request permission for the stored directory handle to restore persistent permissions
        // This may throw SecurityError in Electron if persistent permissions aren't working
        console.log('🙏 Requesting permission for stored handle...');
        await dir.requestPermission({ mode: 'readwrite' });
        permissionStatus = await dir.queryPermission({ mode: 'readwrite' });
        console.log('✅ Permission request succeeded, new status:', permissionStatus);
      } catch (error) {
        console.error('❌ Failed to request permission:', error);
        console.error('   Error name:', error.name);
        console.error('   Error message:', error.message);

        // Still check the final permission status
        permissionStatus = await dir.queryPermission({ mode: 'readwrite' });
        console.log('🔐 Final permission status after error:', permissionStatus);

        if (error instanceof DOMException && error.name === 'SecurityError') {
          errorInfo = ' (SecurityError: User activation required)';
        } else {
          errorInfo = ` (Error: ${error.message})`;
        }
      }
    }
  } else {
    console.log('📭 No directory handle stored');
  }

  document.querySelector('.dir').textContent = dir?.name || '[not set]';
  const writableElement = document.querySelector('.writable');
  writableElement.textContent = permissionStatus + errorInfo;
  
  // Reset classes
  writableElement.classList.remove('error-text', 'granted-text');
  
  if (errorInfo) {
    writableElement.classList.add('error-text');
  } else if (permissionStatus === 'granted') {
    writableElement.classList.add('granted-text');
  }
}

refreshDir();