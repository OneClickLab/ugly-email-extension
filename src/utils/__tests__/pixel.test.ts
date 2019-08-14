import * as pixels from '../pixel';

describe('pixel', () => {
  (global as any).fetch = jest.fn(() => Promise.resolve({
    json: () => Promise.resolve({
      version: '1.2.3',
      pixels: {},
    }),
  }));

  it('fetches the pixels', async () => {
    const result = await pixels.fetchPixels();
    expect(result.version).toBe('1.2.3');
  });

  it('has returns the version', async () => {
    expect(pixels.getVersion()).toBe(null);

    await pixels.init();

    expect(pixels.getVersion()).toBe('1.2.3');
  });
});
