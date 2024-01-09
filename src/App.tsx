import type { ChangeEventHandler } from 'react';
import { memo, useCallback, useState } from 'react';

import './index.scss';
import { SearchContextProvider } from './context/search-context';
import { Families } from './families';
import { Graves } from './graves';
import { Persons } from './person';
import { Report } from './report';
import { useAppDispatch, useAppSelector } from './store';
import { actions, getShowUtils } from './store/config/slice';
import { readAndParseData } from './store/read-and-parse-data';


enum View {
    REPORT = 'Report',
    PERSONS = 'Persons',
    FAMILIES = 'Families',
    GRAVES = 'Graves',
    CALENDAR = 'Calendar (TODO)',
    TREE = 'Tree (TODO)'
}

function App() {
    const [view, setView] = useState(View.REPORT);

    const dispatch = useAppDispatch();
    const showUtils = useAppSelector(getShowUtils);
    const handleToggleUtils = useCallback(() => {
        dispatch(actions.toggleShowUtils());
    }, [dispatch]);

    const onChange: ChangeEventHandler<HTMLInputElement> = event => {
        const [file] = event.target.files ?? [];
        if (file) {
            void dispatch(readAndParseData(file));
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
                    accept=".ged"
                />
                <input
                    type="checkbox"
                    checked={showUtils}
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
