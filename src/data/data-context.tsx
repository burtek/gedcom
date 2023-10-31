import type { PropsWithChildren } from 'react';
import { createContext, memo, useCallback, useContext, useState } from 'react';

import type { NestedData } from './read-file';
import { readFile } from './read-file';


// eslint-disable-next-line @typescript-eslint/naming-convention
const DataContext = createContext<NestedData[] | null>(null);
DataContext.displayName = 'DataContext';
// eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/no-empty-function
const DataSetterContext = createContext<(data: File) => void>(() => {});
DataSetterContext.displayName = 'DataSetterContext';

export const DataContextProvider = memo(({ children }: PropsWithChildren) => {
    const [data, setData] = useState<NestedData[] | null>(null);

    const onFile = useCallback(
        async (file: File) => {
            setData(await readFile(file));
        },
        [setData]
    );

    return (
        <DataContext.Provider value={data}>
            <DataSetterContext.Provider value={onFile}>
                {children}
            </DataSetterContext.Provider>
        </DataContext.Provider>
    );
});
DataContextProvider.displayName = 'DataContextProvider';

export const useContextData = () => useContext(DataContext);
export const useContextDataSetter = () => useContext(DataSetterContext);
