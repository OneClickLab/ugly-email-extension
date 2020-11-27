/* eslint-disable dot-notation */
import workerInstance, { UglyWorker } from '../../src/services/worker';

describe('Worker service', () => {
  it('exports instance by default', () => {
    expect(workerInstance).toBeInstanceOf(UglyWorker);
  });

  it('creates worker instance', () => {
    expect(workerInstance['instance']).toBeInstanceOf(Worker);
  });

  it('creates message handler', () => {
    expect(workerInstance['instance'].onmessage).toBeDefined();
  });

  it('sends a message', () => {
    const postMessage = jest.spyOn(workerInstance['instance'], 'postMessage');

    expect(workerInstance['resolvers']).toMatchObject({});

    workerInstance.postMessage('12345', '<div></div>', ['sendgrid']);

    expect(workerInstance['resolvers']['12345']).toBeDefined();

    expect(postMessage).toBeCalledWith({
      id: '12345',
      body: '<div></div>',
      identifiers: ['sendgrid'],
    });
  });
});
