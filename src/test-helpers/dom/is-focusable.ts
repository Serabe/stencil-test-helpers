import isFormControl from './is-form-control';

const FOCUSABLE_TAGS = ['A'];

function isContentEditable(element: Element): boolean {
  return element instanceof HTMLElement && element.isContentEditable;
}

export default function(element: Element): boolean {
  return (
    isFormControl(element) ||
    isContentEditable(element) ||
    FOCUSABLE_TAGS.indexOf(element.tagName) !== -1 ||
    element.hasAttribute('tabindex')
  );
}
