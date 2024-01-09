export function makeOptions<T, U>(options1: T[], options2: U[]): Array<[T, U]>;
export function makeOptions<T, U, V>(options1: T[], options2: U[], options3: V[]): Array<[T, U, V]>;
export function makeOptions<T, U, V, W>(options1: T[], options2: U[], options3: V[], options4: W[]): Array<[T, U, V, W]>;
export function makeOptions(...optionsArray: unknown[][]) {
    return optionsArray.reduce<unknown[][]>(
        (acc, thisOptions) => acc.flatMap(currentOptions => thisOptions.map(opt => [...currentOptions, opt])),
        [[]]
    );
}
