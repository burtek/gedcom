import { createContext, useContext } from 'react';


// eslint-disable-next-line @typescript-eslint/naming-convention
const SearchContext = createContext('');
SearchContext.displayName = 'SearchContext';

export const { Provider: SearchContextProvider } = SearchContext;

export const useSearchContext = () => useContext(SearchContext);
