function workerFunction() {
  self.addEventListener('message', ({ data }) => { // eslint-disable-line no-restricted-globals
    const pixel = data.identifiers.find((p:string) => new RegExp(p, 'g').test(data.body));
    // @ts-ignore
    self.postMessage({ pixel, id: data.id }); // eslint-disable-line no-restricted-globals
  });
}

export class UglyWorker {
  instance: Worker

  resolvers: {
    [id: string]: () => void
  }

  init() {
    const blob = new Blob([`(${workerFunction.toString()})()`], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);

    this.instance = new Worker(url);
    this.resolvers = {};

    this.instance.onmessage = ({ data }) => {
      this.resolvers[data.id].call(this, data.pixel);
    };
  }

  postMessage(id: string, body: string, identifiers: string[]) {
    this.instance.postMessage({ id, body, identifiers });
    return new Promise((resolve) => {
      this.resolvers[id] = resolve;
    });
  }
}

export default new UglyWorker();
