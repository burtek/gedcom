import classNames from 'classnames';
import { memo } from 'react';

import type { MappedPerson } from '../store/person/map';


function Component({ person, rowSpan }: { person: MappedPerson; rowSpan?: number }) {
    const birthName = person.names.find(n => n.type === 'birth');
    const marriedName = person.names.find(n => n.type === 'married');

    const className = classNames({
        error: !birthName,
        notice: birthName && [
            !marriedName && person.sex === 'F' && (person.age && person.age >= 18),
            marriedName && (
                person.names.length > 2
                || !birthName.surname
                || !marriedName.surname
                || birthName.name !== marriedName.name
                || person.names.indexOf(birthName) > person.names.indexOf(marriedName)
            )
        ].some(Boolean)
    });

    return (
        <td
            className={className}
            rowSpan={rowSpan}
        >
            {person.names.map(
                (name, index) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <div key={index}>
                        {name.type}{name.lang ? `(${name.lang})` : ''}: {name.name} {name.surname}
                    </div>
                )
            )}
        </td>
    );
}
Component.displayName = 'NameCell';
export const NameCell = memo(Component);
