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
    const hasFamilyWarning = !person.references.hasOwnFamily && (person.age && person.age >= 18);
    return (
        <>
            <tr>
                <td>{person.xref}</td>
                <NameCell
                    rowSpan={2}
                    person={person}
                />
                <td
                    rowSpan={2}
                    className={classNames({ warn: !person.references.hasParentFamily })}
                >
                    {person.references.hasParentFamily ? 'true' : 'false'}
                </td>
                <td
                    rowSpan={2}
                    className={classNames({ notice: hasFamilyWarning })}
                >
                    {person.references.hasOwnFamily ? 'true' : 'false'}
                </td>
                <BirthCell
                    rowSpan={2}
                    birth={person.dates.birth}
                />
                <td rowSpan={2}>
                    {person.age}
                </td>
                <DeathCell
                    rowSpan={2}
                    {...person.dates}
                />
                <BurialCell
                    rowSpan={2}
                    {...person.dates}
                />
                {showUtils
                    ? (
                        <LinksCell
                            rowSpan={2}
                            person={person}
                        />
                    )
                    : null}
            </tr>
            <tr>
                <td className={classNames({ error: person.sex === 'U' })}>{person.sex}</td>
            </tr>
        </>
    );
}
Component.displayName = 'Person';
export const Person = memo(Component);

interface Props {
    person: MappedPerson;
}
