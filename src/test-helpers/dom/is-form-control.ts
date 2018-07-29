const FORM_CONTROL_TAGS = ['INPUT', 'BUTTON', 'SELECT', 'TEXTAREA'];

export default function isFormControl(
  element: Element
): element is FormControl {
  if (isTagFormControl(element)) {
    return element.type !== 'hidden';
  }

  return false;
}

export type FormControl = Element & {
  type: string;
  disabled: boolean;
  value: string;
};
function isTagFormControl(element: Element): element is FormControl {
  return FORM_CONTROL_TAGS.indexOf(element.tagName) > -1;
}
