import type { FC } from 'react';
import { createRef, useMemo } from 'react';

import { printDateYMD } from '../data/utils';

import type { MappedPerson } from './map';


interface FoundName {
    name: string; surname: string; type: string; lang: string;
}
const findByType = (type: string) => (
    name: MappedPerson['names'][number]
): name is FoundName => name.type === type && typeof name.surname === 'string';

interface Link {
    name: string;
    generateLink: (person: MappedPerson, foundName: FoundName) => string | undefined;
    generatePostRequest?: (person: MappedPerson, foundName: FoundName) => Record<string, string>;
}
interface LinksGroup {
    name: string;
    strategies: (person: MappedPerson) => Link[];
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
        strategies: () => [
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
        strategies: person => {
            const fromDate = person.dates.birth?.date?.match(/\d{3,}/)?.[0];
            const toDate = person.dates.death?.date?.match(/\d{3,}/)?.[0];
            return [...new Set([...person.names.map(name => name.surname).filter(Boolean) as string[]])].flatMap(surname => [{
                name: surname,
                generateLink() {
                    const url = new URL('https://geneteka.genealodzy.pl/index.php?from_date=&to_date=&rpp1=&bdm=&w=&op=se&lang=pol');
                    url.searchParams.set('search_lastname', surname);
                    url.searchParams.set('search_lastname2', '');
                    return url.toString();
                }
            }, (Boolean(fromDate) || Boolean(toDate)) && {
                name: [surname, fromDate && `od ${fromDate}`, toDate && `do ${toDate}`].filter(Boolean).join(' '),
                generateLink() {
                    const url = new URL('https://geneteka.genealodzy.pl/index.php?rpp1=&bdm=&w=&op=se&lang=pol');
                    url.searchParams.set('search_lastname', surname);
                    url.searchParams.set('search_lastname2', '');
                    if (fromDate) {
                        url.searchParams.set('from_date', fromDate);
                    }
                    if (toDate) {
                        url.searchParams.set('to_date', toDate);
                    }
                    return url.toString();
                }
            }].filter(Boolean) as Link[]);
        }
    },
    {
        name: 'BaSIA',
        strategies: person => person.names.map(({ name, surname }) => ({
            name: `${name} ${surname}`,
            // name: `${name} ${surname} ${JSON.stringify({ type, lang })}`,
            generateLink() {
                return 'https://www.basia.famula.pl/';
            },
            generatePostRequest() {
                return { q: `${name} ${surname}` };
            }
        }))
    },
    {
        name: 'GenPod Projekt Podlasie (manualne)',
        generateLink() {
            return 'https://genpod.projektpodlasie.pl/';
        }
    },
    {
        name: 'Internetowe wyszukiwarki',
        strategies: () => [
            {
                name: 'ecmentarze',
                generateLink(_person, foundName) {
                    const url = new URL('https://www.ecmentarze.pl/wyszukaj-pochowanego?mode=search&town=&voivodeship=');

                    url.searchParams.set('name', foundName.name);
                    url.searchParams.set('surname', foundName.surname);

                    return url.toString();
                }
            },
            {
                name: 'webcmentarz',
                generateLink(_person, foundName) {
                    const url = new URL('https://webcmentarz.pl/index.php?szukaj=tak&do=szukaj&wybierzcmentarz=wszystkiecmentarze');

                    url.searchParams.set('imie', foundName.name);
                    url.searchParams.set('nazwisko', foundName.surname);

                    return url.toString();
                }
            },
            {
                name: 'ksiegazmarlych24',
                generateLink(_person, foundName) {
                    const url = new URL('https://ksiegazmarlych24.pl/search.php');

                    url.searchParams.set('search', `${foundName.name} ${foundName.surname}`);

                    return url.toString();
                }
            },
            {
                name: 'genealogiczne (nazwisko)',
                generateLink(_person, foundName) {
                    const url = new URL('http://www.genealogiczne.pl/wyszukiwarka-grobow/?cemetary=all');

                    url.searchParams.set('searchPhrase', `${foundName.surname}`);

                    return url.toString();
                }
            }
        ]
    }
];

const Component: FC<Props> = ({ person, rowSpan }) => {
    const [options, forms] = useMemo(() => LINKS_STRATEGIES.reduce<[options: JSX.Element[], forms: JSX.Element[]]>(
        ([renderedOptions, renderedForms], strat) => {
            const foundName = person.names.find(findByType('married')) ?? person.names.find(findByType('birth'));
            const renderUrls = (linkStrat: Link) => {
                const link = foundName && linkStrat.generateLink(person, foundName);
                if (!link) {
                    return null;
                }

                const post = linkStrat.generatePostRequest;

                if (post) {
                    const postData = post(person, foundName);
                    const ref = createRef<HTMLFormElement>();
                    renderedForms.push(
                        <form
                            method="POST"
                            action={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            // style={{ display: 'inline' }}
                            ref={ref}
                        >
                            {Object.keys(postData).map(key => (
                                <input
                                    key={key}
                                    name={key}
                                    type="hidden"
                                    value={postData[key]}
                                />
                            ))}
                        </form>
                    );
                    return (
                        <option onClick={() => ref.current?.submit()}>
                            {linkStrat.name}
                        </option>
                    );
                }

                return (
                    // eslint-disable-next-line react/jsx-handler-names
                    <option onClick={() => window.open(link, '_blank')}>
                        {linkStrat.name}
                    </option>
                );
            };

            if ('strategies' in strat) {
                renderedOptions.push(
                    <optgroup label={strat.name}>
                        {strat.strategies(person).map(renderUrls)
                            .filter(Boolean) as JSX.Element[]}
                    </optgroup>
                );
                return [renderedOptions, renderedForms];
            }

            return [
                [...renderedOptions, renderUrls(strat)].filter(Boolean) as JSX.Element[],
                renderedForms
            ];
        },
        [[], []]
    ), [person]);

    return (
        <td
            className="person-utils"
            rowSpan={rowSpan}
        >
            {forms}
            <select
                value="nothing"
                style={{ width: '100%' }}
            >
                <option
                    value="nothing"
                    disabled
                >
                    Otwórz link
                </option>
                {options}
            </select>
        </td>
    );
};
Component.displayName = 'PersonLinks';
export const LinksCell = Component;

interface Props {
    person: MappedPerson;
    rowSpan?: number;
}
