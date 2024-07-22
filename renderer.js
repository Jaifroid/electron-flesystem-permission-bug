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
    return await new Promise(async (resolve, reject) => {
      const req = (await this.#getObjectStore()).put(dir, 'baseDir');
      req.addEventListener('success', resolve);
      req.addEventListener('error', reject);
    }); 
  }

  static async getBaseDir() {
    return await new Promise(async (resolve, reject) => {
      const req = (await this.#getObjectStore()).get('baseDir');
      req.addEventListener('success', () => {
        resolve(req.result);
      });
      req.addEventListener('error', reject);
    });
  }
}


document.querySelector('[data-action="setDir"]').addEventListener('click', async e => {
  const dir = await window.showDirectoryPicker();

  await dir.requestPermission({
    mode: 'readwrite'
  });

  await Directories.setBaseDir(dir);
  await refreshDir();
});

async function refreshDir() {
  const dir = await Directories.getBaseDir();

  document.querySelector('.dir').textContent = dir?.name || '[not set]';
  document.querySelector('.writable').textContent = (await dir?.queryPermission({ mode: 'readwrite' })) || '';
}

refreshDir();