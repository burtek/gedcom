import type { FC } from 'react';
import { useMemo } from 'react';

import { printDateYMD } from '../data/utils';

import type { MappedPerson } from './map';


interface FoundName {
    name: string; surname: string; type: string;
}
const findByType = (type: string) => (
    name: MappedPerson['names'][number]
): name is NonNullable<FoundName> => name.type === type && typeof name.surname === 'string';

interface Strategy {
    name: string;
    generateLink: (person: MappedPerson, searchName: FoundName) => string | undefined;
}
const SEARCH_STRATEGIES: Strategy[] = [
    {
        name: 'Grobonet',
        generateLink(_person, searchName) {
            const url = new URL('https://grobonet.com/index.php?page=wyszukiwanie');
            url.searchParams.set('imie', searchName.name);
            url.searchParams.set('nazw', searchName.surname);

            return url.toString();
        }
    },
    {
        name: 'Google (grobonet)',
        generateLink(person, searchName) {
            const url = new URL('https://www.google.com/search');
            url.searchParams.set('q',
                [
                    'site:grobonet.com',
                    searchName.name,
                    searchName.surname,
                    person.dates.birth?.date && `"ur. ${printDateYMD(person.dates.birth.date)}"`,
                    person.dates.death?.date && `"zm. ${printDateYMD(person.dates.death.date)}"`
                ].filter(Boolean).join(' '));

            return url.toString();
        }
    },
    {
        name: 'Google (grobonet/no surname)',
        generateLink(person, searchName) {
            const url = new URL('https://www.google.com/search');
            url.searchParams.set('q',
                [
                    'site:grobonet.com',
                    searchName.name,
                    person.dates.birth?.date && `"ur. ${printDateYMD(person.dates.birth.date)}"`,
                    person.dates.death?.date && `"zm. ${printDateYMD(person.dates.death.date)}"`
                ].filter(Boolean).join(' '));

            return url.toString();
        }
    },
    {
        name: 'Cm. komun. w W-wie',
        generateLink(_person, searchName) {
            const url = new URL('http://www.cmentarzekomunalne.com.pl/mapa/wyniki.php?check_nazwisko=off');
            url.searchParams.set('imie', searchName.name);
            url.searchParams.set('nazwisko', searchName.surname);

            return url.toString();
        }
    },
    {
        name: 'Powązki (manualne)',
        generateLink() {
            return 'https://mapa.um.warszawa.pl/mapaApp1/mapa?service=cmentarze';
        }
    }
];

const Component: FC<Props> = ({ person }) => {
    const renderedUrls = useMemo(() => SEARCH_STRATEGIES.map(({ name, generateLink }) => {
        const searchName = person.names.find(findByType('married')) ?? person.names.find(findByType('birth'));
        const link = searchName && generateLink(person, searchName);

        if (!link) {
            return null;
        }

        return (
            <a
                key={name}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
            >
                {name} &gt;
            </a>
        );
    }).filter(Boolean), [person]);

    return (
        <td className="person-utils">
            {renderedUrls}
        </td>
    );
};
Component.displayName = 'PersonSearch';
export const SearchCell = Component;

interface Props {
    person: MappedPerson;
}
