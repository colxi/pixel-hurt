import { EmptyObject } from '@/types'

type EventDictionary = Record<PropertyKey, Record<PropertyKey, unknown>>

type EventDictionaryWithEventName<EVENT_DICTIONARY> = {
  [K in keyof EVENT_DICTIONARY]: EVENT_DICTIONARY[K] & { eventName: K }
}

type CustomEventCallback<DATA extends Record<PropertyKey, unknown>> = (
  event: CustomEvent<DATA>
) => void | Promise<void>

export class EventBus<
  EVENT_DICTIONARY_BASE extends EventDictionary,
  EVENT_DICTIONARY extends
    EventDictionary = EventDictionaryWithEventName<EVENT_DICTIONARY_BASE>,
  EVENT_NAME extends keyof EVENT_DICTIONARY_BASE = keyof EVENT_DICTIONARY_BASE,
> {
  constructor(events: { [T in EVENT_NAME]: T }) {
    this.Event = events
  }

  public readonly Event: Readonly<{ [T in EVENT_NAME]: T }>

  /**
   *
   * Dispatch an event
   *
   */
  public dispatch<T extends EVENT_NAME>(
    eventName: T,
    data: EVENT_DICTIONARY_BASE[T] extends EmptyObject
      ? EmptyObject
      : EVENT_DICTIONARY_BASE[T]
  ) {
    const event = new CustomEvent(eventName as string, {
      detail: {
        ...data,
        eventName,
      },
    })
    window.dispatchEvent(event)
  }

  /**
   *
   * Subscribe to an event or several events
   *
   */
  public subscribe<T extends EVENT_NAME | EVENT_NAME[]>(
    eventName: T,
    callback: T extends Array<any>
      ? CustomEventCallback<EVENT_DICTIONARY[T[number]]>
      : T extends keyof EVENT_DICTIONARY
        ? CustomEventCallback<EVENT_DICTIONARY[T]>
        : never
  ) {
    if (Array.isArray(eventName)) {
      const uniqueEvents = [...new Set(eventName)]
      for (const currentEventName of uniqueEvents) {
        window.addEventListener(currentEventName as string, callback as any)
      }
    } else {
      window.addEventListener(eventName as string, callback as any)
    }
  }

  /**
   *
   * Unsubscribe from an event or several events
   *
   */
  public unsubscribe<T extends EVENT_NAME | EVENT_NAME[]>(
    eventName: T,
    callback: T extends Array<any>
      ? CustomEventCallback<EVENT_DICTIONARY[T[number]]>
      : T extends keyof EVENT_DICTIONARY
        ? CustomEventCallback<EVENT_DICTIONARY[T]>
        : never
  ) {
    if (Array.isArray(eventName)) {
      const uniqueEvents = [...new Set(eventName)]
      for (const currentEventName of uniqueEvents) {
        window.removeEventListener(currentEventName as string, callback as any)
      }
    } else {
      window.removeEventListener(eventName as string, callback as any)
    }
  }
}
