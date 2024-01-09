import { memo } from 'react';

import { useAppSelector } from '../store';
import { getShowUtils } from '../store/config/slice';
import { getPersons } from '../store/person/slice';

import { Person as PersonComponent } from './Person';


const Component = ({ show = false }) => {
    const showUtils = useAppSelector(getShowUtils);
    const persons = useAppSelector(getPersons);

    return (
        <table style={{ display: show ? undefined : 'none' }}>
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
                {persons.map(person => (
                    <PersonComponent
                        key={person.id}
                        person={person}
                    />
                ))}
            </tbody>
        </table>
    );
};
Component.displayName = 'Persons';

export const Persons = memo(Component);
