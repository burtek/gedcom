import dayjs from 'dayjs';

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
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const DATE_REGEXP = /^(?:[a-z]+ )?((?<day>\d{2}) )?((?<month>[A-Z]{3}) )?(?<year>\d{4})$/i;
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
