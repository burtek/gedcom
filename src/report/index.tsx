import { memo } from 'react';

import { useAppSelector } from '../store';
import { getPersons } from '../store/data/person';


function Component({ show = false }) {
    const persons = useAppSelector(getPersons);

    if (!show) {
        return null;
    }

    return (
        <div className="report">
            {persons.map(person => (
                <div
                    className="report__person"
                    key={person.id}
                >
                    <div className="report__person__name">{`${person.names[0]?.surname} ${person.names[0]?.name}`}</div>
                </div>
            ))}
        </div>
    );
}
Component.displayName = 'Report';

export const Report = memo(Component);
