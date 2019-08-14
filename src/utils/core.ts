import database from './db';

/**
 * Store the version and updated-on date.
 *
 * @return  {Promise<void>}
 */
export async function setup(version: string): Promise<void> {
  await database.create('meta', { key: 'version', value: version });
  await database.create('meta', { key: 'updated-on', value: new Date().toString() });
}

/**
 * Updates the `version` and `updated-on` records.
 * Removes all untracked email records.
 *
 * @return  {Promise<void>}
 */
export async function upgrade(version: string): Promise<void> {
  await database.updateByKey('meta', 'version', { value: version });
  await database.updateByKey('meta', 'updated-on', { value: new Date().toString() });

  // get untracked emails
  const emails = await database.find('emails', null);

  // loop through each email in the db and remove the ones that are not tracked.
  const removedEmails = emails.reduce((arr: Array<Promise<any>>, email: any) => {
    if (email.value) {
      arr.push(database.removeByKey('emails', email.id));
    }

    return arr;
  }, []);

  await Promise.all(removedEmails);
}
