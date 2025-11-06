export const enum Directions {
  up = "UP",
  right = "RIGHT",
  down = "DOWN",
  left = "LEFT"
}

export const DIRECTIONS: Record<Uppercase<Directions>, [number, number]> = {
  UP:    [  0,  1 ],
  RIGHT: [  1,  0 ],
  DOWN:  [  0, -1 ],
  LEFT:  [ -1,  0 ]
} as const;
