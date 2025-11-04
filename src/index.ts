import Coords from "./coords";
import AnimationFrame from "./frame";
import Matrix from "./matrix";
import Vector2 from "./vector2";

const matrix = new Matrix(10, 30, "#");
const animationFrame = new AnimationFrame(20);

const drawCoords = Coords.from([5, 5]);

const RIGHTS = [0,1,2];
const UP = [2,3,4];
const LEFT = [4,5,6];
const DOWN = [6,7,8];

const numberToCoords = (num: number) => {
  const n = num % 9;
  const coords = Coords.from([0, 0]);

  if (RIGHTS.includes(n)) {
    coords.summ(Coords.from([1, 0]));
  }
  if (UP.includes(n)) {
    coords.summ(Coords.from([0, 1]));
  }
  if (LEFT.includes(n)) {
    coords.summ(Coords.from([-1, 0]));
  }
  if (DOWN.includes(n)) {
    coords.summ(Coords.from([0, -1]));
  }

  return coords;
}

let previous: Coords = drawCoords.copy();

// animationFrame.setPrerender(() => {});

matrix.draw(drawCoords, ".");
animationFrame.setRender((frames) => {
  const move = numberToCoords(frames);
  const moveToCoords = previous.summ(move);

  const vector2 = new Vector2(moveToCoords, previous.copy().summ(move.inverse()));
  const newCoords = matrix.move(vector2);
  previous = newCoords;

  return matrix.toString();
});

animationFrame.execute();
