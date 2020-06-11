import Gmail from '../../vendor/gmail-js';
import trackers from '../services/trackers';
import { findEmailById, createEmail } from './database';

/**
 * Fetch email thread by id
 * it will try 3 times before giving up.
 */
export function fetchEmailById(id: string): Promise<any> {
  return new Promise((resolve, reject) => {
    let count = 0;
    let timer: NodeJS.Timeout;

    // fetch data
    const fetchData = () => {
      count += 1;

      Gmail.get.email_data_async(id, (email: any) => {
        clearTimeout(timer);

        if (email.thread_id) {
          const last = email.last_email;
          const thread = email.threads[last];

          return resolve(thread);
        }

        // if thread is not there, try again.
        if (count < 3) {
          timer = setTimeout(fetchData, 1000);
          return null;
        }

        return reject();
      });
    };

    // start
    fetchData();
  });
}

export async function findTracker(id: string): Promise<string|null> {
  const record = await findEmailById(id);

  if (record) {
    return record.value;
  }

  try {
    // fetch email
    const email = await fetchEmailById(id);

    // check if email is tracked
    const tracker = await trackers.matchAsync(id, email.content_html);

    // create a new record
    await createEmail(id, tracker);

    return tracker;
  } catch {
    return null;
  }
}
