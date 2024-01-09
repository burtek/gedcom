import { printDateYMD } from '../../store/data/utils';
import type { MappedPerson } from '../../store/person/map';

import { makeOptions } from './make-options';


export interface FoundName {
    name: string; surname: string; type: string; lang: string;
}
export interface Link {
    name: string;
    generateLink: (person: MappedPerson, foundName: FoundName) => string | undefined;
    generatePostRequest?: (person: MappedPerson, foundName: FoundName) => Record<string, string>;
}
export interface LinksGroup {
    name: string;
    strategies: (person: MappedPerson) => Link[];
}

function uniqBy<R>(array: R[], getter: (r: R) => unknown = r => r) {
    const known: unknown[] = [];

    return array.filter(item => {
        const key = getter(item);
        if (known.includes(key)) {
            return false;
        }
        known.push(key);
        return true;
    });
}

export const LINKS_STRATEGIES: Array<Link | LinksGroup> = [
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
        name: 'Google z datami',
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
                name: 'grobonet bez nazwiska',
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
                name: 'imię i nazwisko',
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
                name: 'imię',
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
        strategies(person) {
            const surnames = [...new Set([...person.names.flatMap(name => name.surname ?? [])])];
            const fromDate = person.dates.birth?.date?.match(/\d{3,}/)?.[0];
            const toDate = person.dates.death?.date?.match(/\d{3,}/)?.[0];

            const fromDates = fromDate ? [null, fromDate] : [null];
            const toDates = toDate ? [null, toDate] : [null];

            const options = makeOptions(surnames, fromDates, toDates);

            return options.map(([surname, birthDate, deathDate]) => ({
                name: [surname, birthDate && `from ${birthDate}`, deathDate && `to ${deathDate}`].filter(Boolean).join(' '),
                // name: `${name} ${surname} ${JSON.stringify({ type, lang })}`,
                generateLink() {
                    const url = new URL('https://geneteka.genealodzy.pl/index.php?rpp1=&bdm=&w=&op=se&lang=pol&exac=1');
                    url.searchParams.set('from_date', birthDate ?? '');
                    url.searchParams.set('to_date', deathDate ?? '');
                    url.searchParams.set('search_lastname', surname);
                    url.searchParams.set('search_lastname2', '');
                    return url.toString();
                }
            }));
        }
    },
    {
        name: 'BaSIA',
        strategies: person => uniqBy(person.names.map(({ name, surname }) => `${name ?? ''} ${surname ?? ''}`.trim())).map(name => ({
            name,
            // name: `${name} ${surname} ${JSON.stringify({ type, lang })}`,
            generateLink() {
                return 'https://www.basia.famula.pl/';
            },
            generatePostRequest() {
                return { q: name };
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
        name: 'Genealogia w archiwach',
        strategies: person => uniqBy(person.names.map(({ name, surname }) => `${name ?? ''} ${surname ?? ''}`.trim())).map(name => ({
            name,
            generateLink() {
                const url = new URL('https://www.genealogiawarchiwach.pl/#personTree=false&goComments=false&searcher=big');

                const query = new URLSearchParams({
                    'query.query': name,
                    'query.type': 'PERSON',
                    'query.suggestion': 'false',
                    'query.thumbnails': 'false',
                    'query.facet': 'true',
                    'query.asc': 'false',
                    'query.sortMode': 'YEAR',
                    personTree: 'false',
                    goComments: 'false',
                    searcher: 'big'
                });

                url.hash = `#${query.toString()}`;

                return url.toString();
            }
        }))
    },
    {
        name: 'e-kartoteka ludności',
        strategies: person => uniqBy(
            person.names.flatMap(name => [name.surname, `${name.surname}, ${name.name}`]).filter(Boolean) as string[]
        ).map(name => ({
            name,
            generateLink() {
                return 'https://e-kartoteka.net/pl/search';
            },
            generatePostRequest() {
                return { lastname: name };
            }
        }))
    },
    {
        name: 'LubGens',
        strategies(person) {
            const fromDate = person.dates.birth?.date?.match(/\d{3,}/)?.[0];
            const toDate = person.dates.death?.date?.match(/\d{3,}/)?.[0];

            const fromDates = fromDate ? [null, fromDate] : [null];
            const toDates = toDate ? [null, toDate] : [null];

            const options = makeOptions(person.names, fromDates, toDates);

            return options.map(([{ name, surname }, birthDate, deathDate]) => ({
                name: [name, surname, birthDate && `from ${birthDate}`, deathDate && `to ${deathDate}`].filter(Boolean).join(' '),
                // name: `${name} ${surname} ${JSON.stringify({ type, lang })}`,
                generateLink() {
                    return 'https://regestry.lubgens.eu/viewpage.php?page_id=1057';
                },
                generatePostRequest() {
                    return {
                        urodz: '1',
                        sluby: '1',
                        zgony: '1',
                        parafia: '',
                        nazwisko: surname ?? '',
                        wildmode: '1',
                        imie: name ?? '',
                        // eslint-disable-next-line @typescript-eslint/naming-convention
                        rok_od: birthDate ?? '',
                        // eslint-disable-next-line @typescript-eslint/naming-convention
                        rok_do: deathDate ?? '',
                        sort1: '3',
                        sort2: '5',
                        sort3: '1'
                    };
                }
            }));
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

                    url.searchParams.set('searchPhrase', foundName.surname);

                    return url.toString();
                }
            }
        ]
    },
    {
        name: 'PomGenBaza (pomorskie)',
        strategies() {
            return [
                {
                    name: 'Szukaj chrztu',
                    generateLink() {
                        return 'http://www.ptg.gda.pl/index.php/certificate/action/searchB/';
                    },
                    generatePostRequest(person) {
                        // TODO: use family info
                        const birth = person.dates.birth?.date?.match(/\d{4}/)?.[0];
                        const [from, to] = birth ? [Number(birth) - 1, Number(birth) + 1] : [1700, 2000];

                        return {
                            action: 'listB',
                            'search[_fromyear]': from,
                            'search[_toyear]': to,
                            'search[parish]': 0,
                            'search[_name_ch]': (person.names.find(name => name.type === 'birth') ?? person.names[0])?.name ?? '',
                            'search[_name_m]': '',
                            'search[_surname_m]': (person.names.find(name => name.type === 'birth') ?? person.names[0])?.surname ?? '',
                            'search[_name_w]': '',
                            'search[_surname_w]': '',
                            'search[_method]': 1
                        };
                    }
                }
            ];
        }
    }
];
