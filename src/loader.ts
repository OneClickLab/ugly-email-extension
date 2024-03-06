const u = document.createElement('script');
u.src = chrome.extension.getURL('uglyemail.js');

(document.head || document.documentElement).appendChild(u);

const connection = chrome.runtime.connect({ name: 'ugly-email' });

connection.onMessage.addListener((message: { id: string, pixel: string }) => {
  window.postMessage({ ...message, from: 'ugly-email-response' }, window.origin);
});

window.addEventListener('message', ({ data }) => {
  if (data.from && data.from === 'ugly-email-check') {
    connection.postMessage(data);
  }
});

const s = document.createElement('style');
s.appendChild(document.createTextNode(`
.J-J5-Ji .ugly-email-track-icon {
  height: 18px;
  width: 18px;
  margin-top: 4px;
  margin-right: 8px;
}

.ugly-email-track-icon {
  text-align: center;
  line-height: 22px;
  background: white;
  padding: 0 1px;
  border-radius: 100%;
  height: 16px;
  width: 16px;
  float: left;
  margin-right: 5px;
  position: relative;
}
`));

(document.head || document.documentElement).appendChild(s);
