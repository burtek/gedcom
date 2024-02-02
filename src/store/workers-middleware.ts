import type { Middleware } from '@reduxjs/toolkit';


function onMessage(worker: Worker | SharedWorker, handler: (event: MessageEvent<{ payload: unknown; type: string }>) => void) {
    if (worker instanceof Worker) {
        worker.addEventListener('message', handler);
    } else if (worker instanceof SharedWorker) {
        worker.port.addEventListener('message', handler);
        worker.port.start();
    }
}
function postMessage(worker: Worker | SharedWorker, message: unknown) {
    if (worker instanceof Worker) {
        worker.postMessage(message);
    } else if (worker instanceof SharedWorker) {
        worker.port.postMessage(message);
    }
}

export const workerMiddleware = (workers: Record<string, Worker | SharedWorker>): Middleware => api => {
    for (const [key, worker] of Object.entries(workers)) {
        onMessage(worker, ({ data }) => {
            api.dispatch({ payload: data.payload, type: `worker:${key}/${data.type}` });
        });
    }
    return next => action => {
        if (typeof action === 'object' && action && 'type' in action && typeof action.type === 'string' && action.type.startsWith('worker:')) {
            const [, actionType = ''] = action.type.split(':');
            const [workerName, type] = actionType.split('/');
            if (workerName && workerName in workers) {
                const worker = workers[workerName];
                if (worker) {
                    postMessage(worker, { ...action, type });
                }
            }
        }
        return next(action);
    };
};
