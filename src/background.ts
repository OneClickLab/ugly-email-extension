import trackers from './services/trackers';

(async () => {
  await trackers.init();

  type RequestDetails = {
    url: string
  };

  chrome.webRequest.onBeforeRequest.addListener((details: RequestDetails) => {
    const pixel = trackers.match(details.url);
    return { cancel: !!pixel };
  }, {
    urls: ['*://*.googleusercontent.com/*'],
    types: ['image'],
  }, ['blocking']);

  chrome.runtime.onConnect.addListener((port: any) => {
    port.onMessage.addListener((data: { id: string, body: string }) => {
      const pixel = trackers.match(data.body);
      port.postMessage({ pixel, id: data.id });
    });
  });
})();
