import classNames from 'classnames';
import { memo } from 'react';

import { useConfig } from '../data/config-context';

import { BirthCell } from './PersonBirth';
import { BurialCell } from './PersonBurial';
import { DeathCell } from './PersonDeath';
import { LinksCell } from './PersonLinks';
import { NameCell } from './PersonName';
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
                {person.age}
            </td>
            <DeathCell {...person.dates} />
            <BurialCell {...person.dates} />
            {showUtils ? <LinksCell person={person} /> : null}
        </tr>
    );
}
Component.displayName = 'Person';
export const Person = memo(Component);

interface Props {
    person: MappedPerson;
}
