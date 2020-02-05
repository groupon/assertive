export function expect(actual: boolean): void;
export function expect(msg: string, actual: boolean): void;
export function expect(actual: Promise<boolean>): Promise<void>;
export function expect(msg: string, actual: Promise<boolean>): Promise<void>;

export function truthy(actual: any): void;
export function truthy(msg: string, actual: any): void;
export function truthy(actual: Promise<any>): Promise<void>;
export function truthy(msg: string, actual: Promise<any>): Promise<void>;

export function falsey(actual: any): void;
export function falsey(msg: string, actual: any): void;
export function falsey(actual: Promise<any>): Promise<void>;
export function falsey(msg: string, actual: Promise<any>): Promise<void>;

export function equal<T>(expected: T, actual: T): void;
export function equal<T>(msg: string, expected: T, actual: T): void;
export function equal<T>(expected: T, actual: Promise<T>): Promise<void>;
export function equal<T>(
  msg: string,
  expected: T,
  actual: Promise<T>
): Promise<void>;

export function notEqual(expected: any, actual: any): void;
export function notEqual(msg: string, expected: any, actual: any): void;
export function notEqual(expected: any, actual: Promise<any>): Promise<void>;
export function notEqual(
  msg: string,
  expected: any,
  actual: Promise<any>
): Promise<void>;

export function deepEqual(expected: any, actual: any): void;
export function deepEqual(msg: string, expected: any, actual: any): void;
export function deepEqual(expected: any, actual: Promise<any>): Promise<void>;
export function deepEqual(msg: string, expected: any, actual: Promise<any>):
  Promise<void>;

export function notDeepEqual(expected: any, actual: any): void;
export function notDeepEqual(msg: string, expected: any, actual: any): void;
export function notDeepEqual(expected: any, actual: Promise<any>):
  Promise<void>;
export function notDeepEqual(msg: string, expected: any, actual: Promise<any>):
  Promise<void>;

export function include(needle: any, haystack: any[]): void;
export function include(msg: string, needle: any, haystack: any[]): void;
export function include(needle: string | RegExp, haystack: string): void;
export function include(needle: any, haystack: Promise<any[]>): Promise<void>;
export function include(msg: string, needle: string | RegExp, haystack: string):
  void;
export function include(msg: string, needle: any, haystack: Promise<any[]>):
  Promise<void>;
export function include(needle: string | RegExp, haystack: Promise<string>):
  Promise<void>;
export function include(
  msg: string,
  needle: string | RegExp,
  haystack: Promise<string>
): Promise<void>;

export function notInclude(needle: any, haystack: any[]): void;
export function notInclude(msg: string, needle: any, haystack: any[]): void;
export function notInclude(needle: string | RegExp, haystack: string): void;
export function notInclude(needle: any, haystack: Promise<any[]>):
  Promise<void>;
export function notInclude(
  msg: string,
  needle: string | RegExp,
  haystack: string
): void;
export function notInclude(msg: string, needle: any, haystack: Promise<any[]>):
  Promise<void>;
export function notInclude(needle: string | RegExp, haystack: Promise<string>):
  Promise<void>;
export function notInclude(
  msg: string,
  needle: string | RegExp,
  haystack: Promise<string>
): Promise<void>;

export function match(expected: RegExp, actual: string): void;
export function match(msg: string, expected: RegExp, actual: string): void;
export function match(expected: RegExp, actual: Promise<string>): Promise<void>;
export function match(msg: string, expected: RegExp, actual: Promise<string>):
  Promise<void>;

export function notMatch(expected: RegExp, actual: string): void;
export function notMatch(msg: string, expected: RegExp, actual: string): void;
export function notMatch(expected: RegExp, actual: Promise<string>):
  Promise<void>;
export function notMatch(
  msg: string,
  expected: RegExp,
  actual: Promise<string>
): Promise<void>;

export function throws(fn: (...args: any) => any): any;
export function throws(msg: string, fn: (...args: any) => any): any;

export function notThrows(fn: (...args: any) => any): void;
export function notThrows(msg: string, fn: (...args: any) => any): void;

type TypeClass =
  null | typeof Date | typeof Array | typeof String | typeof RegExp |
  typeof Boolean | typeof Function | typeof Object | typeof Number |
  undefined | Number | String;

export function hasType(expected: TypeClass, actual: any): void;
export function hasType(msg: string, expected: TypeClass, actual: any): void;
export function hasType(expected: TypeClass, actual: Promise<any>):
  Promise<void>;
export function hasType(msg: string, expected: TypeClass, actual: Promise<any>):
  Promise<void>;

export function notHasType(expected: TypeClass, actual: any): void;
export function notHasType(msg: string, expected: TypeClass, actual: any): void;
export function notHasType(expected: TypeClass, actual: Promise<any>):
  Promise<void>;
export function notHasType(
  msg: string,
  expected: TypeClass,
  actual: Promise<any>
): Promise<void>;

export function resolves(actual: Promise<any>): Promise<void>;
export function resolves(msg: string, actual: Promise<any>): Promise<void>;

export function rejects(actual: Promise<any>): Promise<any>;
export function rejects(msg: string, actual: Promise<any>): Promise<any>;
