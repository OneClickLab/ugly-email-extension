let VERSION: string = null;
let PIXELS: string[] = [];
let TRACKERS = new Map();

interface Response {
  version: string,
  pixels: {
    key: string
  }
}

/**
 * Get the pixel version
 *
 * @return  {string}
 */
export function getVersion(): string {
  return VERSION;
}

/**
 * Fetch pixels
 *
 * @return  {Promise<Response>}
 */
export async function fetchPixels(): Promise<Response> {
  const response = await fetch(`https://trackers.uglyemail.com/list.json?ts=${new Date().getTime()}`);
  return response.json();
}

/**
 * Check if string contains a pixel
 *
 * @param   {string}  text
 *
 * @return  {string}
 */
export function checkForPixel(text: string): string {
  const pixel = PIXELS.find((p) => new RegExp(p, 'g').test(text));
  return pixel ? TRACKERS.get(pixel) : null;
}

/**
 * Initilize
 *
 * @return  {Promise<void>}
 */
export async function init(): Promise<void> {
  const { version, pixels } = await fetchPixels();

  VERSION = version;
  TRACKERS = new Map(Object.entries(pixels));
  PIXELS = [...TRACKERS.keys()];
}
