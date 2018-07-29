import { EventOptions } from '../../../node_modules/@stencil/core/dist/declarations';
import { nextTickPromise } from '../utils';
import { uncheckedClick } from './click';
import fireEvent from './fire-event';
import getElement from './get-element';

/**
  Taps on the specified target.
  Sends a number of events intending to simulate a "real" user tapping on an
  element.
  For non-focusable elements the following events are triggered (in order):
  - `touchstart`
  - `touchend`
  - `mousedown`
  - `mouseup`
  - `click`
  For focusable (e.g. form control) elements the following events are triggered
  (in order):
  - `touchstart`
  - `touchend`
  - `mousedown`
  - `focus`
  - `focusin`
  - `mouseup`
  - `click`
  The exact listing of events that are triggered may change over time as needed
  to continue to emulate how actual browsers handle tapping on a given element.
  @public
  @param {string|Element} target the element or selector to tap on
  @param {Object} options the options to be provided to the touch events
  @return {Promise<void>} resolves when settled
*/
export default async function(
  target: Element | string,
  options: EventOptions = {}
): Promise<void> {
  await nextTickPromise();

  let element = getElement(target);
  if (!element) {
    throw new Error(`Element not found when calling \`tap('${target}')\`.`);
  }

  let touchstartEv = fireEvent(element, 'touchstart', options);
  let touchendEv = fireEvent(element, 'touchend', options);

  if (!touchstartEv.defaultPrevented && !touchendEv.defaultPrevented) {
    uncheckedClick(element);
  }

  return nextTickPromise();
}
