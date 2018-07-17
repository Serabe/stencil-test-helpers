import { TestWindow as StencilTestWindow } from '@stencil/core/testing';

let registeredTestWindow: TestWindow;
let loadedElement: any | null;

interface TestWindowLoadOptions {
  components: any[];
  html: string;
  url?: string;
  userAgent?: string;
  cookie?: string;
  direction?: string;
  language?: string;
}

export class TestWindow extends StencilTestWindow {
  async load(opts: TestWindowLoadOptions): Promise<any> {
    let superElement = await super.load(opts);

    if (registeredTestWindow) {
      throw new Error('there is a registered test window already');
    }

    registeredTestWindow = this;
    loadedElement = superElement;

    return superElement;
  }
}

export const removeTestWindow = () => {
  registeredTestWindow = null;
  loadedElement = null;
};

export const getRootElement = (): any => {
  if (!loadedElement) {
    throw new Error(
      'there is no loaded element. Please, use TestWindow.prototype.load first'
    );
  }

  return loadedElement;
};

export const getTestWindow = (): TestWindow => {
  if (!registeredTestWindow) {
    throw new Error('There is no text window created');
  }

  return registeredTestWindow;
};
