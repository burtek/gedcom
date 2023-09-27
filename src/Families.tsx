import classNames from 'classnames';
import { memo, useMemo } from 'react';

import { useContextData } from './data/data-context';
import type { Family, FamilyKey, PersonName, RootData } from './data/data-types';
import { EntryType } from './data/data-types';
import { makeDate } from './data/utils';


const namesToString = (names: PersonName[]) => {
    const married = names.find(n => n.TYPE?.value === 'married');
    const birth = names.find(n => n.TYPE?.value === 'birth');

    if (married && birth) {
        return `${married.GIVN.value} ${married.SURN?.value} (${birth.SURN?.value})`;
    } else if (married) {
        return `${married.GIVN.value} ${married.SURN?.value}`;
    } else if (names[0]) {
        return `${names[0].GIVN.value} ${names[0].SURN?.value}`;
    }
    return '???';
};

const Component = ({ show = false }) => {
    const data = useContextData();

    const families = useMemo(
        () => data && Object.entries(data)
            .filter((f): f is [FamilyKey, Family] => (f[1] as RootData[keyof RootData]).value === EntryType.FAM)
            .map(([apid, datum]) => ({
                apid,
                id: datum._UID.value,
                hasHusband: Boolean(datum.HUSB?.value),
                husband: datum.HUSB?.value ? namesToString(data[datum.HUSB.value].NAME) : null,
                hasWife: Boolean(datum.WIFE?.value),
                wife: datum.WIFE?.value ? namesToString(data[datum.WIFE.value].NAME) : null,
                children: datum.CHIL?.length,
                married: {
                    flag: datum.MARR?.value,
                    date: makeDate(datum.MARR?.DATE),
                    place: datum.MARR?.PLAC?.value,
                    status: datum._STAT?.value
                },
                lastModified: makeDate(datum.CHAN?.DATE)
            })),
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
                    <th>flag</th>
                </tr>
            </thead>
            <tbody>
                {families?.map(p => (
                    <tr key={p.id}>
                        <td>{p.apid}</td>
                        <td className={classNames({ error: !p.hasWife })}>{p.wife ?? '???'}</td>
                        <td className={classNames({ error: !p.hasHusband })}>{p.husband ?? '???'}</td>
                        <td>{p.children}</td>
                        <td className={classNames({ error: !p.married.date })}>{p.married.date}</td>
                        <td className={classNames({ error: !p.married.place })}>{p.married.place}</td>
                        <td className={classNames({ error: !p.married.status })}>{p.married.status}</td>
                        <td>{p.married.flag}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};
Component.displayName = 'Families';

export const Families = memo(Component);
