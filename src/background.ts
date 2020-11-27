import trackers from './services/trackers';

declare let browser: any;

(async () => {
  await trackers.init();

  const filters = {
    urls: ['*://*.googleusercontent.com/proxy/*'],
    types: ['image'],
  };

  type RequestDetails = {
    url: string
  };

  (chrome || browser).webRequest.onBeforeRequest.addListener((details: RequestDetails) => {
    const pixel = trackers.match(details.url);
    return { cancel: !!pixel };
  }, filters, ['blocking']);
})();
