import type { MaybePromise, Null } from "@utils";

export type FrameEvent = "keypress";

export type FrameEvents<T = MaybePromise<Null>> = {
  "keypress": (
    data: string,
    key: {
      sequence: string;
      name?: string;
      ctrl: boolean;
      meta: boolean;
      shift: boolean;
    }
  ) => T;
};

export type FrameEventType = "add" | "remove";

export type FrameEventsInitialiserType<T = MaybePromise<Null>> = {
  [P in keyof FrameEvents]: (
    callback: FrameEvents[P],
    type: FrameEventType
  ) => T;
};

export type FrameEventCallback<T extends FrameEvent> = FrameEvents[T];
