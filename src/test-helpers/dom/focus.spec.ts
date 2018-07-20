import { TestWindow, removeTestWindow, getTestWindow } from '../window';
import { InstrumentedElement } from '../../components/instrumented-element/instrumented-element';
import focus from './focus';

const focusSteps = ['focus', 'focusin'];

async function buildElement(
  innerHtml: string
): Promise<HTMLInstrumentedElementElement> {
  let window = new TestWindow();
  let element = await window.load({
    components: [InstrumentedElement],
    html: `<instrumented-element>${innerHtml}</instrumented-element>`,
  });

  return element as HTMLInstrumentedElementElement;
}
describe('focus', () => {
  afterEach(() => {
    removeTestWindow();
  });

  test('focusing a div via selector', async () => {
    await buildElement('<div id="hola"></div>');

    try {
      await focus('#hola');
      expect(false).toBeTruthy();
    } catch (e) {
      expect(true).toBeTruthy();
    }
  });

  test('focusing a div via element', async () => {
    await buildElement('<div id="hola"></div>');

    try {
      await focus('#hola');
      expect(false).toBeTruthy();
    } catch (e) {
      expect(true).toBeTruthy();
    }
  });

  test('does not run sync', async () => {
    let element = await buildElement('<input id="hola"></input>');

    let promise = focus('#hola');

    expect(element.getEvents()).toEqual([]);

    await promise;

    expect(element.getEvents()).toEqual(focusSteps);
  });

  test('rejects if selector is not found', async () => {
    await buildElement('<div></div>');

    try {
      await focus('#this-selector-does-not-exist');
      expect(false).toBeTruthy();
    } catch (e) {
      expect(true).toBeTruthy();
    }
  });

  test('focusing a input via selector', async () => {
    let element = await buildElement('<input id="hola"></input>');

    await focus('#hola');

    expect(element.getEvents()).toEqual(focusSteps);
    expect(getTestWindow().document.activeElement).toEqual(
      element.querySelector('#hola')
    );
  });

  test('focusing a input via element', async () => {
    let element = await buildElement('<input id="hola"></input>');
    let input = element.querySelector('#hola');

    await focus(input);

    expect(element.getEvents()).toEqual(focusSteps);
    expect(getTestWindow().document.activeElement).toEqual(input);
  });
});
