export class DataBase {
  name: string;

  version: number;

  db: IDBDatabase;

  constructor() {
    this.name = 'ugly-email';
    this.version = 1;
  }

  /**
   * Find record by key
   *
   * @param   {string}        table
   * @param   {string}        key
   *
   * @return  {Promise<any>}
   */
  findByKey(table: string, key: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const request = this.store(table).get(key);

      request.onerror = reject;
      request.onsuccess = () => resolve(request.result);
    });
  }

  /**
   * Find using a query
   *
   * @param   {string}        table
   * @param   {string}        index
   * @param   {any}           query
   *
   * @return  {Promise<any>}
   */
  find(table: string, query: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const request = this.store(table).getAll(query);

      request.onerror = reject;
      request.onsuccess = ({ target }: any) => resolve(target.result);
    });
  }

  /**
   * Create record
   *
   * @param   {string}  table
   * @param   {any}     data
   *
   * @return  {Promise<any>}
   */
  create(table: string, data: any = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      const request = this.store(table).add(data);

      request.onerror = reject;
      request.onsuccess = () => resolve(request.result);
    });
  }

  /**
   * Update record by key
   *
   * @param   {string}  table
   * @param   {string}  key
   * @param   {any}     data
   *
   * @return  {Promise<any>}
   */
  async updateByKey(table: string, key: string, data: any = {}): Promise<any> {
    const record = await this.findByKey(table, key);

    return new Promise((resolve, reject) => {
      const request = this.store(table).put({ ...record, ...data });
      request.onerror = reject;
      request.onsuccess = () => resolve(request.result);
    });
  }

  /**
   * Remove record by key
   *
   * @param   {string}        table
   * @param   {string}        key
   *
   * @return  {Promise<any>}
   */
  removeByKey(table: string, key: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const request = this.store(table).delete(key);

      request.onerror = reject;
      request.onsuccess = resolve;
    });
  }

  /**
   * Open connection
   *
   * @return  {Promise<any>}
   */
  open(): Promise<any> {
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

  /**
   * Upgrade Database
   *
   * @return  {Promise<any>}
   */
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

  /**
   * Instnace of table strore
   *
   * @param   {string}              table
   * @param   {IDBTransactionMode}  role
   *
   * @return  {IDBObjectStore}
   */
  store(table: string, role: IDBTransactionMode = 'readwrite'): IDBObjectStore {
    return this.db.transaction([table], role).objectStore(table);
  }
}

export default new DataBase();
