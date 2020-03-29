import 'fake-indexeddb/auto';
import * as database from '../database';
import indexeddb from '../../services/indexeddb';

describe('database util', () => {
  it('setups the version', async () => {
    await indexeddb.init();

    const testOne = await database.getCurrentVersion();
    expect(testOne).toBeNull();

    await database.setup(5);

    const testTwo = await database.getCurrentVersion();
    expect(testTwo).toEqual(5);
  });

  it('upgrades the version', async () => {
    const testOne = await database.getCurrentVersion();
    expect(testOne).toEqual(5);

    await database.upgrade(7);

    const testTwo = await database.getCurrentVersion();
    expect(testTwo).toEqual(7);
  });

  it('stores email', async () => {
    await Promise.all([
      database.createEmail('54321', 'MailChimp'),
      database.createEmail('12345', 'SendGrid'),
      database.createEmail('33333', null),
    ]);

    expect(true).toBeTruthy();
  });

  it('finds email by id', async () => {
    const email = await database.findEmailById('12345');
    expect(email).toEqual({ id: '12345', value: 'SendGrid' });
  });

  it('finds all emails', async () => {
    const emails = await database.findAllEmails();
    expect(emails.length).toEqual(3);
    expect(emails).toEqual([
      { id: '12345', value: 'SendGrid' },
      { id: '33333', value: null },
      { id: '54321', value: 'MailChimp' },
    ]);
  });

  it('flushes all untracked emails', async () => {
    const testOne = await database.findAllEmails();
    expect(testOne.length).toEqual(3);

    await database.flushUntracked();

    const testTwo = await database.findAllEmails();
    expect(testTwo.length).toEqual(2);
  });
});
