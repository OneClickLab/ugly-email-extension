import { findTracker } from './gmail';

function getListOfEmails() {
  const elements = document.querySelectorAll<HTMLSpanElement>('.bog span:not([data-ugly-checked="yes"]');
  return Array.from(elements);
}

function getThread() {
  return document.querySelector<HTMLHeadElement>('h2.hP:not([data-ugly-checked="yes"]');
}

function markElementUgly(element: Element, tracker: string): void {
  const icon = element.querySelector<HTMLImageElement>('img.ugly-email-track-icon');

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

function markListItemUgly(element: HTMLSpanElement, tracker: string): void {
  const parent = element.closest('.xT');

  if (parent) {
    markElementUgly(parent, tracker);
  }
}

function markThreadUgly(element: HTMLHeadElement, tracker: string): void {
  const parent = element.nextElementSibling;

  if (parent) {
    markElementUgly(parent, tracker);
  }
}

export async function checkThread(): Promise<void> {
  const email = getThread();

  if (email) {
    const id = email.dataset.legacyThreadId;

    if (id) {
      const tracker = await findTracker(id);

      if (tracker) {
        markThreadUgly(email, tracker);
      }
    }

    // mark checked
    email.dataset.uglyChecked = 'yes'; // eslint-disable-line no-param-reassign
  }
}

export function checkList(): Promise<void[]> {
  const emails = getListOfEmails();

  const checkedEmails = emails.map(async (email) => {
    const id = email.dataset.legacyThreadId;

    if (id) {
      const tracker = await findTracker(id);

      if (tracker) {
        markListItemUgly(email, tracker);
      }
    }

    // mark checked
    email.dataset.uglyChecked = 'yes'; // eslint-disable-line no-param-reassign
  });

  return Promise.all(checkedEmails);
}
