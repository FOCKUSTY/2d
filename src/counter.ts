export class Counter {
  private _value: number;

  public constructor(public readonly initialValue: number = 0) {
    this._value = initialValue;
  }

  public execute() {
    this._value++;
    return this._value;
  }

  public get value() {
    return this._value;
  }
}

export default Counter;
