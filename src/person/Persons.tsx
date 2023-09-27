import { memo, useMemo } from 'react';

import { useConfig } from '../data/config-context';
import { useContextData } from '../data/data-context';
import type { Person, PersonKey, RootData } from '../data/data-types';
import { EntryType } from '../data/data-types';

import { Person as PersonComponent } from './Person';
import { mapPerson } from './map';


const Component = ({ show = false }) => {
    const data = useContextData();
    const [{ showUtils }] = useConfig();

    const persons = useMemo(
        () => data && Object.entries(data)
            .filter((f): f is [PersonKey, Person] => (f[1] as RootData[keyof RootData]).value === EntryType.INDI)
            .map(([apid, datum]) => mapPerson(apid, datum, data)),
        [data]
    );

    if (!show) {
        return null;
    }

    return (
        <table>
            <thead>
                <tr>
                    <th colSpan={3} />
                    <th colSpan={2}>has</th>
                    <th colSpan={4}>dates</th>
                    {showUtils ? <th /> : null}
                </tr>
                <tr>
                    <th>appID</th>
                    <th>sex</th>
                    <th>names</th>
                    <th>parents</th>
                    <th>family</th>
                    <th>birth</th>
                    <th>(age)</th>
                    <th>death</th>
                    <th>burrial</th>
                    {showUtils ? <th>Utils</th> : null}
                </tr>
            </thead>
            <tbody>
                {persons?.map(person => (
                    <PersonComponent
                        key={person.apid}
                        person={person}
                    />
                ))}
            </tbody>
        </table>
    );
};
Component.displayName = 'Persons';

export const Persons = memo(Component);
