import classNames from 'classnames';
import { memo, useMemo } from 'react';

import { useContextData } from '../data/data-context';
import { filterFamilies } from '../data/filters';

import { mapFamily } from './map';


const Component = ({ show = false }) => {
    const data = useContextData();

    const families = useMemo(
        () => data?.filter(filterFamilies).map(family => mapFamily(family, data)),
        [data]
    );

    if (!show) {
        return null;
    }

    return (
        <table>
            <thead>
                <tr>
                    <th />
                    <th colSpan={3}>has</th>
                    <th colSpan={4}>married</th>
                </tr>
                <tr>
                    <th>appID</th>
                    <th>wife</th>
                    <th>husband</th>
                    <th>children</th>
                    <th>date</th>
                    <th>place</th>
                    <th>status</th>
                </tr>
            </thead>
            <tbody>
                {families?.map(p => (
                    <tr key={p.id}>
                        <td>{p.xref}</td>
                        <td className={classNames({ error: !p.hasWife })}>{p.wife ?? '???'}</td>
                        <td className={classNames({ error: !p.hasHusband })}>{p.husband ?? '???'}</td>
                        <td>{p.children}</td>
                        <td className={classNames({ error: !p.married.date })}>{p.married.date}</td>
                        <td className={classNames({ error: !p.married.place })}>{p.married.place}</td>
                        <td className={classNames({ error: !p.married.status })}>{p.married.status}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};
Component.displayName = 'Families';

export const Families = memo(Component);
