import { nextTickPromise } from '../utils';
import fireEvent from './fire-event';
import { uncheckedFocus } from './focus';
import getElement from './get-element';
import isFormControl, { FormControl } from './is-form-control';

export default async function fillIn(target: Element | string, text) {
  await nextTickPromise();

  let element = getElement(target);

  if (!element) {
    throw new Error(`Element not found when calling \`fillIn('${target}')\`.`);
  }

  let isControl = isFormControl(element);
  if (!isControl && !(element as HTMLElement).isContentEditable) {
    throw new Error(
      '`fillIn` is only usable on form controls or contenteditable elements.'
    );
  }

  if (typeof text === 'undefined' || text === null) {
    throw new Error('Must provide `text` when calling `fillIn`.');
  }

  uncheckedFocus(element);

  if (isControl) {
    (element as FormControl).value = text;
  } else {
    element.innerHTML = text;
  }

  fireEvent(element, 'input', {});
  fireEvent(element, 'change', {});

  return nextTickPromise();
}
