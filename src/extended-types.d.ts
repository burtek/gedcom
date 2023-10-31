/* eslint-disable @typescript-eslint/method-signature-style */

interface Array<T> {
    includes<S>(searchElement: T extends S ? S : never, fromIndex?: number): boolean;
    indexOf<S>(searchElement: T extends S ? S : never, fromIndex?: number): number;
}

type BooleanPredicate = {
    // eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/prefer-function-type
    <T>(value?: T): value is T & true | number | string | symbol | bigint | Record<string | number | symbol, unknown> | Array<unknown> | Function;
} & BooleanConstructor;
