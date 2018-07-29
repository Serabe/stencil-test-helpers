import { nextTickPromise } from '../utils';
import fireEvent from './fire-event';
import { uncheckedFocus } from './focus';
import getElement from './get-element';
import isFocusable from './is-focusable';

function uncheckedDoubleClick(element: Element) {
  fireEvent(element, 'mousedown', {});

  if (isFocusable(element)) {
    uncheckedFocus(element);
  }

  fireEvent(element, 'mouseup', {});
  fireEvent(element, 'click', {});
  fireEvent(element, 'mousedown', {});
  fireEvent(element, 'mouseup', {});
  fireEvent(element, 'click', {});
  fireEvent(element, 'dblclick', {});
}

/**
  Double-clicks on the specified target.
  Sends a number of events intending to simulate a "real" user clicking on an
  element.
  For non-focusable elements the following events are triggered (in order):
  - `mousedown`
  - `mouseup`
  - `click`
  - `mousedown`
  - `mouseup`
  - `click`
  - `dblclick`
  For focusable (e.g. form control) elements the following events are triggered
  (in order):
  - `mousedown`
  - `focus`
  - `focusin`
  - `mouseup`
  - `click`
  - `mousedown`
  - `mouseup`
  - `click`
  - `dblclick`
  The exact listing of events that are triggered may change over time as needed
  to continue to emulate how actual browsers handle clicking a given element.
  @public
  @param {string|Element} target the element or selector to double-click on
  @return {Promise<void>} resolves when settled
*/
export default async function doubleClick(target: Element | string) {
  await nextTickPromise();

  if (!target) {
    throw new Error('Must pass an element or selector to `doubleClick`.');
  }

  let element = getElement(target);

  if (!element) {
    throw new Error(
      `Element not found when calling \`doubleClick('${target}')\`.`
    );
  }

  uncheckedDoubleClick(element);

  await nextTickPromise();
}
