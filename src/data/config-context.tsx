import type { ContextType, PropsWithChildren } from 'react';
import { createContext, memo, useCallback, useContext, useMemo, useState } from 'react';


export interface Settings {
    showUtils: boolean;
}
const initial: Settings = { showUtils: false };

// eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/no-empty-function
const ConfigContext = createContext<[config: Settings, setConfig: (data: Partial<Settings>) => void]>([initial, () => {}]);
ConfigContext.displayName = 'ConfigContext';

export const ConfigContextProvider = memo(({ children }: PropsWithChildren) => {
    const [config, setConfig] = useState<Settings>(() => {
        const stored = JSON.parse(localStorage.getItem('ged:config') ?? '{}') as Partial<Settings>;
        return { ...initial, ...stored };
    });

    const onToggleSettings = useCallback(
        (data: Partial<Settings>) => {
            setConfig(old => {
                const newConfig = { ...old, ...data };
                localStorage.setItem('ged:config', JSON.stringify(newConfig));
                return newConfig;
            });
        },
        [setConfig]
    );

    const value = useMemo(() => [config, onToggleSettings] as ContextType<typeof ConfigContext>, [config, onToggleSettings]);

    return (
        <ConfigContext.Provider value={value}>
            {children}
        </ConfigContext.Provider>
    );
});
ConfigContextProvider.displayName = 'ConfigContextProvider';

export const useConfig = () => useContext(ConfigContext);
