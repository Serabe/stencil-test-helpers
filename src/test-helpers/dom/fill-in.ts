import { nextTickPromise } from '../utils';
import fireEvent from './fire-event';
import { uncheckedFocus } from './focus';
import getElement from './get-element';
import isFormControl, { FormControl } from './is-form-control';

/**
  Fill the provided text into the `value` property (or set `.innerHTML` when
  the target is a content editable element) then trigger `change` and `input`
  events on the specified target.
  @public
  @param {string|Element} target the element or selector to enter text into
  @param {string} text the text to fill into the target element
  @return {Promise<void>} resolves when the application is settled
*/
export default async function fillIn(
  target: Element | string,
  text: string
): Promise<void> {
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
