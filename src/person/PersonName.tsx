import classNames from 'classnames';
import { memo } from 'react';

import type { MappedPerson } from './map';


function Component({ person }: { person: MappedPerson }) {
    const birthName = person.names.find(n => n.type === 'birth');
    const marriedName = person.names.find(n => n.type === 'married');

    const className = classNames({
        error: !birthName,
        notice: birthName && [
            !marriedName && person.sex === 'F' && (!person.age || person.age >= 18),
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
        <td className={className}>
            {(Array.isArray(person.names) ? person.names : [person.names]).map(
                (name, index) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <div key={index}>
                        {name.type}: {name.name} {name.surname}
                    </div>
                )
            )}
        </td>
    );
}
Component.displayName = 'NameCell';
export const NameCell = memo(Component);
