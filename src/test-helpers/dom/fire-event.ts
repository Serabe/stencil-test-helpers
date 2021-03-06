import { getTestWindow } from '../window';
import {
  DEFAULT_EVENT_OPTIONS,
  EventType,
  FileSelectionEventType,
  isFileSelectionEventType,
  isKeyboardEventType,
  isMouseEventType,
  KeyboardEventType,
  MouseEventType,
} from './event-types';

type MouseEventOptions = {
  bubbles?: boolean;
  cancelable?: boolean;
  view?: Window;
  detail?: number;
  screenX?: number;
  screenY?: number;
  clientX?: number;
  clientY?: number;
  ctrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  metaKey?: boolean;
  button?: number;
  relatedTarget?: EventTarget;
};

type KeyboardEventOptions = {
  charCode?: string;
  keyCode?: string;
  which?: string;
  bubbles?: boolean;
  cancelable?: boolean;
  view?: Window;
  key?: string;
  location?: number;
  modifiersList?: string;
  repeat?: boolean;
  locale?: string;
  ctrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  metaKey?: boolean;
};

type FileSelectionEventOptions = {
  files?: string[];
};

export type EventOptions =
  | MouseEventOptions
  | KeyboardEventOptions
  | FileSelectionEventOptions;

export default function(
  element: Element,
  eventType: MouseEventType,
  options: MouseEventOptions
): MouseEvent;
export default function(
  element: Element,
  eventType: KeyboardEventType,
  options: KeyboardEventOptions
): KeyboardEvent;
export default function(
  element: Element,
  eventType: FileSelectionEventType,
  options: FileSelectionEventOptions
): Event;
export default function(
  element: Element,
  eventType: EventType,
  options: EventOptions
): Event;
export default function(
  element: Element,
  eventType: EventType,
  options: EventOptions = {}
): Event {
  let event = buildEvent(element, eventType, options);
  try {
    element.dispatchEvent(event);
  } catch (e) {
    throw new Error(`could not dispatch ${eventType} event: ${e.message}`);
  }
  return event;
}

function buildEvent(
  element: Element,
  eventType: MouseEventType,
  options: MouseEventOptions
): MouseEvent;
function buildEvent(
  element: Element,
  eventType: KeyboardEventType,
  options: KeyboardEventOptions
): KeyboardEvent;
function buildEvent(
  element: Element,
  eventType: FileSelectionEventType,
  options: FileSelectionEventOptions
): Event;
function buildEvent(
  element: Element,
  eventType: EventType,
  options: EventOptions
);
function buildEvent(
  element: Element,
  eventType: EventType,
  options: EventOptions
): Event {
  if (isFileSelectionEventType(eventType)) {
    return buildFileSelectionEvent(
      element,
      eventType,
      options as FileSelectionEventOptions
    );
  }

  if (isKeyboardEventType(eventType)) {
    return buildKeyboardEvent(
      element,
      eventType,
      options as KeyboardEventOptions
    );
  }

  if (isMouseEventType(eventType)) {
    return buildMouseEvent(element, eventType, options as MouseEventOptions);
  }

  return buildBasicEvent(element, eventType, options);
}

function buildBasicEvent(
  _: Element,
  eventType: EventType,
  options: any
): Event {
  let window = getTestWindow();
  let event = new window.Event(eventType);
  let eventOpts = { ...options };

  let bubbles = options.bubbles !== undefined ? options.bubbles : true;
  let cancelable = options.cancelable !== undefined ? options.cancelable : true;

  delete eventOpts.bubbles;
  delete eventOpts.cancelable;

  event.initEvent(eventType, bubbles, cancelable);

  Object.assign(event, eventOpts);

  return event;
}

function buildKeyboardEvent(
  _: Element,
  eventType: KeyboardEventType,
  options: KeyboardEventOptions
): Event {
  let eventOpts = { ...DEFAULT_EVENT_OPTIONS, ...options };
  let window = getTestWindow();

  let event = new window.Event(eventType, eventOpts);
  return event;
}

function buildMouseEvent(
  element: Element,
  eventType: MouseEventType,
  options: MouseEventOptions
): MouseEvent {
  let event;
  let window = getTestWindow();
  try {
    event = new window.Event(eventType);
    let eventOpts = {
      ...DEFAULT_EVENT_OPTIONS,
      ...simulatedCoordinates(element),
      ...options,
    };
    event.initMouseEvent(
      eventType,
      eventOpts.bubbles,
      eventOpts.cancelable,
      window,
      eventOpts.detail,
      eventOpts.screenX,
      eventOpts.screenY,
      eventOpts.clientX,
      eventOpts.clientY,
      eventOpts.ctrlKey,
      eventOpts.altKey,
      eventOpts.shiftKey,
      eventOpts.metaKey,
      eventOpts.button,
      eventOpts.relatedTarget
    );
  } catch (e) {
    event = buildBasicEvent(element, eventType, options);
  }
  return event;
}

function buildFileSelectionEvent(
  element: Element,
  eventType: FileSelectionEventType,
  options: FileSelectionEventOptions
): Event {
  let event = buildBasicEvent(element, eventType, options);
  let files = options.files || [];

  if (files.length > 0) {
    Object.defineProperty(files, 'item', {
      value(index) {
        // tslint:disable-next-line no-invalid-this
        return typeof index === 'number' ? this[index] : null;
      },
    });
    Object.defineProperty(element, 'files', {
      value: files,
      configurable: true,
    });
  }

  Object.defineProperty(event, 'target', {
    value: element,
  });

  return event;
}

function simulatedCoordinates(element: Node): MouseEventOptions {
  let rect: ClientRect;
  if (element instanceof Window) {
    rect = element.document.documentElement.getBoundingClientRect();
  } else if (element.nodeType === Node.DOCUMENT_NODE) {
    rect = (element as Document).documentElement.getBoundingClientRect();
  } else if (element.nodeType === Node.ELEMENT_NODE) {
    rect = (element as Element).getBoundingClientRect();
  } else {
    return;
  }

  let x = rect.left + 1;
  let y = rect.top + 1;
  return {
    screenX: x + 5, // Those numbers don't really mean anything.
    screenY: y + 95, // They're just to make the screenX/Y be different of clientX/Y..
    clientX: x,
    clientY: y,
  };
}
