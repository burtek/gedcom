import type { NestedData } from '../../types/nested-data';
import { createAppSlice } from '../create-app-slice';
import { getAge, getTag, getTags, makeDate } from '../utils';


export function mapPerson(person: NestedData) {
    const makeBaseDatesObject = (event: NestedData) => {
        const place = getTag(event, 'PLAC');
        return {
            sources: getTags(event, 'SOUR').map(source => {
                const page = getTag(source, 'PAGE')?.value;
                return {
                    source: source.data.pointer,
                    link: page?.startsWith('http') ? page : undefined,
                    page: page?.startsWith('http') ? undefined : page
                };
            }),
            date: makeDate(getTag(event, 'DATE')),
            place: place
                ? {
                    name: place.value,
                    ref: !!getTag(place, '_LOC')
                }
                : null,
            check: getTag(event, 'TYPE')?.value === 'CHECK'
        };
    };
    const makeDatesObject = (event: NestedData | undefined): null | ReturnType<typeof makeBaseDatesObject> => {
        if (!event) {
            return null;
        }

        return makeBaseDatesObject(event);
    };
    const death = getTag(person, 'DEAT');
    const dates = {
        birth: makeDatesObject(getTag(person, 'BIRT')),
        burial: makeDatesObject(getTag(person, 'BURI')),
        death: death
            ? {
                ...makeDatesObject(death),
                cause: getTag(death, 'CAUS')?.value
            }
            : null
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
            parentFamily: getTag(person, 'FAMC')?.data.pointer,
            ownFamily: getTag(person, 'FAMS')?.data.pointer
        },
        age: getAge(dates.birth?.date, dates.death?.date),
        dates,
        occupation: getTags(person, 'OCCU')
            .map(o => o.value)
            .filter<string>(Boolean as BooleanPredicate)
    };
}
export type MappedPerson = ReturnType<typeof mapPerson>;

const { adapter, actions, name, reducer, getState } = createAppSlice('persons', 'INDI', mapPerson);

export { actions, name, reducer };

export const getPersons = adapter.getSelectors(getState).selectAll;
export const getPerson = adapter.getSelectors(getState).selectById;
