import Gmailjs from '../vendor/gmail-js';
import * as gmail from './utils/dom';
import * as database from './utils/database';
import indexedDB from './services/indexeddb';
import trackers from './services/trackers';

(async () => {
  await Promise.all([
    indexedDB.init(),
    trackers.init(),
  ]);

  const currentVersion = await database.getCurrentVersion();

  // first time setup
  if (!currentVersion) {
    await database.setup(trackers.verision);
  } else if (currentVersion !== trackers.verision) {
    await Promise.all([
      database.upgrade(trackers.verision),
      database.upgrade(trackers.verision),
    ]);
  }

  /**
   * Runs every 2500ms
   */
  async function observe(): Promise<void> {
    if (Gmailjs.check.is_inside_email()) {
      await gmail.checkThread();
    } else {
      await gmail.checkList();
    }

    setTimeout(observe, 2500);
  }

  Gmailjs.observe.on('load', observe);
})();
