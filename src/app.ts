import Gmailjs from '../vendor/gmail-js';
import database from './utils/db';
import { setup, upgrade } from './utils/core';
import * as pixel from './utils/pixel';
import * as gmail from './utils/gmail';

/**
 * Initlize the app
 *
 * @return  {Promise<void>}
 */
(async () => {
  await database.open();
  await pixel.init();

  const record = await database.findByKey('meta', 'version');
  const version = pixel.getVersion();

  if (!record) {
    await setup(version);
  } else if (record.value !== version) {
    await upgrade(version);
  }

  /**
   * Runs every 2500 milliseconds and triggers a check.
   *
   * @return  {Promise<void>}
   */
  async function observe(): Promise<void> {
    if (Gmailjs.check.is_inside_email()) {
      await gmail.checkThread();
    } else {
      await gmail.checkList();
    }

    // run again 2500 milliseconds
    setTimeout(observe, 2500);
  }

  Gmailjs.observe.on('load', observe);
})();
