import { nextTickPromise } from '../utils';
import getElement from './get-element';
import isFormControl from './is-form-control';
import fireEvent from './fire-event';
import isFocusable from './is-focusable';
import { uncheckedFocus } from './focus';

async function uncheckedClick(element: Element): Promise<void> {
  await fireEvent(element, 'mousedown', {});

  if (isFocusable(element)) {
    await uncheckedFocus(element);
  }

  await fireEvent(element, 'mouseup', {});
  await fireEvent(element, 'click', {});
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
    await uncheckedClick(element);
  }

  return nextTickPromise();
}
