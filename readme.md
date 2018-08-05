# Stencil Test Helpers

[![Build Status](https://travis-ci.com/Serabe/stencil-test-helpers.svg?branch=master)](https://travis-ci.com/Serabe/stencil-test-helpers)
[![Coverage Status](https://coveralls.io/repos/github/Serabe/stencil-test-helpers/badge.svg)](https://coveralls.io/github/Serabe/stencil-test-helpers)

This code is a port from the great [ember-test-helpers](https://github.com/emberjs/ember-test-helpers) to be used in Stencil projects.

## Getting Started

```bash
npm install stencil-test-helpers
```

So helpers know how to do their thing, the `TestWindow` class provided by this package needs to be used. It behaves as the normal `TestWindow`, but with a couple of extra magic bits that let the helpers use their magic.

You need to add a `removeTestWindow` call in the `aferEach` hook.

The basic scaffold is:

```ts
import { TestWindow, removeTestWindow } from 'stencil-test-helpers';

describe('something', () => {
  afterEach(() => {
    removeTestWindow();
  });
});
```

## Helpers

All the helpers accept a target both as a string (CSS selector) or an Element. All helpers will wait until the next tick _before_ and _after_ doing its work.

The available helpers are:

- `blur(target)`
- `click(target)`
- `doubleClick(target)`
- `fillIn(target, value: string)`
- `focus(target)`
- `getElement(target): Element | null`
- `tap(target, options)`
- `triggerEvent(target, event, options)`
- `triggerKeyEvent(target, keyEventType, keyOrKeyCode, modifiers)`
