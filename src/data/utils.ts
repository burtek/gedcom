import dayjs from 'dayjs';

import type { DateTime, StringValueOnly } from './data-types';

// eslint-disable-next-line @typescript-eslint/naming-convention
export function makeDate(DATE?: StringValueOnly | DateTime) {
    if (!DATE?.value) {
        return null;
    }
    if (!('TIME' in DATE) || !DATE.TIME.value) {
        return DATE.value;
    }

    return `${DATE.value} ${DATE.TIME.value}`;
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
export function getAge(birth?: string | null, death?: string | null) {
    const parsedBirth = parseDate(birth);
    const parsedDeath = parseDate(death);

    if (!parsedBirth) {
        return null;
    }

    return (parsedDeath ?? dayjs()).diff(parsedBirth, 'years');
}
