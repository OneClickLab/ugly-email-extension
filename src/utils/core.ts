import indexedDB from '../services/indexeddb';
import trackers from '../services/trackers';
import { flushUntracked } from './database';

export async function setup(version: number):Promise<void> {
  await indexedDB.create('meta', { key: 'version', value: version });
  await indexedDB.create('meta', { key: 'updated-on', value: new Date().toString() });
}

export async function upgrade(version: number):Promise<void> {
  await indexedDB.updateByKey('meta', 'version', { value: version });
  await indexedDB.updateByKey('meta', 'updated-on', { value: new Date().toString() });
  await flushUntracked();
}

export async function getCurrentVersion():Promise<number> {
  const record = await indexedDB.findByKey('meta', 'version');
  return record ? record.value : null;
}

export async function init():Promise<void> {
  await indexedDB.init();
  await trackers.init();

  const currentVersion = await getCurrentVersion();

  // first time setup
  if (!currentVersion) {
    await setup(trackers.verision);
  } else if (currentVersion !== trackers.verision) {
    await upgrade(trackers.verision);
  }
}
