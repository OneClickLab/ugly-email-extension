declare let chrome: any;

const u = document.createElement('script');
u.src = chrome.extension.getURL('uglyemail.js');

(document.head || document.documentElement).appendChild(u);

const s = document.createElement('style');
s.appendChild(document.createTextNode(`
.ade .ugly-email-track-icon {
  margin-top: -6px;
  height: 20px;
  width: 20px;
  opacity: .6;
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
  top: 3px;
}
`));

(document.head || document.documentElement).appendChild(s);
