import { AppPage } from './app.po';
import { browser, logging } from 'protractor';

describe('Orbits App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  //TODO: Set up E2E Testing once there's menus and things.

  it('should have a title', () => {
    page.navigateTo();
    expect(browser.getTitle()).toEqual('Orbits');
  });

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });
});
