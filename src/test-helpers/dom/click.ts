import { nextTickPromise } from '../utils';
import fireEvent from './fire-event';
import { uncheckedFocus } from './focus';
import getElement from './get-element';
import isFocusable from './is-focusable';
import isFormControl from './is-form-control';

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
    throw new Error(`Element not found when calling \`click('${target}')\`.`);
  }

  let isDisabledFormControl =
    isFormControl(element) && element.disabled === true;

  if (!isDisabledFormControl) {
    uncheckedClick(element);
  }

  return nextTickPromise();
}
