import { nextTickPromise } from '../utils';
import { getTestWindow } from '../window';
import fireEvent from './fire-event';
import getElement from './get-element';
import isFocusable from './is-focusable';

function uncheckedBlur(element: Element) {
  (element as HTMLElement).blur();
  fireEvent(element, 'focusout', {});
}

/**
  Unfocus the specified target.
  Sends a number of events intending to simulate a "real" user unfocusing an
  element.
  The following events are triggered (in order):
  - `blur`
  - `focusout`
  The exact listing of events that are triggered may change over time as needed
  to continue to emulate how actual browsers handle unfocusing a given element.
  @public
  @param {string|Element} [target=document.activeElement] the element or selector to unfocus
  @return {Promise<void>} resolves when settled
*/
export default async function blur(
  target: Element | string = getTestWindow().document.activeElement
) {
  await nextTickPromise();

  let element = getElement(target);
  if (!element) {
    throw new Error(`Element not found when calling \`blur('${target}')\`.`);
  }

  if (!isFocusable(element)) {
    throw new Error(`${target} is not focusable`);
  }

  uncheckedBlur(element);

  return nextTickPromise();
}
