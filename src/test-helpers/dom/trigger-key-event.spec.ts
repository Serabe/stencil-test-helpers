import { buildElement } from '../utils.spec';
import { removeTestWindow } from '../window';
import getElement from './get-element';
import triggerKeyEvent from './trigger-key-event';

describe('triggerKeyEvent', () => {
  afterEach(() => {
    removeTestWindow();
  });

  test('rejects if empty string is passed in', async () => {
    await buildElement('<div id="hola" />');

    try {
      await triggerKeyEvent('#hola', 'keypress', '');
    } catch (e) {
      expect(e.message).toMatch(
        /Must provide a `key` or `keyCode` to `triggerKeyEvent`/
      );
    }
  });

  test('rejects if lower case key is passed in', async () => {
    await buildElement('<div id="hola" />');

    try {
      await triggerKeyEvent('#hola', 'keypress', 'enter');
    } catch (e) {
      expect(e.message).toMatch(
        /Must provide a `key` to `triggerKeyEvent` that starts with an uppercase character but you passed `enter`./
      );
    }
  });

  test('rejects if keyCode is passed as a string', async () => {
    await buildElement('<div id="hola" />');

    try {
      await triggerKeyEvent('#hola', 'keypress', '13');
    } catch (e) {
      expect(e.message).toMatch(
        /Must provide a numeric `keyCode` to `triggerKeyEvent` but you passed `13` as a string./
      );
    }
  });

  test('triggering via selector', async () => {
    let element = await buildElement('<div id="hola" />');

    await triggerKeyEvent('#hola', 'keydown', 13);

    expect(element.getEvents()).toEqual(['keydown']);
  });

  test('triggering via element', async () => {
    let element = await buildElement('<div id="hola" />');
    let div = element.querySelector('#hola');

    await triggerKeyEvent(div, 'keydown', 13);

    expect(element.getEvents()).toEqual(['keydown']);
  });

  ['ctrl', 'shift', 'alt', 'meta'].forEach(modifierType => {
    test(`triggering passing with ${modifierType} pressed`, async () => {
      let element = await buildElement('<div id="hola" />');
      element.listenTo('keypress', getElement('#hola'), (type, event) => {
        expect(event[`${modifierType}Key`]).toBeTruthy();
        return type;
      });

      await triggerKeyEvent('#hola', 'keypress', 13, {
        [`${modifierType}Key`]: true,
      });

      expect(element.getEvents()).toEqual(['keypress']);
    });
  });

  test('can combine modifier keys', async () => {
    let element = await buildElement('<div id="hola" />');
    element.listenTo('keypress', getElement('#hola'), (type, event) => {
      expect(event.ctrlKey).toBeTruthy();
      expect(event.altKey).toBeTruthy();
      return type;
    });

    await triggerKeyEvent('#hola', 'keypress', 13, {
      altKey: true,
      ctrlKey: true,
    });

    expect(element.getEvents()).toEqual(['keypress']);
  });

  test('The value of the `event.key` is properly inferred from the given keycode and modifiers', async () => {
    let element = await buildElement('<div id="hola" />');

    async function checkKey(keyCode: number, key: string, modifiers = {}) {
      let handler = element.listenTo('keydown', element, (type, event) => {
        expect(event.key).toBe(key);
        return type;
      });
      await triggerKeyEvent(element, 'keydown', keyCode, modifiers);
      element.stopListeningTo('keydown', element, handler);
    }
    await checkKey(8, 'Backspace');
    await checkKey(9, 'Tab');
    await checkKey(13, 'Enter');
    await checkKey(16, 'Shift');
    await checkKey(17, 'Control');
    await checkKey(18, 'Alt');
    await checkKey(20, 'CapsLock');
    await checkKey(27, 'Escape');
    await checkKey(32, ' ');
    await checkKey(37, 'ArrowLeft');
    await checkKey(38, 'ArrowUp');
    await checkKey(39, 'ArrowRight');
    await checkKey(40, 'ArrowDown');
    await checkKey(48, '0');
    await checkKey(57, '9');
    await checkKey(91, 'Meta');
    await checkKey(93, 'Meta');
    await checkKey(187, '=');
    await checkKey(189, '-');
    await checkKey(65, 'a');
    await checkKey(90, 'z');
    await checkKey(65, 'A', { shiftKey: true });
    await checkKey(90, 'Z', { shiftKey: true });
  });

  test('The value of the `event.keyCode` is properly inferred from the given key', async () => {
    let element = await buildElement('<div id="hola" />');

    async function checkKeyCode(key: string, keyCode: number) {
      let handler = element.listenTo('keydown', element, (type, event) => {
        expect(event.keyCode).toBe(keyCode);
        return type;
      });
      await triggerKeyEvent(element, 'keydown', key);
      element.stopListeningTo('keydown', element, handler);
    }

    /*
    await checkKeyCode('Backspace', 8);
    */
    await checkKeyCode('Tab', 9);
    /*
    await checkKeyCode('Enter', 13);
    await checkKeyCode('Shift', 16);
    await checkKeyCode('Control', 17);
    await checkKeyCode('Alt', 18);
    await checkKeyCode('CapsLock', 20);
    await checkKeyCode('Escape', 27);
    await checkKeyCode(' ', 32);
    await checkKeyCode('ArrowLeft', 37);
    await checkKeyCode('ArrowUp', 38);
    await checkKeyCode('ArrowRight', 39);
    await checkKeyCode('ArrowDown', 40);
    await checkKeyCode('Meta', 91);
    await checkKeyCode('=', 187);
    await checkKeyCode('-', 189);
    await checkKeyCode('0', 48);
    await checkKeyCode('9', 57);
    await checkKeyCode('A', 65);
    await checkKeyCode('Z', 90);
    */
  });
});
