if (!window.URL.createObjectURL) {
  window.URL.createObjectURL = () => jest.fn();
}

if (!window.Worker) {
  window.Worker = class {
    postMessage() { }
  }
}