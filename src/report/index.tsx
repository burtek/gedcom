import { memo, useMemo } from 'react';

import { useContextData } from '../data/data-context';
import { filterPersons } from '../data/filters';
import { mapPerson } from '../person/map';


function Component({ show = false }) {
    const data = useContextData();
    // eslint-disable-next-line no-console
    console.log(data);

    const persons = useMemo(
        () => data?.filter(filterPersons)
            .map(person => mapPerson(person, data))
            .sort(({ xref: apid1 }, { xref: apid2 }) => apid1.localeCompare(apid2, 'en', { numeric: true })),
        [data]
    );

    if (!show) {
        return null;
    }

    return (
        <div className="report">
            {persons?.map(person => {
                const name = `${person.names[0]?.surname} ${person.names[0]?.name}`;
                return (
                    <div
                        className="report__person"
                        key={person.xref}
                    >
                        <div className="report__person__name">{name}</div>
                    </div>
                );
            })}
        </div>
    );
}
Component.displayName = 'Report';

export const Report = memo(Component);
