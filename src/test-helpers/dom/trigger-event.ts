import { nextTickPromise } from '../utils';
import { EventType } from './event-types';
import fireEvent, { EventOptions } from './fire-event';
import getElement from './get-element';

/**
  Triggers an event on the specified target.
  @public
  @param {string|Element} target the element or selector to trigger the event on
  @param {string} eventType the type of event to trigger
  @param {Object} options additional properties to be set on the event
  @return {Promise<void>} resolves when the application is settled
*/
export default async function(
  target: Element | string,
  eventType: EventType,
  options: EventOptions = {}
) {
  await nextTickPromise();

  let element = getElement(target);
  if (!element) {
    throw new Error(
      `Element not found when calling \`triggerEvent('${target}', ...)\`.`
    );
  }

  fireEvent(element, eventType, options);

  return nextTickPromise();
}
