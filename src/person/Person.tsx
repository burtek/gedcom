import classNames from 'classnames';
import { memo, useMemo } from 'react';

import { useConfig } from '../data/config-context';
import { getAge } from '../data/utils';

import { BirthCell } from './PersonBirth';
import { BurialCell } from './PersonBurial';
import { DeathCell } from './PersonDeath';
import { NameCell } from './PersonName';
import type { SearchName } from './grobonet';
import type { MappedPerson } from './map';


const findByType = (type: string) => (
    name: MappedPerson['names'][number]
): name is NonNullable<SearchName & { type: string }> => name.type === type && typeof name.surname === 'string';

function Component({ person }: Props) {
    const [{ grobonet }] = useConfig();
    const searchName = useMemo<SearchName>(
        () => (grobonet ? person.names.find(findByType('married')) ?? person.names.find(findByType('birth')) : undefined),
        [grobonet, person.names]
    );

    return (
        <tr>
            <td>{person.apid}</td>
            <td className={classNames({ error: person.sex === 'U' })}>{person.sex}</td>
            <NameCell person={person} />
            <td className={classNames({ warn: !person.references.hasParentFamily })}>{person.references.hasParentFamily ? 'true' : 'false'}</td>
            <td className={classNames({ notice: !person.references.hasOwnFamily })}>{person.references.hasOwnFamily ? 'true' : 'false'}</td>
            <BirthCell birth={person.dates.birth} />
            <td>
                {getAge(person.dates.birth?.date, person.dates.death?.date)}
            </td>
            <DeathCell
                {...person.dates}
                searchName={searchName}
            />
            <BurialCell
                {...person.dates}
                searchName={searchName}
            />
        </tr>
    );
}
Component.displayName = 'Person';
export const Person = memo(Component);

interface Props {
    person: MappedPerson;
}
