import { nextTickPromise } from '../utils';
import fireEvent from './fire-event';
import getElement from './get-element';
import isFocusable from './is-focusable';

export function uncheckedFocus(element: Element): void {
  // makes `document.activeElement` be `element`. If the browser is focused, it also fires a focus event
  (element as HTMLElement).focus();

  fireEvent(element, 'focusin', {});
}

/**
  Focus the specified target.
  Sends a number of events intending to simulate a "real" user focusing an
  element.
  The following events are triggered (in order):
  - `focus`
  - `focusin`
  The exact listing of events that are triggered may change over time as needed
  to continue to emulate how actual browsers handle focusing a given element.
  @public
  @param {string|Element} target the element or selector to focus
  @return {Promise<void>} resolves when the application is settled
*/
export default async function(target: Element | string): Promise<void> {
  await nextTickPromise();

  let element = getElement(target);

  if (!element) {
    throw new Error(`Element not found when calling \`focus('${target}')\`.`);
  }

  if (!isFocusable(element)) {
    throw new Error(`${target} is not focusable.`);
  }

  uncheckedFocus(element);

  return nextTickPromise();
}
