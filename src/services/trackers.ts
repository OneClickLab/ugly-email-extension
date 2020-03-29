type ServerResponse = {
  version: number,
  pixels: {
    [key: string]: string
  }
}

export class Trackers {
  version: number = null

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

  match(body: string): string {
    const pixel = this.identifiers.find((p) => new RegExp(p, 'g').test(body));
    return pixel ? this.pixels.get(pixel) : null;
  }
}

export default new Trackers();
