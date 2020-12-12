type Resolver = {
  [id: string]: (val: string | null) => void
};

export class UglyMessenger {
  private resolvers: Resolver = {};

  constructor() {
    window.addEventListener('message', ({ data }) => {
      if (data && data.from && data.from === 'ugly-email-response') {
        this.resolvers[data.id].call(this, data.pixel);
      }
    });
  }

  postMessage(id: string, body: string): Promise<string|null> {
    window.postMessage({ id, body, from: 'ugly-email-check' }, window.origin);

    return new Promise((resolve) => {
      this.resolvers[id] = resolve;
    });
  }
}

export default new UglyMessenger();
