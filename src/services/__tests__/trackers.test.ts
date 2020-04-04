/* eslint-disable no-useless-escape */
import instance, { Trackers } from '../trackers';

describe('Trackers service', () => {
  it('exports instance by default', () => {
    expect(instance instanceof Trackers).toBe(true);
  });

  it('sucessfully initializes', async () => {
    (global as any).fetch = jest.fn(() => Promise.resolve({
      json: () => Promise.resolve({
        version: 5,
        pixels: {
          SendGrid: '\/wf\/open\\?upn=',
        },
      }),
    }));

    expect(instance.version).toBeNull();
    expect(instance.identifiers).toEqual([]);

    await instance.init();

    expect(instance.version).toEqual(5);
    expect(instance.identifiers.length).toEqual(1);
    expect(instance.identifiers).toEqual(['\/wf\/open\\?upn=']);
    expect(instance.pixels.get('\/wf\/open\\?upn=')).toEqual('SendGrid');
  });

  it('matches for pixel', async () => {
    [
      { test: 'testing body copy', res: null },
      { test: 'testing body <img src="http://test.com/wf/open?upn=a"> copy', res: 'SendGrid' },
    ].forEach(({ test, res }) => expect(instance.match(test)).toEqual(res));
  });
});
