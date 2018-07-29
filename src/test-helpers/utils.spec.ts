import { InstrumentedElement } from '../components/instrumented-element/instrumented-element';
import { TestWindow } from './window';

export async function buildElement(
  innerHtml: string
): Promise<HTMLInstrumentedElementElement> {
  let window = new TestWindow();
  let element = await window.load({
    components: [InstrumentedElement],
    html: `<instrumented-element>${innerHtml}</instrumented-element>`,
  });

  return element as HTMLInstrumentedElementElement;
}

// TODO: Refactor the function above to a place where it is not published.

describe('Dummy', () => {
  test('something', () => {
    expect(true).toBeTruthy();
  });
});
