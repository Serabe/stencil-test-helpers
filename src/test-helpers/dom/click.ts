import { nextTickPromise } from '../utils';
import getElement from './get-element';
import isFormControl from './is-form-control';
import fireEvent from './fire-event';
import isFocusable from './is-focusable';
import { uncheckedFocus } from './focus';

function uncheckedClick(element: Element): void {
  fireEvent(element, 'mousedown', {});

  if (isFocusable(element)) {
    uncheckedFocus(element);
  }

  fireEvent(element, 'mouseup', {});
  fireEvent(element, 'click', {});
}

export default async function(target: Element | string): Promise<void> {
  await nextTickPromise();

  let element = getElement(target);

  if (!element) {
    throw new Error(`Element not found when calling \`click('${target}')\``);
  }

  let isDisabledFormControl =
    isFormControl(element) && element.disabled === true;

  if (!isDisabledFormControl) {
    uncheckedClick(element);
  }

  return nextTickPromise();
}
