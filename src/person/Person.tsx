import classNames from 'classnames';
import { memo, useMemo } from 'react';

// import { useConfig } from '../data/config-context';
import { getAge, printDateYMD } from '../data/utils';

import { BirthCell } from './PersonBirth';
import { BurialCell } from './PersonBurial';
import { DeathCell } from './PersonDeath';
import { NameCell } from './PersonName';
import type { MappedPerson } from './map';


const findByType = (type: string) => (
    name: MappedPerson['names'][number]
): name is NonNullable<{ name: string; surname: string; type: string }> => name.type === type && typeof name.surname === 'string';

function Component({ person }: Props) {
    const [grobonetUrl, googleUrl] = useMemo<Array<string | undefined>>(() => {
        const searchName = person.names.find(findByType('married')) ?? person.names.find(findByType('birth'));

        if (!searchName) {
            return [];
        }

        const grobonetURL = new URL('https://grobonet.com/index.php?page=wyszukiwanie');
        grobonetURL.searchParams.set('imie', searchName.name);
        grobonetURL.searchParams.set('nazw', searchName.surname);

        const googleURL = new URL('https://www.google.com/search');
        const googleQ = [
            'site:grobonet.com',
            searchName.name,
            searchName.surname,
            person.dates.birth?.date && `"ur. ${printDateYMD(person.dates.birth.date)}"`,
            person.dates.death?.date && `"zm. ${printDateYMD(person.dates.death.date)}"`
        ].filter(Boolean).join('+');
        googleURL.searchParams.set('q', googleQ);

        return [grobonetURL.toString(), googleURL.toString()];
    }, [person.dates.birth?.date, person.dates.death?.date, person.names]);

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
            <td className="person-utils">
                {grobonetUrl
                    ? (
                        <a
                            href={grobonetUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Grobonet &gt;
                        </a>
                    )
                    : null}
                {googleUrl
                    ? (
                        <a
                            href={googleUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Google(grobonet) &gt;
                        </a>
                    )
                    : null}
            </td>
        </tr>
    );
}
Component.displayName = 'Person';
export const Person = memo(Component);

interface Props {
    person: MappedPerson;
}
