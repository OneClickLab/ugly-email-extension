import trackers from './services/trackers';

declare let browser: any;

(async () => {
  await trackers.init();

  const extension = chrome || browser;

  extension.runtime.onInstalled.addListener(() => {
    extension.tabs.create({ url: 'http://gmail.com' });
  });

  const filters = {
    urls: ['https://*.googleusercontent.com/proxy/*'],
    types: ['image'],
  };

  type RequestDetails = {
    url: string
  };

  extension.webRequest.onBeforeRequest.addListener((details: RequestDetails) => {
    const pixel = trackers.match(details.url);
    return { cancel: pixel };
  }, filters, ['blocking']);
})();
