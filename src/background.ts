import trackers from './services/trackers';

declare let chrome: any;

(async () => {
  await trackers.init();

  const filters = {
    urls: ['*://*.googleusercontent.com/proxy/*'],
    types: ['image'],
  };

  type RequestDetails = {
    url: string
  };

  chrome.webRequest.onBeforeRequest.addListener((details: RequestDetails) => {
    const pixel = trackers.match(details.url);
    return { cancel: !!pixel };
  }, filters, ['blocking']);

  chrome.runtime.onConnect.addListener((port: any) => {
    port.onMessage.addListener((data: { id: string, body: string }) => {
      const pixel = trackers.match(data.body);
      port.postMessage({ pixel, id: data.id });
    });
  });
})();
