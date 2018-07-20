import { getRootElement } from '../window';

/**
 * @param target {string | Element}
 * @return {Element}
 */
export default function(target: string | Element): Element | null {
  if (typeof target === 'string') {
    let rootElement = getRootElement();

    return rootElement.querySelector(target);
  } else if (
    target.nodeType === Node.ELEMENT_NODE ||
    target.nodeType === Node.DOCUMENT_NODE ||
    target instanceof Window
  ) {
    return target;
  }

  throw new Error('Must use element or a selector string');
}
