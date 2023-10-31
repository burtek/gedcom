import { memo, useMemo } from 'react';

import { useConfig } from '../data/config-context';
import { useContextData } from '../data/data-context';
import { filterPersons } from '../data/filters';
import { useSearchContext } from '../data/search-context';

import { Person as PersonComponent } from './Person';
import { mapPerson } from './map';


const Component = ({ show = false }) => {
    const data = useContextData();
    const [{ showUtils }] = useConfig();

    const persons = useMemo(
        () => data?.filter(filterPersons)
            .map(person => mapPerson(person, data))
            .sort(({ xref: apid1 }, { xref: apid2 }) => apid1.localeCompare(apid2, 'en', { numeric: true })),
        [data]
    );

    const search = useSearchContext();

    if (!show) {
        return null;
    }

    return (
        <table>
            <thead>
                <tr>
                    <th>appID</th>
                    <th />
                    <th colSpan={2}>has</th>
                    <th colSpan={4}>dates</th>
                    {showUtils ? <th /> : null}
                </tr>
                <tr>
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
                {persons?.filter(person => !search || [
                    person.names.some(name => name.name?.toLowerCase().includes(search.toLowerCase())),
                    person.names.some(name => name.surname?.toLowerCase().includes(search.toLowerCase()))
                ].some(Boolean)).map(person => (
                    <PersonComponent
                        key={person.xref}
                        person={person}
                    />
                ))}
            </tbody>
        </table>
    );
};
Component.displayName = 'Persons';

export const Persons = memo(Component);
