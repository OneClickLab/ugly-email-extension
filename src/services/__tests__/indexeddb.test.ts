import 'fake-indexeddb/auto';
import instance, { IndexedDB } from '../indexeddb';

describe('IndexedDB service', () => {
  it('exports instance by default', () => {
    expect(instance instanceof IndexedDB).toBeTruthy();
  });

  it('sucessfully opens connection', async () => {
    expect(instance.db).toBeUndefined();

    await instance.init();

    expect(instance.db).not.toBeNull();
  });

  it('creates record', async () => {
    const record = await instance.create('emails', {
      id: '12345',
      value: 'testing'
    });

    expect(record).toEqual('12345');
  });

  it('finds record by key', async () => {
    const record = await instance.findByKey('emails', '12345');
    expect(record).toEqual({ id: '12345', value: 'testing' });
  });

  it('removes by key', async () => {
    const firstTest = await instance.findByKey('emails', '12345');
    expect(firstTest).toBeDefined();

    await instance.removeByKey('emails', '12345');

    const secondTest = await instance.findByKey('emails', '12345');
    expect(secondTest).toBeUndefined();
  });
});
