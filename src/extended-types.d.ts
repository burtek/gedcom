/* eslint-disable @typescript-eslint/method-signature-style */

interface Array<T> {
    includes<S>(searchElement: T extends S ? S : never, fromIndex?: number): boolean;
    indexOf<S>(searchElement: T extends S ? S : never, fromIndex?: number): number;
}

interface BooleanConstructor {
    // eslint-disable-next-line @typescript-eslint/prefer-function-type, @typescript-eslint/ban-types
    (value?: unknown): value is true | number | string | symbol | bigint | Record<string | number | symbol, unknown> | Array<unknown> | Function;
}
