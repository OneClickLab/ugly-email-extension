import worker from './worker';

type ServerResponse = {
  version: number,
  pixels: {
    [key: string]: string
  }
}

export class Trackers {
  version: number

  identifiers: string[] = []

  pixels = new Map()

  async init() {
    const trackers = await Trackers.fetchTrackers();

    this.version = trackers.version;
    this.identifiers = Object.values(trackers.pixels);

    const pixels = Object.entries(trackers.pixels).map(([key, val]) => [val, key]);

    this.pixels = new Map(pixels as [string, string][]);
  }

  static async fetchTrackers(): Promise<ServerResponse> {
    const response = await fetch(`https://trackers.uglyemail.com/list.json?ts=${new Date().getTime()}`);
    return response.json();
  }

  match(body: string): string | null {
    const pixel = this.identifiers.find((p) => new RegExp(p, 'g').test(body));
    return pixel ? this.pixels.get(pixel) : null;
  }

  async matchAsync(id: string, body: string): Promise<string | null> {
    const pixel = await worker.postMessage(id, body, this.identifiers);
    return pixel ? this.pixels.get(pixel) : null;
  }
}

export default new Trackers();
