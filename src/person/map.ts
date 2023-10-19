import type { PersonKey, Person as RawPerson, RootData } from '../data/data-types';
import { getAge, makeDate } from '../data/utils';


export function mapPerson(apid: PersonKey, raw: RawPerson, data: RootData) {
    const dates = {
        birth: raw.BIRT
            ? {
                date: makeDate(raw.BIRT.DATE),
                place: raw.BIRT.PLAC?.value,
                check: raw.BIRT.TYPE?.value === 'CHECK'
            }
            : null,
        burial: raw.BURI
            ? {
                links: raw.BURI.SOUR?.map(source => ({
                    name: data[source.value].ABBR.value,
                    link: source.PAGE.value
                })) ?? null,
                date: makeDate(raw.BURI.DATE),
                place: raw.BURI.PLAC?.value,
                check: raw.BURI.TYPE?.value === 'CHECK'
            }
            : null,
        death: raw.DEAT
            ? {
                cause: raw.DEAT.CAUS?.value,
                date: makeDate(raw.DEAT.DATE),
                place: raw.DEAT.PLAC?.value,
                check: raw.DEAT.TYPE?.value === 'CHECK'
            }
            : null
    };

    return {
        apid,
        id: raw._UID.value,
        lastModified: makeDate(raw.CHAN?.DATE),
        sex: raw.SEX.value,
        names: raw.NAME.map(
            name => ({
                name: name.GIVN.value,
                surname: name.SURN?.value,
                type: name.TYPE?.value
            })
        ),
        references: {
            hasParentFamily: raw.FAMC?.value,
            hasOwnFamily: raw.FAMS?.value
        },
        age: getAge(dates.birth?.date, dates.death?.date),
        dates,
        occupation: raw.OCCU?.value
    };
}
export type MappedPerson = ReturnType<typeof mapPerson>;
