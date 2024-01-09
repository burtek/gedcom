import type { NestedData } from '../data/read-file';
import { getAge, getTag, getTags, makeDate } from '../data/utils';


export function mapPerson(person: NestedData) {
    const makeBaseDatesObject = (event: NestedData) => ({
        sources: getTags(event, 'SOUR').map(source => {
            const page = getTag(source, 'PAGE')?.value;
            return {
                source: source.data.pointer,
                link: page?.startsWith('http') ? page : undefined,
                page: page?.startsWith('http') ? undefined : page
            };
        }),
        date: makeDate(getTag(event, 'DATE')),
        place: getTag(event, 'PLAC')?.value,
        check: getTag(event, 'TYPE')?.value === 'CHECK'
    });
    const makeDatesObject = (event: NestedData | undefined): null | ReturnType<typeof makeBaseDatesObject> => {
        if (!event) {
            return null;
        }

        return makeBaseDatesObject(event);
    };
    const death = makeDatesObject(getTag(person, 'DEAT'));
    const dates = {
        birth: makeDatesObject(getTag(person, 'BIRT')),
        burial: makeDatesObject(getTag(person, 'BURI')),
        death: death && {
            ...death,
            cause: getTag(person, 'DEAT', 'CAUS')?.value
        }
    };

    return {
        id: person.data.xref_id as string,
        uid: getTag(person, '_UID')?.value as string,
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
            parentFamily: getTag(person, 'FAMC')?.value,
            hasOwnFamily: Boolean(getTag(person, 'FAMS')?.value),
            ownFamily: getTag(person, 'FAMS')?.value
        },
        age: getAge(dates.birth?.date, dates.death?.date),
        dates,
        occupation: getTags(person, 'OCCU')
            .map(o => o.value)
            .filter<string>(Boolean as BooleanPredicate)
    };
}
export type MappedPerson = ReturnType<typeof mapPerson>;
