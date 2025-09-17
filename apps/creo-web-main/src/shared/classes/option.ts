/* eslint-disable @typescript-eslint/no-explicit-any */
// option.ts
export abstract class Option<T> {
  // Discriminant for type guards & debugging
  protected readonly _tag: 'some' | 'none';
  protected constructor(tag: 'some' | 'none') { this._tag = tag; }

  // ----- Constructors / Factories -----
  static some<T>(value: T): Option<T> {
    if (value === undefined) throw new TypeError("Some() cannot contain undefined");
    return new Some(value);
  }

  static none<T = never>(): Option<T> {
    return None.instance as Option<T>;
  }

  static fromNullable<T>(value: T | null | undefined): Option<NonNullable<T>> {
    return value == null ? Option.none() : Option.some(value as NonNullable<T>);
  }

  static fromPredicate<T>(value: T, predicate: (v: T) => boolean): Option<T> {
    return predicate(value) ? Option.some(value) : Option.none<T>();
  }

  static tryCatch<T>(fn: () => T): Option<T> {
    try { return Option.some(fn()); } catch { return Option.none<T>(); }
  }

  /**
   * Lift tuple of Options into Option of tuple (Rust: Option::zip for pairs; this generalizes it).
   */
  static all<T extends readonly Option<any>[]>(
    ...opts: T
  ): Option<{ [K in keyof T]: T[K] extends Option<infer U> ? U : never }> {
    const vals: any[] = [];
    for (const o of opts) {
      if (o.isNone()) return Option.none();
      vals.push((o as Some<any>).value);
    }
    return Option.some(vals as any);
  }

  // ----- Type Guards -----
  isSome(): this is Some<T> { return this._tag === 'some'; }
  isNone(): this is None { return this._tag === 'none'; }

  // ----- Core combinators -----
  map<U>(fn: (v: T) => U): Option<U> {
    return this.isSome() ? Option.some(fn(this.value)) : Option.none<U>();
  }

  mapOr<U>(defaultValue: U, fn: (v: T) => U): U {
    return this.isSome() ? fn(this.value) : defaultValue;
  }

  mapOrElse<U>(defaultFn: () => U, fn: (v: T) => U): U {
    return this.isSome() ? fn(this.value) : defaultFn();
  }

  andThen<U>(fn: (v: T) => Option<U>): Option<U> { // Rust: Option::and_then
    return this.isSome() ? fn(this.value) : Option.none<U>();
  }

  flatMap<U>(fn: (v: T) => Option<U>): Option<U> { // Alias for andThen
    return this.andThen(fn);
  }

  filter(predicate: (v: T) => boolean): Option<T> {
    return this.isSome() && predicate(this.value) ? this : Option.none<T>();
  }

  or(other: Option<T>): Option<T> {
    return this.isSome() ? this : other;
  }

  orElse(otherFn: () => Option<T>): Option<T> {
    return this.isSome() ? this : otherFn();
  }

  xor(other: Option<T>): Option<T> {
    const a = this.isSome();
    const b = other.isSome();
    if (a && !b) return this;
    if (!a && b) return other;
    return Option.none<T>();
  }

  // ----- Unwraps -----
  unwrap(): T {
    if (this.isSome()) return this.value;
    throw new Error("Tried to unwrap None");
  }

  expect(msg: string): T {
    if (this.isSome()) return this.value;
    throw new Error(msg);
  }

  unwrapOr(defaultValue: T): T {
    return this.isSome() ? this.value : defaultValue;
  }

  unwrapOrElse(defaultFn: () => T): T {
    return this.isSome() ? this.value : defaultFn();
  }

  unwrapOrUndefined(): T | undefined {
    return this.isSome() ? this.value : undefined;
  }

  unwrapOrNull(): T | null {
    return this.isSome() ? this.value : null;
  }

  // ----- Utilities -----
  match<U>(arms: { some: (v: T) => U; none: () => U }): U {
    return this.isSome() ? arms.some(this.value) : arms.none();
  }

  inspect(sideEffect: (v: T) => void): this {
    if (this.isSome()) sideEffect(this.value);
    return this;
  }
}

export class Some<T> extends Option<T> {
  /** The contained value (visible for ergonomic chaining & guards) */
  public readonly value: T;
  constructor(value: T) {
    super('some');
    this.value = value;
  }
}

export class None extends Option<never> {
  static readonly instance = new None();
  private constructor() { super('none'); }
}
