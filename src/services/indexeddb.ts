export class IndexedDB {
  name = 'ugly-email';

  version = 1;

  db: IDBDatabase;

  findByKey(table: string, key: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const request = this.store(table).get(key);

      request.onerror = reject;
      request.onsuccess = () => resolve(request.result);
    });
  }

  find(table: string, query: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const request = this.store(table).getAll(query);

      request.onerror = reject;
      request.onsuccess = ({ target }: any) => resolve(target.result);
    });
  }

  create(table: string, data: any = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      const request = this.store(table).add(data);

      request.onerror = reject;
      request.onsuccess = () => resolve(request.result);
    });
  }

  async updateByKey(table: string, key: string, data: any = {}): Promise<any> {
    const record = await this.findByKey(table, key);

    return new Promise((resolve, reject) => {
      const request = this.store(table).put({ ...record, ...data });
      request.onerror = reject;
      request.onsuccess = () => resolve(request.result);
    });
  }

  removeByKey(table: string, key: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const request = this.store(table).delete(key);

      request.onerror = reject;
      request.onsuccess = resolve;
    });
  }

  init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.name, this.version);

      request.onerror = reject;

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = async () => {
        this.db = request.result;
        await this.upgrade();
        resolve();
      };
    });
  }

  upgrade(): Promise<any> {
    const createEmails = () => new Promise((resolve) => {
      const store = this.db.createObjectStore('emails', { keyPath: 'id' });

      store.createIndex('tracker', 'value', { unique: false });

      store.transaction.oncomplete = resolve;
    });

    const createMeta = () => new Promise((resolve) => {
      const store = this.db.createObjectStore('meta', { keyPath: 'key' });
      store.transaction.oncomplete = resolve;
    });

    return Promise.all([createEmails(), createMeta()]);
  }

  store(table: string, role: IDBTransactionMode = 'readwrite'): IDBObjectStore {
    return this.db.transaction([table], role).objectStore(table);
  }
}

export default new IndexedDB();
