import 'core-js/proposals/array-grouping-v2';


declare global {
    interface ObjectConstructor {
        groupBy: <V, K extends string | number | symbol>(items: Iterable<V>, callbackfn: (value: V, index: number) => K) => { [key in K]: V[] };
    }

    interface MapConstructor {
        groupBy: <V, K extends string | number | symbol>(items: Iterable<V>, callbackfn: (value: V, index: number) => K) => Map<K, V[]>;
    }
}
