import { isNumeric, nextTickPromise } from '../utils';
import { KeyboardEventType } from './event-types';
import fireEvent from './fire-event';
import getElement from './get-element';

type ModifiersObject = {
  ctrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  metaKey?: boolean;
};
const DEFAULT_MODIFIERS: ModifiersObject = Object.freeze({
  ctrlKey: false,
  altKey: false,
  shiftKey: false,
  metaKey: false,
});

// This is not a comprehensive list, but it is better than nothing.
const keyFromKeyCode = {
  8: 'Backspace',
  9: 'Tab',
  13: 'Enter',
  16: 'Shift',
  17: 'Control',
  18: 'Alt',
  20: 'CapsLock',
  27: 'Escape',
  32: ' ',
  37: 'ArrowLeft',
  38: 'ArrowUp',
  39: 'ArrowRight',
  40: 'ArrowDown',
  48: '0',
  49: '1',
  50: '2',
  51: '3',
  52: '4',
  53: '5',
  54: '6',
  55: '7',
  56: '8',
  57: '9',
  65: 'a',
  66: 'b',
  67: 'c',
  68: 'd',
  69: 'e',
  70: 'f',
  71: 'g',
  72: 'h',
  73: 'i',
  74: 'j',
  75: 'k',
  76: 'l',
  77: 'm',
  78: 'n',
  79: 'o',
  80: 'p',
  81: 'q',
  82: 'r',
  83: 's',
  84: 't',
  85: 'u',
  86: 'v',
  87: 'v',
  88: 'x',
  89: 'y',
  90: 'z',
  91: 'Meta',
  93: 'Meta', // There is two keys that map to meta,
  187: '=',
  189: '-',
};

/**
  Calculates the value of KeyboardEvent#key given a keycode and the modifiers.
  Note that this works if the key is pressed in combination with the shift key, but it cannot
  detect if caps lock is enabled.
  @param {number} keycode The keycode of the event.
  @param {object} modifiers The modifiers of the event.
  @returns {string} The key string for the event.
 */
function keyFromKeyCodeAndModifiers(
  keycode: number,
  modifiers: ModifiersObject
): string {
  if (keycode > 64 && keycode < 91) {
    if (modifiers.shiftKey) {
      return String.fromCharCode(keycode);
    } else {
      return String.fromCharCode(keycode).toLocaleLowerCase();
    }
  }
  let key = keyFromKeyCode[keycode];
  if (key) {
    return key;
  }
}

function getPropsFor(
  key: number | string,
  modifiers: ModifiersObject
): { keyCode: string | number; which: string | number; key: string } {
  if (typeof key === 'number') {
    return {
      keyCode: key,
      which: key,
      key: keyFromKeyCodeAndModifiers(key, modifiers),
    };
  }

  if (key.length !== 0) {
    let firstCharacter = key[0];

    if (firstCharacter !== firstCharacter.toUpperCase()) {
      throw new Error(
        `Must provide a \`key\` to \`triggerKeyEvent\` that starts with an uppercase character but you passed \`${key}\`.`
      );
    }

    if (isNumeric(key) && key.length > 1) {
      throw new Error(
        `Must provide a numeric \`keyCode\` to \`triggerKeyEvent\` but you passed \`${key}\` as a string.`
      );
    }

    let keyCode = keyCodeFromKey(key);
    return { keyCode, which: keyCode, key };
  }

  throw new Error(
    `Must provide a \`key\` or \`keyCode\` to \`triggerKeyEvent\``
  );
}

function keyCodeFromKey(key: string): number {
  let keys = Object.keys(keyFromKeyCode);
  let keyCode = keys.find(keyCode => keyFromKeyCode[keyCode] === key);

  if (keyCode) {
    return parseInt(keyCode, 10);
  }

  keyCode = keys.find(keyCode => keyFromKeyCode[keyCode] === key.toLowerCase());

  return parseInt(keyCode, 10);
}

/**
  Triggers a keyboard event of given type in the target element.
  It also requires the developer to provide either a string with the [`key`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values)
  or the numeric [`keyCode`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode) of the pressed key.
  Optionally the user can also provide a POJO with extra modifiers for the event.
  @public
  @param {string|Element} target the element or selector to trigger the event on
  @param {'keydown' | 'keyup' | 'keypress'} eventType the type of event to trigger
  @param {number|string} key the `keyCode`(number) or `key`(string) of the event being triggered
  @param {Object} [modifiers] the state of various modifier keys
  @param {boolean} [modifiers.ctrlKey=false] if true the generated event will indicate the control key was pressed during the key event
  @param {boolean} [modifiers.altKey=false] if true the generated event will indicate the alt key was pressed during the key event
  @param {boolean} [modifiers.shiftKey=false] if true the generated event will indicate the shift key was pressed during the key event
  @param {boolean} [modifiers.metaKey=false] if true the generated event will indicate the meta key was pressed during the key event
  @return {Promise<void>} resolves when the application is settled
*/
export default async function triggerKeyEvent(
  target: Element | string,
  eventType: KeyboardEventType,
  key: number | string,
  modifiers = DEFAULT_MODIFIERS
) {
  await nextTickPromise();

  let element = getElement(target);
  if (!element) {
    throw new Error(
      `Element not found when calling \`triggerKeyEvent('${target}', ...)\`.`
    );
  }

  let options = {
    ...DEFAULT_MODIFIERS,
    ...modifiers,
    ...getPropsFor(key, modifiers),
  };

  fireEvent(element, eventType, options);

  return nextTickPromise();
}
