export const DIRECTIONS = {
  UP: <[number, number]>[0,1],
  RIGHT: <[number, number]>[1,0],
  DOWN: <[number, number]>[0,-1],
  LEFT: <[number, number]>[-1,0]
} as const;

export const enum Directions {
  up = "UP",
  right = "RIGHT",
  down = "DOWN",
  left = "LEFT"
};
