import * as gmail from '../../src/utils/gmail';
import * as database from '../../src/utils/database';

jest.mock('../../vendor/gmail-js', () => ({}));

describe('gmail util', () => {
  it('finds a tracker by id', async () => {
    const findEmailById = jest.spyOn(database, 'findEmailById').mockResolvedValue({
      id: '12345',
      value: 'SendGrid',
    });

    const tracker = await gmail.findTracker('12345');
    expect(tracker).toEqual('SendGrid');
    expect(findEmailById).toBeCalledWith('12345');
  });
});
