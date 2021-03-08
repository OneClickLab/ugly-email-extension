export class Trackers {
  version: number;

  identifiers: string[] = [];

  pixels = new Map();

  async init() {
    const trackers = await Trackers.fetchTrackers();

    this.version = await Trackers.fetchVersion();

    trackers.forEach(({ name, pattern }) => {
      this.identifiers.push(pattern);
      this.pixels.set(pattern, name);
    });
  }

  static async fetchTrackers(): Promise<{ name: string, pattern: string }[]> {
    const response = await fetch(`https://trackers.uglyemail.com/list.txt?ts=${new Date().getTime()}`);
    const text = await response.text();
    return text.split('\n').map((row) => {
      const [name, pattern] = row.split('@@=');
      return { name, pattern };
    });
  }

  static async fetchVersion(): Promise<number> {
    const response = await fetch(`https://trackers.uglyemail.com/version.txt?ts=${new Date().getTime()}`);
    const text = await response.text();
    return parseInt(text, 10);
  }

  match(body: string): string | null {
    const pixel = this.identifiers.find((p) => new RegExp(p, 'gi').test(body));
    return pixel ? this.pixels.get(pixel) : null;
  }
}

export default new Trackers();
