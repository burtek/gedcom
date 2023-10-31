import { Fragment, memo, useMemo } from 'react';

import { useContextData } from '../data/data-context';
import { filterPersons } from '../data/filters';
import type { MappedPerson } from '../person/map';
import { mapPerson } from '../person/map';


function getPersonName({ names }: PersonWithGrave) {
    const findPolish = (name: typeof names[number]) => name.lang === 'Polish';
    const marriedNames = names.filter(name => name.type === 'married');
    const birthNames = names.filter(name => name.type === 'birth');

    const marriedName = marriedNames.findLast(findPolish) ?? marriedNames.at(-1);
    const birthName = birthNames.find(findPolish) ?? birthNames[0];

    if (marriedName) {
        return {
            name: marriedName.name ?? '???',
            surname: (birthName ? `${marriedName.surname} z d. ${birthName.surname}` : marriedName.surname) ?? '???'
        };
    }
    const result = birthName ?? birthNames[0];
    return {
        name: result?.name ?? '???',
        surname: result?.surname ?? '???'
    };
}
interface GroupedPerson {
    xref: string;
    name: {
        name: string;
        surname: string;
    };
    groups: {
        cementary: string;
        grave: string;
    };
    burial: PersonWithGrave['dates']['burial'];
}
function groupByGraves(
    acc: Record<string, Record<string, GroupedPerson[]>>,
    { person, cementary, grave }: { person: PersonWithGrave; cementary: string; grave: string }
) {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    acc[cementary] ??= {};
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, @typescript-eslint/no-non-null-assertion
    acc[cementary]![grave] ??= [];

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    acc[cementary]![grave]?.push({ xref: person.xref, groups: { cementary, grave }, name: getPersonName(person), burial: person.dates.burial });
    return acc;
}

const LOCATION_SPLIT = ' / ';
const Component = ({ show }: { show: boolean }) => {
    const data = useContextData();
    const cementaries = useMemo(
        () => {
            const dictionary = data?.filter(filterPersons)
                .map(person => mapPerson(person, data))
                .filter((person): person is PersonWithGrave => Boolean(person.dates.burial?.place))
                .map(person => {
                    const [cementary, ...location] = person.dates.burial.place.split(LOCATION_SPLIT) as [string, ...string[]];
                    return { person, cementary, grave: location.join(LOCATION_SPLIT) };
                })
                .reduce<Record<string, Record<string, GroupedPerson[]>>>(groupByGraves, {}) ?? {};

            return Object.entries(dictionary)
                .sort(([key1], [key2]) => key1.localeCompare(key2))
                .map(([cementary, graves]) => ({
                    cementary,
                    graves: Object.entries(graves)
                        .sort(([key1], [key2]) => key1.localeCompare(key2, 'pl', { numeric: true }))
                        .map(([grave, burried]) => ({
                            grave,
                            burried: [...burried].sort(
                                // eslint-disable-next-line max-len
                                ({ name: name1 }, { name: name2 }) => name1.surname.localeCompare(name2.surname) || name1.name.localeCompare(name2.name)
                            )
                        }))
                }));
        },
        [data]
    );

    if (!data || !show) {
        return null;
    }

    return (
        <div>
            {cementaries.map(({ cementary, graves }) => (
                <div key={cementary}>
                    <h2>{cementary}</h2>
                    {graves.map(({ grave, burried }) => (
                        <Fragment key={grave}>
                            <h4>{grave}</h4>
                            <ul>
                                {burried.map(({ xref, name, burial: { links } }) => (
                                    <li key={xref}>
                                        {`${name.name} ${name.surname}`}
                                        {links
                                            .filter(link => link.link)
                                            .map(link => (
                                                <a
                                                    key={link.link}
                                                    href={link.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    {link.name}
                                                </a>
                                            ))
                                            .flatMap(link => [', ', link])}
                                    </li>
                                ))}
                            </ul>
                        </Fragment>
                    ))}
                </div>
            ))}
        </div>
    );
};
Component.displayName = 'Graves';

interface PersonWithGrave extends MappedPerson {
    dates: MappedPerson['dates'] & {
        burial: NonNullable<MappedPerson['dates']['death']> & {
            place: NonNullable<NonNullable<MappedPerson['dates']['death']>['place']>;
        };
    };
}

export const Graves = memo(Component);
