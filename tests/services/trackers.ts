/* eslint-disable no-useless-escape */
import fetchMock from 'jest-fetch-mock';
import trackerInstance, { Trackers } from '../../src/services/trackers';
import workerInstance from '../../src/services/worker';

describe('Trackers service', () => {
  afterAll(() => {
    jest.resetAllMocks();
  });

  it('exports instance by default', () => {
    expect(trackerInstance).toBeInstanceOf(Trackers);
  });

  it('sucessfully initializes', async () => {
    const version = jest.spyOn(Trackers, 'fetchVersion').mockResolvedValueOnce(5);
    const trackers = jest.spyOn(Trackers, 'fetchTrackers').mockResolvedValueOnce([{
      name: 'SendGrid', pattern: '\/wf\/open\\?upn=',
    }]);

    expect(trackerInstance.version).toBeUndefined();
    expect(trackerInstance.identifiers).toEqual([]);
    expect(trackerInstance.pixels).toEqual(new Map());

    await trackerInstance.init();

    expect(trackers).toHaveBeenCalled();
    expect(version).toHaveBeenCalled();

    expect(trackerInstance.version).toEqual(5);
    expect(trackerInstance.identifiers.length).toEqual(1);
    expect(trackerInstance.identifiers).toEqual(['\/wf\/open\\?upn=']);
    expect(trackerInstance.pixels.get('\/wf\/open\\?upn=')).toEqual('SendGrid');
  });

  it('matches for pixel', async () => {
    expect(trackerInstance.match('testing body copy')).toBeNull();
    expect(trackerInstance.match('testing body <img src="http://test.com/wf/open?upn=a"> copy')).toEqual('SendGrid');
  });

  it('matches pixel async', async () => {
    const worker = jest.spyOn(workerInstance, 'postMessage')
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce('/wf/open\\?upn=');

    const responseOne = await trackerInstance.matchAsync('1', 'testing body copy');
    const responseTwo = await trackerInstance.matchAsync('2', 'testing body <img src="http://test.com/wf/open?upn=a"> copy');

    expect(worker).toBeCalledWith('1', 'testing body copy', ['/wf/open\\?upn=']);
    expect(responseOne).toBeNull();

    expect(worker).toBeCalledWith('2', 'testing body <img src="http://test.com/wf/open?upn=a"> copy', ['/wf/open\\?upn=']);
    expect(responseTwo).toEqual('SendGrid');
  });

  it('fetches pixels and formats them', async () => {
    jest.spyOn(Date.prototype, 'getTime').mockImplementationOnce(() => 12345);

    fetchMock.enableMocks();
    const fetch = fetchMock.mockResponseOnce('SendGrid@@=\/wf\/open\?upn=\nMailChimp@@=\/track\/open\.php\?u=');

    const response = await Trackers.fetchTrackers();

    expect(fetch).toHaveBeenCalled();
    expect(fetch).toBeCalledWith('https://trackers.uglyemail.com/list.txt?ts=12345');
    expect(response).toEqual([
      { name: 'SendGrid', pattern: '/wf/open?upn=' },
      { name: 'MailChimp', pattern: '/track/open.php?u=' },
    ]);
  });

  it('fetches version and formats them', async () => {
    jest.spyOn(Date.prototype, 'getTime').mockImplementationOnce(() => 12345);

    fetchMock.enableMocks();
    const fetch = fetchMock.mockResponseOnce('5');

    const response = await Trackers.fetchVersion();

    expect(fetch).toHaveBeenCalled();
    expect(fetch).toBeCalledWith('https://trackers.uglyemail.com/version.txt?ts=12345');
    expect(response).toEqual(5);
  });
});
