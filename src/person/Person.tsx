import classNames from 'classnames';
import { memo } from 'react';

import { useConfig } from '../data/config-context';
import { getAge } from '../data/utils';

import { BirthCell } from './PersonBirth';
import { BurialCell } from './PersonBurial';
import { DeathCell } from './PersonDeath';
import { NameCell } from './PersonName';
import { SearchCell } from './PersonSearch';
import type { MappedPerson } from './map';


function Component({ person }: Props) {
    const [{ showUtils }] = useConfig();
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
            <DeathCell {...person.dates} />
            <BurialCell {...person.dates} />
            {showUtils ? <SearchCell person={person} /> : null}
        </tr>
    );
}
Component.displayName = 'Person';
export const Person = memo(Component);

interface Props {
    person: MappedPerson;
}
