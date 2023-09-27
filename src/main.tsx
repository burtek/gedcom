import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App.tsx';
import './index.scss';
import { ConfigContextProvider } from './data/config-context.tsx';
import { DataContextProvider } from './data/data-context.tsx';


const root = document.getElementById('root');
if (!root) {
    throw new Error('no root found');
}

dayjs.extend(customParseFormat);

ReactDOM.createRoot(root).render(
    <React.StrictMode>
        <ConfigContextProvider>
            <DataContextProvider>
                <App />
            </DataContextProvider>
        </ConfigContextProvider>
    </React.StrictMode>
);
