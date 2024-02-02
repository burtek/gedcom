import { parse } from 'gedcom';
import 'core-js/proposals/array-grouping-v2';
import { NestedData } from '../types/nested-data';


declare const self: SharedWorkerGlobalScope;

self.addEventListener('connect', ({ ports: [port] }) => {
    if (!port) {
        return;
    }
    port.addEventListener('message', ({ data: { payload, type } }) => {
        // eslint-disable-next-line default-case, @typescript-eslint/switch-exhaustiveness-check
        switch (type) {
            case 'parse': {
                try {
                    const { children } = parse(payload);
                    const data = Object.groupBy(children as NestedData[], datum => datum.type);
                    port.postMessage({ payload: data, type: 'parsed' });
                } catch (error) {
                    port.postMessage({ payload: error, type: 'error' });
                }
                break;
            }
        }
    });
    port.start()
});
