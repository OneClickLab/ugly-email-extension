import Gmailjs from '../vendor/gmail-js';
import * as gmail from './utils/dom';
import { init } from './utils/core';

(async () => {
  await init();

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
