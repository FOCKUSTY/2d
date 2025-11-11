// prettier-ignore-start
export const enum Directions {
  up = "UP",
  right = "RIGHT",
  down = "DOWN",
  left = "LEFT"
}

export const DIRECTIONS: Record<
  Uppercase<Directions>,
  [number, number, number]
> = {
  UP: [0, 1, 0],
  RIGHT: [1, 0, 0],
  DOWN: [0, -1, 0],
  LEFT: [-1, 0, 0]
} as const;
// prettier-ignore-end
