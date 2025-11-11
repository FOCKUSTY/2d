import type {
  FrameEvent,
  FrameEventCallback,
  FrameEvents,
  FrameEventsInitialiserType
} from "./types.frame";

import Counter from "../counter";

const SECOND = 1000;

export class AnimationFrame {
  public static readonly events: FrameEventsInitialiserType = {
    "keypress": (
      callback: FrameEventCallback<"keypress">,
      type: "add" | "remove"
    ) => {
      if (type === "add") {
        process.stdin.addListener("keypress", callback);
        return;
      }

      process.stdin.removeListener("keypress", callback);
    }
  } as const;

  /**
   * Конвертирует частоту кадров (FPS) в длительность одного кадра в секундах.
   *
   * @param framesPerSecond - Количество кадров в секунду (FPS). Должно быть положительным числом.
   * @returns Длительность одного кадра в секундах.
   * @throws Ошибка, если framesPerSecond <= 0.
   *
   * @example
   * ```ts
   * framesPerSecondToMillisecondsPerFrame(60); // возвращает 0.016666666666666666 (~16.67 мс)
   * framesPerSecondToMillisecondsPerFrame(30); // возвращает 0.03333333333333333 (~33.33 мс)
   * framesPerSecondToMillisecondsPerFrame(1);  // возвращает 1
   * ```
   */
  public static framesPerSecondToMillisecondsPerFrame(
    framesPerSecond: number
  ): number {
    if (framesPerSecond <= 0) {
      throw new Error("framesPerSecond должно быть положительным числом (> 0)");
    }

    return (1 / framesPerSecond) * SECOND;
  }

  private _interval: NodeJS.Timeout | null = null;
  private readonly _counter: Counter;

  private readonly _events: Partial<FrameEvents> = {};

  public constructor(public readonly millisecondsPerFrame: number = 20) {
    this._counter = new Counter();
  }

  public execute() {
    this.setInterval((frames) => {
      this.prerender();
      this.render(frames);
    });
  }

  public render(elapsedFrames: number): void {
    this.prerender();
    console.log(1, "прошло", elapsedFrames);
  }

  public setRender(render: (elapsedFrames: number) => string | null) {
    this.render = (elapsedFrames) => {
      const output = render(elapsedFrames);

      if (!output) {
        return;
      }

      console.log(output);
    };

    return render;
  }

  public addEventListener<T extends FrameEvent>(
    event: T,
    callback: FrameEventCallback<T>
  ) {
    this._events[event] = callback;
    AnimationFrame.events[event](callback, "add");
  }

  public removeEventListener<T extends FrameEvent>(
    event: T,
    callback: FrameEventCallback<T>
  ) {
    this._events[event] = undefined;
    AnimationFrame.events[event](callback, "remove");
  }

  public prerender() {
    console.clear();
  }

  public setPrerender(prerender: () => void) {
    this.prerender = prerender;
  }

  private setInterval(callback: (elapsedFrames: number) => void) {
    this._interval = setInterval(() => {
      callback(this._counter.execute());
    }, this.millisecondsPerFrame);

    return this._interval;
  }

  public get interval() {
    return this._interval;
  }
}

export default AnimationFrame;
