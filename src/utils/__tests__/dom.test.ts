import * as dom from '../dom';
import * as gmail from '../gmail';

jest.mock('../../../vendor/gmail-js', () => ({}));

describe('dom util', () => {
  it('marks list elements ugly', async () => {
    jest
      .spyOn(gmail, 'findTracker')
      .mockResolvedValueOnce('SendGrid')
      .mockResolvedValueOnce(null);

    document.body.innerHTML = `
    <div>
      <h1 class="bog">
        <span data-legacy-thread-id="1" data-ugly-checked="yes"></span>
      </h1>
      <h1 class="bog">
        <span data-legacy-thread-id="2" data-ugly-checked="yes"></span>
      </h1>
      <h1 class="bog">
        <div class="xT">
          <span data-legacy-thread-id="3"></span>
        </div>
      </h1>
      <h1 class="bog">
        <span data-legacy-thread-id="4"></span>
      </h1>
      <h1 class="bog">
        <span data-legacy-thread-id="5" data-ugly-checked="yes"></span>
      </h1>
    </div>
    `;

    await dom.checkList();

    const icon: HTMLImageElement = document.body.querySelector('.ugly-email-track-icon');

    expect(icon).toBeDefined();
    expect(icon.dataset.tooltip).toEqual('SendGrid');
  });

  it('marks thread ugly', async () => {
    jest.spyOn(gmail, 'findTracker').mockResolvedValueOnce('MailChimp');

    document.body.innerHTML = `
    <div>
      <div class="nH V8djrc byY">
        <div class="ade"></div>
        <h2 class="hP" data-legacy-thread-id="5"></h2>
      </div>
    </div>
    `;

    await dom.checkThread();

    const icon: HTMLImageElement = document.body.querySelector('.ugly-email-track-icon');

    expect(icon).toBeDefined();
    expect(icon.dataset.tooltip).toEqual('MailChimp');
  });
});
