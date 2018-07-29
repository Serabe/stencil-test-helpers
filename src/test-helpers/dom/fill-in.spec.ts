import { buildElement } from '../utils.spec';
import { getTestWindow, removeTestWindow } from '../window';
import fillIn from './fill-in';
import getElement from './get-element';

const fillSteps = ['focus', 'focusin', 'input', 'change'];

describe('fillIn', () => {
  afterEach(() => {
    removeTestWindow();
  });

  test('rejects if filling in a non-fillable element', async () => {
    await buildElement('<div id="hola"></div>');

    try {
      await fillIn('#hola', 'foo');
    } catch (e) {
      expect(e.message).toMatch(
        '`fillIn` is only usable on form controls or contenteditable elements'
      );
    }
  });

  test('rejects if selector is not found', async () => {
    await buildElement('<div id="hola"></div>');

    try {
      await fillIn('#element-is-not-here', 'hello');
    } catch (e) {
      expect(e.message).toMatch(
        "Element not found when calling `fillIn('#element-is-not-here')`."
      );
    }
  });

  test('rejects if text to fill in is not provided', async () => {
    await buildElement('<input id="hola" />');
    let foo: string;

    try {
      await fillIn('#hola', foo);
    } catch (e) {
      expect(e.message).toMatch('Must provide `text` when calling `fillIn`.');
    }
  });

  test('filling an input via selector', async () => {
    let element = await buildElement('<input id="hola" />');

    let input = getElement('#hola') as HTMLInputElement;

    await fillIn('#hola', 'My new value');

    expect(element.getEvents()).toEqual(fillSteps);
    expect(getTestWindow().document.activeElement).toBe(input);
    expect(input.value).toEqual('My new value');
  });

  test('does not run sync', async () => {
    let element = await buildElement('<input id="hola"></input>');
    let promise = fillIn('#hola', 'foo');
    let input = getElement('#hola') as HTMLInputElement;

    expect(element.getEvents()).toEqual([]);

    await promise;

    expect(element.getEvents()).toEqual(fillSteps);
    expect(getTestWindow().document.activeElement).toBe(input);
    expect(input.value).toEqual('foo');
  });

  test('filling a textarea via selector', async () => {
    let element = await buildElement('<textarea id="hola" />');
    let textarea = getElement('#hola') as HTMLTextAreaElement;

    await fillIn('#hola', 'foo');

    expect(element.getEvents()).toEqual(fillSteps);
    expect(getTestWindow().document.activeElement).toBe(textarea);
    expect(textarea.value).toEqual('foo');
  });

  test('filling an input via element', async () => {
    let element = await buildElement('<input id="hola" />');
    let input = getElement('#hola') as HTMLInputElement;

    await fillIn(input, 'foo');

    expect(element.getEvents()).toEqual(fillSteps);
    expect(getTestWindow().document.activeElement).toBe(input);
    expect(input.value).toEqual('foo');
  });

  test('filling an input via selector with empty string', async () => {
    let element = await buildElement('<input id="hola" />');
    let input = getElement('#hola') as HTMLInputElement;

    await fillIn('#hola', '');

    expect(element.getEvents()).toEqual(fillSteps);
    expect(getTestWindow().document.activeElement).toBe(input);
    expect(input.value).toEqual('');
  });

  test.skip('filling a content editable div via element', async () => {
    // We cannot use this as jsdom does not support contenteditable
    let element = await buildElement(
      '<div id="hola" contenteditable="true" />'
    );
    let div = getElement('#hola');

    await fillIn(div, 'foo');

    expect(element.getEvents()).toEqual(fillSteps);
    expect(getTestWindow().document.activeElement).toBe(div);
    expect(div.innerHTML).toEqual('foo');
  });
});
