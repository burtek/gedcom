import type { ChangeEventHandler } from 'react';
import { memo, useCallback, useState } from 'react';

import './index.scss';
import { useConfig } from './data/config-context';
import { useContextData, useContextDataSetter } from './data/data-context';
import { SearchContextProvider } from './data/search-context';
import { Families } from './families';
import { Graves } from './graves';
import { Persons } from './person';
import { Report } from './report';


enum View {
    REPORT = 'Report',
    PERSONS = 'Persons',
    FAMILIES = 'Families',
    RAW = 'Raw data',
    GRAVES = 'Graves'
    // CALENDAR = 'Calendar' // TODO
}

function App() {
    const data = useContextData();
    const [view, setView] = useState(View.REPORT);

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
                    placeholder="Search"
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
                <Report show={view === View.REPORT} />
                <Graves show={view === View.GRAVES} />
            </div>
        </SearchContextProvider>
    );
}
App.displayName = 'App';

export default memo(App);
