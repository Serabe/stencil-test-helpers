import {
  TestWindow,
  getRootElement,
  getTestWindow,
  removeTestWindow,
} from './window';
import { TestWindow as StencilTestWindow } from '@stencil/core/dist/testing';
import { InstrumentedElement } from '../components/instrumented-element/instrumented-element';

describe('TestWindow', () => {
  afterEach(() => {
    removeTestWindow();
  });

  it('is a StencilTestWindow', async () => {
    let testWindow = new TestWindow();
    await testWindow.load({
      components: [InstrumentedElement],
      html: '<div></div>',
    });

    expect(testWindow).toBeInstanceOf(StencilTestWindow);
  });

  it('sets the new test window as the registered test window', async () => {
    let testWindow = new TestWindow();
    await testWindow.load({
      components: [InstrumentedElement],
      html: '<div></div>',
    });

    expect(testWindow).toStrictEqual(getTestWindow());
  });

  it('registers the loaded element', async () => {
    let testWindow = new TestWindow();
    let element = await testWindow.load({
      components: [InstrumentedElement],
      html: '<instrumented-element></instrumented-element>',
    });

    expect(element).toStrictEqual(getRootElement());
  });
});

describe('getTestWindow', () => {
  afterEach(() => {
    removeTestWindow();
  });

  it('returns the created test window', async () => {
    let testWindow = new TestWindow();
    await testWindow.load({
      components: [InstrumentedElement],
      html: '<div></div>',
    });

    expect(getTestWindow()).toStrictEqual(testWindow);
  });

  it('raises an error if there is no test window', () => {
    expect(() => getTestWindow()).toThrow();
  });
});

describe('removeTestWindow', () => {
  afterEach(() => {
    removeTestWindow();
  });

  it('removes currently registered test window', async () => {
    let testWindow = new TestWindow();
    await testWindow.load({
      components: [InstrumentedElement],
      html: '<div></div>',
    });

    expect(getTestWindow()).toStrictEqual(testWindow);

    removeTestWindow();

    expect(() => getTestWindow()).toThrow();
  });
});
