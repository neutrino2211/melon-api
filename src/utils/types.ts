// Result<T, E>
export class Result<T, E extends Error> {
  constructor(private value?: T | PromiseLike<T>, private errorValue?: E) {}

  public isOk(): boolean {
    return this.value !== undefined && !this.errorValue;
  }

  public isErr(): boolean {
    return !this.isOk();
  }

  public error(): E | PromiseLike<E> {
    return this.errorValue!!
  }

  public unwrap(): T | PromiseLike<T> {
    if (this.isErr()) {
      console.error("unwrap error:", this.errorValue)
      throw this.errorValue;
    }

    return this.value!!;
  }

  static err<T, E extends Error>(err: E): Result<T, E> {
    return new this(undefined as T, err)
  }

  static ok<T, E extends Error>(val: T): Result<T, E> {
    return new this(val)
  }
}

// Option<T>
export class Maybe<T> {
  constructor(private value?: T ) {}

  public isSome(): boolean {
    return this.value !== undefined && this.value !== null;
  }

  public isNone(): boolean {
    return !this.isSome();
  }

  public unwrap(): NonNullable<Exclude<T, null>> {
    if (this.isNone()) {
      throw new Error('Option is empty');
    }

    return this.value!! as NonNullable<Exclude<T, null>>;
  }
}
