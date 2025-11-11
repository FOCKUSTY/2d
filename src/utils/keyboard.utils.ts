export const enum Keyboard {
  // Буквенные клавиши (a–z)
  a = "a",
  b = "b",
  c = "c",
  d = "d",
  e = "e",
  f = "f",
  g = "g",
  h = "h",
  i = "i",
  j = "j",
  k = "k",
  l = "l",
  m = "m",
  n = "n",
  o = "o",
  p = "p",
  q = "q",
  r = "r",
  s = "s",
  t = "t",
  u = "u",
  v = "v",
  w = "w",
  x = "x",
  y = "y",
  z = "z",

  A = "A",
  B = "B",
  C = "C",
  D = "D",
  E = "E",
  F = "F",
  G = "G",
  H = "H",
  I = "I",
  J = "J",
  K = "K",
  L = "L",
  M = "M",
  N = "N",
  O = "O",
  P = "P",
  Q = "Q",
  R = "R",
  S = "S",
  T = "T",
  U = "U",
  V = "V",
  W = "W",
  X = "X",
  Y = "Y",
  Z = "Z",

  // Цифровые клавиши (0–9)
  zero = "0",
  one = "1",
  two = "2",
  three = "3",
  four = "4",
  five = "5",
  six = "6",
  seven = "7",
  eight = "8",
  nine = "9",

  // Символьные клавиши
  space = "space",
  enter = "enter",
  escape = "escape",
  tab = "tab",
  backspace = "backspace",
  delete = "delete",
  insert = "insert",

  // Знаки препинания
  minus = "-",
  equal = "=",
  bracketLeft = "[",
  bracketRight = "]",
  backslash = "\\",
  semicolon = ";",
  quote = "'",
  backquote = "`",
  comma = ",",
  period = ".",
  slash = "/",

  // Стрелки
  arrowUp = "up",
  arrowDown = "down",
  arrowLeft = "left",
  arrowRight = "right",

  // Функциональные клавиши
  f1 = "f1",
  f2 = "f2",
  f3 = "f3",
  f4 = "f4",
  f5 = "f5",
  f6 = "f6",
  f7 = "f7",
  f8 = "f8",
  f9 = "f9",
  f10 = "f10",
  f11 = "f11",
  f12 = "f12",

  // Навигация
  pageUp = "pageup",
  pageDown = "pagedown",
  home = "home",
  end = "end",

  // Модификаторы (обычно в комбинации)
  shift = "shift",
  ctrl = "ctrl",
  alt = "alt",
  meta = "meta", // Cmd (macOS) / Win (Windows)

  // Специальные последовательности (могут приходить как sequence)
  sequenceUp = "\x1b[A", // ESC [ A
  sequenceDown = "\x1b[B", // ESC [ B
  sequenceRight = "\x1b[C", // ESC [ C
  sequenceLeft = "\x1b[D", // ESC [ D
  sequenceHome = "\x1b[H", // ESC [ H
  sequenceEnd = "\x1b[F", // ESC [ F
  sequenceDelete = "\x1b[3~", // ESC [ 3 ~
  sequencePageUp = "\x1b[5~", // ESC [ 5 ~
  sequencePageDown = "\x1b[6~", // ESC [ 6 ~
  sequenceF1 = "\x1bOP", // ESC O P
  sequenceF2 = "\x1bOQ", // ESC O Q
  sequenceF3 = "\x1bOR", // ESC O R
  sequenceF4 = "\x1bOS" // ESC O S
}

export default Keyboard;
