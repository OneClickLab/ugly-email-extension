import * as gmail from '../gmail';
import * as database from '../database';

jest.mock('../../../vendor/gmail-js', () => ({}));

describe('gmail util', () => {
  it('finds a tracker by id', async () => {
    jest.spyOn(database, 'findEmailById').mockResolvedValue({
      id: '12345',
      value: 'SendGrid',
    });

    const tracker = await gmail.findTracker('12345');
    expect(tracker).toEqual('SendGrid');
  });
});
