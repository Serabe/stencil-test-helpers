# Stencil Test Helpers

## Getting Started

```bash
npm install
npm start
```

## Naming Components

When creating new component tags, we recommend _not_ using `stencil` in the component name (ex: `<stencil-datepicker>`). This is because the generated component has little to nothing to do with Stencil; it's just a web component!

Instead, use a prefix that fits your company or any name for a group of related components. For example, all of the Ionic generated web components use the prefix `ion`.

## Helpers

### click

```ts
import { TestWindow, click, removeTestWindow } from 'stencil-test-helpers';

describe('my form', () => {
  afterEach(() => {
    removeTestWindow();
  });

  test('submitting form', async () => {
    let window = new TestWindow();
    let element = await window.load({
      components: [MySelect],
      html: '<form><my-select></my-select><input type="submit" /></form>',
    });

    let mySelect = element.querySelector('my-select');

    await click(mySelect);
    await click('[type="submit"]');
  });
});
```

### focus

```ts
import { TestWindow, focus, removeTestWindow } from 'stencil-test-helpers';

describe('my form', () => {
  afterEach(() => {
    removeTestWindow();
  });

  test('focusing an input', async () => {
    let window = new TestWindow();
    let element = await window.load({
      components: [MySelect],
      html:
        '<form><input></input><my-select></my-select><input type="submit" /></form>',
    });

    let mySelect = element.querySelector('my-select');

    await click(mySelect);
    await click('input');
  });
});
```
