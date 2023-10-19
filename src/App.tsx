import type { ChangeEventHandler } from 'react';
import { memo, useCallback, useState } from 'react';

import './index.scss';
import { Families } from './Families';
import { useConfig } from './data/config-context';
import { useContextData, useContextDataSetter } from './data/data-context';
import { SearchContextProvider } from './data/search-context';
import { Persons } from './person';


enum View {
    PERSONS = 'Persons',
    FAMILIES = 'Families',
    RAW = 'Raw data'
    // CALENDAR = 'Calendar' // TODO
}

function App() {
    const data = useContextData();
    const [view, setView] = useState(View.PERSONS);

    const parseFile = useContextDataSetter();

    const [config, setConfig] = useConfig();
    const handleToggleUtils = useCallback<ChangeEventHandler<HTMLInputElement>>(event => {
        setConfig({ showUtils: event.target.checked });
    }, [setConfig]);

    const onChange: ChangeEventHandler<HTMLInputElement> = event => {
        if (event.target.files?.[0]) {
            parseFile(event.target.files[0]);
        }
    };

    const [search, setSearch] = useState('');
    const onChangeSearch = useCallback<ChangeEventHandler<HTMLInputElement>>(event => {
        setSearch(event.target.value);
    }, []);

    return (
        <SearchContextProvider value={search}>
            <div>
                <input
                    type="file"
                    onChange={onChange}
                />
                <input
                    type="checkbox"
                    checked={config.showUtils}
                    onChange={handleToggleUtils}
                    id="utils-toggle"
                />
                <label htmlFor="utils-toggle">
                    Show utils
                </label>
            </div>
            <div>
                {Object.values(View).map(v => (
                    <button
                        key={v}
                        type="button"
                        disabled={v === view}
                        onClick={() => {
                            setView(v);
                        }}
                    >
                        {v}
                    </button>
                ))}
            </div>
            <div>
                <input
                    type="text"
                    value={search}
                    onChange={onChangeSearch}
                />
            </div>
            <div className="data">
                <pre style={{
                    display: view === View.RAW ? 'block' : 'none',
                    overflow: 'auto',
                    maxHeight: '90vh'
                }}
                >
                    {JSON.stringify(data, undefined, 4)}
                </pre>
                <Persons show={view === View.PERSONS} />
                <Families show={view === View.FAMILIES} />
            </div>
        </SearchContextProvider>
    );
}
App.displayName = 'App';

export default memo(App);
