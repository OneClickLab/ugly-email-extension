/* eslint-disable @typescript-eslint/dot-notation */
import messengerInstance, { UglyMessenger } from '../../src/services/messenger';

describe('Worker service', () => {
  it('exports instance by default', () => {
    expect(messengerInstance).toBeInstanceOf(UglyMessenger);
  });

  it('sends a message', () => {
    const postMessage = jest.spyOn(window, 'postMessage');

    expect(messengerInstance['resolvers']).toMatchObject({});

    messengerInstance.postMessage('12345', '<div></div>');

    expect(messengerInstance['resolvers']['12345']).toBeDefined();

    expect(postMessage).toBeCalledWith({
      id: '12345',
      body: '<div></div>',
      from: 'ugly-email-check',
    }, 'http://localhost');
  });
});
