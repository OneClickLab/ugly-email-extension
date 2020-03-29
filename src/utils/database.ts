import indexedDB from '../services/indexeddb';

type Email = {
  id: string
  value?: string
};

export async function setup(version: number):Promise<void> {
  await indexedDB.create('meta', { key: 'version', value: version });
  await indexedDB.create('meta', { key: 'updated-on', value: new Date().toString() });
}

export async function upgrade(version: number):Promise<void> {
  await indexedDB.updateByKey('meta', 'version', { value: version });
  await indexedDB.updateByKey('meta', 'updated-on', { value: new Date().toString() });
}

export async function getCurrentVersion():Promise<number> {
  const record = await indexedDB.findByKey('meta', 'version');
  return record ? record.value : null;
}

export function createEmail(id: string, tracker?: string): Promise<Email> {
  return indexedDB.create('emails', { id, value: tracker });
}

export async function findEmailById(id: string): Promise<Email> {
  const record = await indexedDB.findByKey('emails', id);
  return record;
}

export async function findAllEmails(): Promise<Email[]> {
  const emails = await indexedDB.find('emails', null);
  return emails || [];
}

export async function flushUntracked() {
  const emails = await this.findAllEmails();

  // loop through each email in the db and remove the ones that are not tracked.
  const removedEmails = emails.reduce((arr: Array<Promise<any>>, email: any) => {
    if (!email.value) {
      arr.push(indexedDB.removeByKey('emails', email.id));
    }

    return arr;
  }, []);

  return Promise.all(removedEmails);
}
