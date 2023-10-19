import type { FC } from 'react';
import { Fragment, useCallback, useMemo } from 'react';

import { printDateYMD } from '../data/utils';

import type { MappedPerson } from './map';


interface FoundName {
    name: string; surname: string; type: string;
}
const findByType = (type: string) => (
    name: MappedPerson['names'][number]
): name is NonNullable<FoundName> => name.type === type && typeof name.surname === 'string';

interface Link {
    name: string;
    generateLink: (person: MappedPerson, foundName: FoundName) => string | undefined;
}
interface LinksGroup {
    name: string;
    strategies: Link[];
}
const LINKS_STRATEGIES: Array<Link | LinksGroup> = [
    {
        name: 'Grobonet',
        generateLink(_person, foundName) {
            const url = new URL('https://grobonet.com/index.php?page=wyszukiwanie');
            url.searchParams.set('imie', foundName.name);
            url.searchParams.set('nazw', foundName.surname);

            return url.toString();
        }
    },
    {
        name: 'Google',
        strategies: [
            {
                name: 'grobonet',
                generateLink(person, foundName) {
                    const url = new URL('https://www.google.com/search');
                    url.searchParams.set('q',
                        [
                            'site:grobonet.com',
                            foundName.name,
                            foundName.surname,
                            person.dates.birth?.date && `"ur. ${printDateYMD(person.dates.birth.date) ?? /\d{4}/.exec(person.dates.birth.date)?.[0]}"`,
                            person.dates.death?.date && `"zm. ${printDateYMD(person.dates.death.date) ?? /\d{4}/.exec(person.dates.death.date)?.[0]}"`
                        ].filter(Boolean).join(' '));

                    return url.toString();
                }
            },
            {
                name: 'grobonet/no surname',
                generateLink(person, foundName) {
                    const url = new URL('https://www.google.com/search');
                    url.searchParams.set('q',
                        [
                            'site:grobonet.com',
                            foundName.name,
                            person.dates.birth?.date && `"ur. ${printDateYMD(person.dates.birth.date) ?? /\d{4}/.exec(person.dates.birth.date)?.[0]}"`,
                            person.dates.death?.date && `"zm. ${printDateYMD(person.dates.death.date) ?? /\d{4}/.exec(person.dates.death.date)?.[0]}"`
                        ].filter(Boolean).join(' '));

                    return url.toString();
                }
            },
            {
                name: 'imie+nazwisko',
                generateLink(person, foundName) {
                    const url = new URL('https://www.google.com/search');
                    url.searchParams.set('q',
                        [
                            foundName.name,
                            foundName.surname,
                            person.dates.birth?.date && `"ur. ${/\d{4}/.exec(person.dates.birth.date)?.[0]}"`,
                            person.dates.death?.date && `"zm. ${/\d{4}/.exec(person.dates.death.date)?.[0]}"`
                        ].filter(Boolean).join(' '));

                    return url.toString();
                }
            },
            {
                name: 'imie',
                generateLink(person, foundName) {
                    const url = new URL('https://www.google.com/search');
                    url.searchParams.set('q',
                        [
                            foundName.name,
                            person.dates.birth?.date && `"ur. ${/\d{4}/.exec(person.dates.birth.date)?.[0]}"`,
                            person.dates.death?.date && `"zm. ${/\d{4}/.exec(person.dates.death.date)?.[0]}"`
                        ].filter(Boolean).join(' '));

                    return url.toString();
                }
            }
        ]
    },
    {
        name: 'Cm. komun. w W-wie',
        generateLink(_person, foundName) {
            const url = new URL('http://www.cmentarzekomunalne.com.pl/mapa/wyniki.php?check_nazwisko=off');
            url.searchParams.set('imie', foundName.name);
            url.searchParams.set('nazwisko', foundName.surname);

            return url.toString();
        }
    },
    {
        name: 'Powązki (manualne)',
        generateLink() {
            return 'https://mapa.um.warszawa.pl/mapaApp1/mapa?service=cmentarze';
        }
    },
    {
        name: 'genetyka.genealodzy.pl',
        generateLink(_person, foundName) {
            const url = new URL('https://geneteka.genealodzy.pl/index.php?from_date=&to_date=&rpp1=&bdm=&w=&op=se&lang=pol');
            url.searchParams.set('search_lastname', foundName.surname);
            url.searchParams.set('search_lastname2', '');

            return url.toString();
        }
    }
];

const Component: FC<Props> = ({ person }) => {
    const renderUrls = useCallback((strat: Link | LinksGroup) => {
        const foundName = person.names.find(findByType('married')) ?? person.names.find(findByType('birth'));

        if ('strategies' in strat) {
            return (
                <div key={strat.name}>
                    {strat.name}:&nbsp;({strat.strategies
                        .map(renderUrls)
                        .filter(Boolean)
                        // eslint-disable-next-line react/no-array-index-key
                        .flatMap((x, index, { length }) => (length === index + 1 ? x : [x, <Fragment key={`comma-${index}`}>,&nbsp;</Fragment>]))})
                </div>
            );
        }

        const link = foundName && strat.generateLink(person, foundName);

        if (!link) {
            return null;
        }

        return (
            <a
                key={strat.name}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
            >
                {strat.name}
            </a>
        );
    }, [person]);
    const renderedUrls = useMemo(() => LINKS_STRATEGIES.map(renderUrls).filter(Boolean), [renderUrls]);

    return (
        <td className="person-utils">
            {renderedUrls}
        </td>
    );
};
Component.displayName = 'PersonLinks';
export const LinksCell = Component;

interface Props {
    person: MappedPerson;
}
