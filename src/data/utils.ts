import dayjs from 'dayjs';

import { filterPersons, filterSources } from './filters';
import type { NestedData } from './read-file';


// const DATE_VALUE_REGEXP = '(((?<day>\\d{2}) )?(?<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC) )? (<year>\\d{3,})'
export function makeDate(data?: NestedData) {
    if (!data?.value) {
        return null;
    }
    const { value } = data;

    return value
        .replace('ABT', 'about')
        .replace('CAL', 'calculated')
        .replace('EST', 'estimated')
        .replace('FROM', 'from')
        .replace('TO', 'to')
        .replace('BET', 'inbetween')
        .replace('BEF', 'before')
        .replace('AFT', 'after');

    // const aboutDate = new RegExp(`^(?:(?<word>ABT|CAL|EST) )${DATE_VALUE_REGEXP}$`).exec(value)
    // if (aboutDate?.groups) {
    //     /* eslint-disable @typescript-eslint/naming-convention */
    //     const prefix = {
    //         ABT: 'about',
    //         CAL: 'calculated',
    //         EST: 'estimated'
    //     }[aboutDate.groups.word] ?? '';
    //     /* eslint-enable @typescript-eslint/naming-convention */
    //     return `${prefix} ${aboutDate.groups.day} ${aboutDate.groups.month} ${aboutDate.groups.year}`.replace(/ {2,}/g, ' ').trim();
    // }

    // const rangeDateFrom = new RegExp(`FROM ${DATE_VALUE_REGEXP}`).exec(value);
    // const rangeDateTo = new RegExp(`FROM ${DATE_VALUE_REGEXP}`).exec(value);
    // if (rangeDateFrom?.groups || rangeDateTo?.groups) {
    //     let ret = '';
    //     if (rangeDateFrom?.groups) {
    //         ret = `from ${rangeDateFrom.groups.day} ${rangeDateFrom.groups.month} ${rangeDateFrom.groups.year}`
    //     }
    //     if (rangeDateTo?.groups) {
    //         ret += ` to ${rangeDateTo.groups.day} ${rangeDateTo.groups.month} ${rangeDateTo.groups.year}`
    //     }
    //     return `${ret} (period)`.replace(/ {2,}/g, ' ').trim();
    // }
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const DATE_REGEXP = /^(?:ABT|(?<day>\d{2}) (?<month>[A-Z]{3}) )?(?<year>\d{4})$/i;
// eslint-disable-next-line @typescript-eslint/naming-convention
export const FULL_DATE_REGEXP = /^(?<day>\d{2}) (?<month>[A-Z]{3}) (?<year>\d{4})$/i;
function parseDate(date?: string | null) {
    const result = DATE_REGEXP.exec(date ?? '');
    if (!result?.groups) {
        return null;
    }
    const { day, month, year } = result.groups as Partial<Record<string, string>>;
    return dayjs(`${year}-${month ?? 1}-${day ?? 1}`).startOf('day');
}
export function printDateYMD(date: string) {
    const result = DATE_REGEXP.exec(date);
    if (!result?.groups) {
        return null;
    }
    const { day, month, year } = result.groups as Partial<Record<string, string>>;

    if (day && month) {
        return dayjs(`${year}-${month}-${day}`)
            .startOf('day')
            .format('YYYY-MM-DD');
    }
    return `${year}`;
}
export function getAge(birth?: string | null, death?: string | null) {
    const parsedBirth = parseDate(birth);
    const parsedDeath = parseDate(death);

    if (!parsedBirth) {
        return null;
    }

    return (parsedDeath ?? dayjs()).diff(parsedBirth, 'years');
}

export const getTag = (parent: NestedData, tag: string, ...nestedTags: string[]) => [
    tag,
    ...nestedTags
].reduce<NestedData | undefined>((acc, thisTag) => acc?.children.find(child => child.type === thisTag), parent);
export const getTags = (parent: NestedData, tag: string, ...nestedTags: string[]) => [
    tag,
    ...nestedTags
].reduce<NestedData[]>((acc, thisTag) => acc.flatMap(a => a.children).filter(child => child.type === thisTag), [parent]);
export const getPerson = (allData: NestedData[], id: string) => allData.filter(filterPersons).find(datum => datum.data.xref_id === id);
export const getSource = (allData: NestedData[], id: string) => allData.filter(filterSources).find(datum => datum.data.xref_id === id);
