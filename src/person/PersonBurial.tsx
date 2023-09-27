import classNames from 'classnames';
import { Fragment, memo } from 'react';

import { FULL_DATE_REGEXP, getAge } from '../data/utils';

import type { SearchName } from './grobonet';
import { renderLink } from './grobonet';
import type { MappedPerson } from './map';


function Component({ birth, death, burial, searchName }: Props) {
    const age = getAge(birth?.date, death?.date);
    const ageAbove100 = age !== null && age >= 100;

    if (!burial) {
        return (
            <td className={classNames({ error: Boolean(death), warn: ageAbove100 })}>
                {renderLink(<i>no burial?</i>, searchName)}
            </td>
        );
    }

    const className = classNames({
        warn: ageAbove100 || !burial.links || burial.links.length === 0,
        notice: !burial.date || !FULL_DATE_REGEXP.test(burial.date) || !burial.place
    });

    return (
        <td className={className}>
            {burial.date ?? renderLink(<i>date?</i>, searchName)}
            <br />
            {burial.place ?? renderLink(<i>place?</i>, searchName)}
            <br />
            {burial.links?.map(({ link, name }, index, { length }) => (
                <Fragment key={link}>
                    <a
                        href={link}
                        target="_blank"
                        rel="noreferrer noopener"
                    >
                        {name}
                    </a>
                    {index + 1 < length ? ', ' : ''}
                </Fragment>
            )) ?? renderLink(<i>links?</i>, searchName)}
        </td>
    );
}
Component.displayName = 'BurialCell';
export const BurialCell = memo(Component);

type Props = MappedPerson['dates'] & { searchName?: SearchName };
