import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import App from './App.tsx';
import './index.scss';
import './polyfills';
import 'rc-tooltip/assets/bootstrap_white.css';
import { persistor, store } from './store';


const root = document.getElementById('root');
if (!root) {
    throw new Error('no root found');
}

dayjs.extend(customParseFormat);

ReactDOM.createRoot(root).render(
    <React.StrictMode>
        <Provider store={store}>
            <PersistGate
                loading={null}
                persistor={persistor}
            >
                <App />
            </PersistGate>
        </Provider>
    </React.StrictMode>
);
