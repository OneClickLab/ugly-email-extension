import Gmail from '../../vendor/gmail-js';
import trackers from '../services/trackers';
import { findEmailById, createEmail } from './database';

/**
 * Fetch email thread by id
 * it will try 8 times before giving up.
 */
export function fetchEmailById(id: string): Promise<any> {
  return new Promise((resolve, reject) => {
    let count = 0;

    // fetch data
    const fetchData = () => {
      count += 1;

      Gmail.get.email_data_async(id, (email: any) => {
        if (email.thread_id) {
          const last = email.last_email;
          const thread = email.threads[last];

          return resolve(thread);
        }

        // if thread is not there, try again.
        if (count < 8) {
          return setTimeout(fetchData, 1000);
        }

        return reject();
      });
    };

    // start
    fetchData();
  });
}

/**
 * Checks for email in the Database before fetching it.
 */
export async function findTracker(id: string): Promise<string> {
  const record = await findEmailById(id);

  if (record) {
    return record.value;
  }

  // fetch email
  const email = await fetchEmailById(id);

  // check if email is tracked
  const tracker = trackers.match(email.content_html);

  // create a new record
  await createEmail(id, tracker);

  return tracker;
}
