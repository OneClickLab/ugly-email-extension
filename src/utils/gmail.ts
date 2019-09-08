import database from './db';
import Gmail from '../../vendor/gmail-js';
import { checkForPixel } from './pixel';

/**
 * Fetch email thread by id
 * it will try 8 times before giving up.
 */
export function fetchById(id: string): Promise<any> {
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
 * Get all the `span` elements from the list
 */
function getListOfEmails(): HTMLSpanElement[] {
  const elements: NodeListOf<HTMLSpanElement> = document.querySelectorAll('.bog span:not([data-ugly-checked="yes"]');
  return Array.from(elements);
}

/**
 * Get the current thread ID
 */
function getThreadId(): string {
  const element: HTMLHeadingElement = document.querySelector('h2.hP');
  return element.dataset.legacyThreadId;
}

/**
 * First checks if the `element` contains the ugly icon,
 * if not, it creates one and prepend it.
 */
function markElementUgly(element: Element, tracker: string): void {
  const icon: HTMLImageElement = element.querySelector('img.ugly-email-track-icon');

  // if icon is already set, no need to do it again.
  if (icon) {
    return;
  }

  // create image element
  const img = document.createElement('img');

  img.src = 'data:image/svg+xml;utf8,<svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="eye" class="svg-inline--fa fa-eye fa-w-18" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M288 144a110.94 110.94 0 0 0-31.24 5 55.4 55.4 0 0 1 7.24 27 56 56 0 0 1-56 56 55.4 55.4 0 0 1-27-7.24A111.71 111.71 0 1 0 288 144zm284.52 97.4C518.29 135.59 410.93 64 288 64S57.68 135.64 3.48 241.41a32.35 32.35 0 0 0 0 29.19C57.71 376.41 165.07 448 288 448s230.32-71.64 284.52-177.41a32.35 32.35 0 0 0 0-29.19zM288 400c-98.65 0-189.09-55-237.93-144C98.91 167 189.34 112 288 112s189.09 55 237.93 144C477.1 345 386.66 400 288 400z"></path></svg>';
  img.className = 'ugly-email-track-icon';
  img.dataset.tooltip = tracker;

  element.prepend(img);
}

/**
 * Mark the list item ugly
 */
function markListItemUgly(element: HTMLSpanElement, tracker: string): void {
  const parent: Element = element.closest('.xT');
  markElementUgly(parent, tracker);
}

/**
 * Mark the thread ugly
 */
function markThreadUgly(tracker: string): void {
  const parent: HTMLDivElement = document.querySelector('.ade');
  markElementUgly(parent, tracker);
}

/**
 * Checks for email in the Database before fetching it.
 */
async function getTracker(id: string): Promise<null|string> {
  let tracker = null;
  const record = await database.findByKey('emails', id);

  if (record) {
    tracker = record.value;
  } else {
    // fetch email
    const email = await fetchById(id);

    // check if email is tracked
    tracker = checkForPixel(email.content_html);

    // create a new record
    await database.create('emails', { id, value: tracker });
  }

  return tracker;
}

/**
 * Check thread page
 */
export async function checkThread(): Promise<void> {
  const id: string = getThreadId();
  const tracker = await getTracker(id);

  if (tracker) {
    markThreadUgly(tracker);
  }
}

/**
 * Check the list page
 */
export async function checkList(): Promise<void> {
  const emails = getListOfEmails();

  const checkEmail = (email: any) => new Promise((resolve) => {
    const id = email.dataset.legacyThreadId;

    getTracker(id).then((tracker) => {
      if (tracker) {
        markListItemUgly(email, tracker);
      }

      // mark checked
      email.dataset.uglyChecked = 'yes'; // eslint-disable-line no-param-reassign
      resolve();
    });
  });

  const checkedEmails = emails.map(checkEmail);
  await Promise.all(checkedEmails);
}
