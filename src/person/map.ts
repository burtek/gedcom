import type { NestedData } from '../data/read-file';
import { getAge, getSource, getTag, getTags, makeDate } from '../data/utils';


export function mapPerson(person: NestedData, allData: NestedData[]) {
    const makeMainObject = (event: NestedData) => ({
        links: getTags(event, 'SOUR').map(source => {
            const sourceObj = source.data.pointer ? getSource(allData, source.data.pointer) : undefined;
            const page = getTag(source, 'PAGE')?.value;
            return {
                name: sourceObj ? getTag(sourceObj, 'ABBR')?.value : '???',
                link: page?.startsWith('http') ? page : undefined,
                page: page?.startsWith('http') ? undefined : page
            };
        }),
        date: makeDate(getTag(event, 'DATE')),
        place: getTag(event, 'PLAC')?.value,
        check: getTag(event, 'TYPE')?.value === 'CHECK'
    });
    const makeDatesObject: {
        <T extends string>(
            event: NestedData | undefined,
            more: Record<T, string>
        ): null | (Record<T, string | undefined> & ReturnType<typeof makeMainObject>);
        (
            event: NestedData | undefined
        ): null | ReturnType<typeof makeMainObject>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- TODO: fixme
    } = (event: NestedData | undefined, more?: Record<string, string>): any => {
        if (!event) {
            return null;
        }

        if (more) {
            return {
                ...makeMainObject(event),
                ...Object.keys(more).reduce<Record<string, string | undefined>>(
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    (acc, key) => ({ ...acc, [key]: getTag(event, more[key]!)?.value }),
                    more
                )
            };
        }

        return makeMainObject(event);
    };
    const dates = {
        birth: makeDatesObject(getTag(person, 'BIRT')),
        burial: makeDatesObject(getTag(person, 'BURI')),
        death: makeDatesObject(getTag(person, 'DEAT'), { cause: 'CAUS' })
    };

    return {
        xref: person.data.xref_id as string,
        id: getTag(person, '_UID')?.value as string,
        lastModified: makeDate(getTag(person, 'CHAN', 'DATE')),
        sex: getTag(person, 'SEX')?.value ?? 'U',
        names: getTags(person, 'NAME').map(name => ({
            name: getTag(name, 'GIVN')?.value,
            surname: getTag(name, 'SURN')?.value,
            type: getTag(name, 'TYPE')?.value,
            lang: getTag(name, 'LANG')?.value
        })),
        references: {
            hasParentFamily: Boolean(getTag(person, 'FAMC')?.value),
            hasOwnFamily: Boolean(getTag(person, 'FAMS')?.value)
        },
        age: getAge(dates.birth?.date, dates.death?.date),
        dates,
        occupation: getTags(person, 'OCCU')
            .map(o => o.value)
            .filter<string>(Boolean as BooleanPredicate)
    };
}
export type MappedPerson = ReturnType<typeof mapPerson>;
