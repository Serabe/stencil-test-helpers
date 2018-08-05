import { Component, Element, Method } from '@stencil/core';
import { EventType } from '../../test-helpers/dom/event-types';

// from https://mdn.mozilla.org/en-US/docs/Web/Events
export const KNOWN_EVENTS = [
  'abort',
  'afterprint',
  'animationend',
  'animationiteration',
  'animationstart',
  'appinstalled',
  'audioprocess',
  'audioend ',
  'audiostart ',
  'beforeprint',
  'beforeunload',
  'beginEvent',
  'blocked	',
  'blur',
  'boundary ',
  'cached',
  'canplay',
  'canplaythrough',
  'change',
  'chargingchange',
  'chargingtimechange',
  'checking',
  'click',
  'close',
  'complete',
  'compositionend',
  'compositionstart',
  'compositionupdate',
  'contextmenu',
  'copy',
  'cut',
  'dblclick',
  'devicechange',
  'devicelight',
  'devicemotion',
  'deviceorientation',
  'deviceproximity',
  'dischargingtimechange',
  'downloading',
  'drag',
  'dragend',
  'dragenter',
  'dragleave',
  'dragover',
  'dragstart',
  'drop',
  'durationchange',
  'emptied',
  'end',
  'ended',
  'endEvent',
  'error',
  'focus',
  'focusin',
  'focusout',
  'fullscreenchange',
  'fullscreenerror',
  'gamepadconnected',
  'gamepaddisconnected',
  'gotpointercapture',
  'hashchange',
  'lostpointercapture',
  'input',
  'invalid',
  'keydown',
  'keypress',
  'keyup',
  'languagechange ',
  'levelchange',
  'load',
  'loadeddata',
  'loadedmetadata',
  'loadend',
  'loadstart',
  'mark ',
  'message',
  'messageerror',
  'mousedown',
  'mouseenter',
  'mouseleave',
  'mousemove',
  'mouseout',
  'mouseover',
  'mouseup',
  'nomatch',
  'notificationclick',
  'noupdate',
  'obsolete',
  'offline',
  'online',
  'open',
  'orientationchange',
  'pagehide',
  'pageshow',
  'paste',
  'pause',
  'pointercancel',
  'pointerdown',
  'pointerenter',
  'pointerleave',
  'pointerlockchange',
  'pointerlockerror',
  'pointermove',
  'pointerout',
  'pointerover',
  'pointerup',
  'play',
  'playing',
  'popstate',
  'progress',
  'push',
  'pushsubscriptionchange',
  'ratechange',
  'readystatechange',
  'repeatEvent',
  'reset',
  'resize',
  'resourcetimingbufferfull',
  'result ',
  'resume ',
  'scroll',
  'seeked',
  'seeking',
  'select',
  'selectstart',
  'selectionchange',
  'show',
  'soundend ',
  'soundstart ',
  'speechend',
  'speechstart',
  'stalled',
  'start',
  'storage',
  'submit',
  'success',
  'suspend',
  'SVGAbort',
  'SVGError',
  'SVGLoad',
  'SVGResize',
  'SVGScroll',
  'SVGUnload',
  'SVGZoom',
  'timeout',
  'timeupdate',
  'touchcancel',
  'touchend',
  'touchmove',
  'touchstart',
  'transitionend',
  'unload',
  'updateready',
  'upgradeneeded	',
  'userproximity',
  'voiceschanged',
  'versionchange',
  'visibilitychange',
  'volumechange',
  'waiting',
  'wheel',
] as EventType[];

@Component({
  tag: 'instrumented-element',
})
export class InstrumentedElement {
  @Element() rootElement: HTMLElement;
  protected _events: EventType[] = [];

  @Method()
  getEvents(): EventType[] {
    return this._events;
  }

  @Method()
  instrumentElement(element: HTMLElement) {
    KNOWN_EVENTS.forEach(type => {
      element.addEventListener(type as string, () => {
        this._events.push(type);
      });
    });
  }

  @Method()
  resetEvents() {
    this._events = [];
  }

  @Method()
  listenTo(
    event: EventType,
    element: Element = this.rootElement,
    valueToInclude: (EventType, Event) => EventType = e => e
  ): Function {
    let handler = e => {
      this._events.push(valueToInclude(event, e));
    };
    element.addEventListener(event as string, handler);
    return handler;
  }

  @Method()
  stopListeningTo(event: EventType, element = this.rootElement, handler) {
    element.removeEventListener(event as string, handler);
  }

  componentDidLoad() {
    let wrapper = this.rootElement.children[0];
    let child = wrapper.children[0] || this.rootElement;
    this.instrumentElement(child as HTMLElement);
  }

  render() {
    return (
      <div>
        <slot />
      </div>
    );
  }
}
