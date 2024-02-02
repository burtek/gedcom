import classNames from 'classnames';
import { memo } from 'react';

import { useSearchContext } from '../context/search-context';
import { useAppSelector } from '../store';
import { getShowUtils } from '../store/config/slice';
import { getFamily } from '../store/data/family';
import type { MappedPerson } from '../store/data/person';

import { BirthCell } from './PersonBirth';
import { BurialCell } from './PersonBurial';
import { DeathCell } from './PersonDeath';
import { LinksCell } from './PersonLinks';
import { NameCell } from './PersonName';


function Component({ person }: Props) {
    const search = useSearchContext();
    const showUtils = useAppSelector(getShowUtils);

    const parentsFamily = useAppSelector(state => (person.references.parentFamily ? getFamily(state, person.references.parentFamily) : null));
    const ownFamily = useAppSelector(state => (person.references.ownFamily ? getFamily(state, person.references.ownFamily) : null));

    const hasFamilyWarning = !ownFamily && (person.age && person.age >= 18);

    if (search && ![...person.names.map(n => `${n.name} ${n.surname}`), ...person.occupation, person.id].some(value => value.toLowerCase().includes(search.toLowerCase()))) {
        return null;
    }

    return (
        <>
            <tr>
                <td>{person.id}</td>
                <NameCell
                    rowSpan={2}
                    person={person}
                />
                <td
                    rowSpan={2}
                    className={classNames({ warn: !parentsFamily?.husband || !parentsFamily.wife })}
                    style={{ textAlign: 'center' }}
                >
                    {parentsFamily ? 'true' : 'false'}
                </td>
                <td
                    rowSpan={2}
                    className={classNames({ notice: hasFamilyWarning })}
                    style={{ textAlign: 'center' }}
                >
                    {ownFamily ? 'true' : 'false'}
                    <br />
                    {ownFamily?.children.length}
                </td>
                <BirthCell
                    rowSpan={2}
                    birth={person.dates.birth}
                />
                <td
                    rowSpan={2}
                    className={classNames({
                        error: !!person.age && !person.dates.death?.date && person.age >= 100,
                        warn: !!person.age && !person.dates.death?.date && person.age >= 90
                    })}
                >
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
                <td className={classNames({ error: person.sex === 'U' }, 'no-right-border')}>{person.sex}</td>
            </tr>
        </>
    );
}
Component.displayName = 'Person';
export const Person = memo(Component);

interface Props {
    person: MappedPerson;
}
