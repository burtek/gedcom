import classNames from 'classnames';
import { Fragment, memo } from 'react';

import { FULL_DATE_REGEXP, getAge } from '../data/utils';

import type { MappedPerson } from './map';


function Component({ birth, death, burial }: Props) {
    const age = getAge(birth?.date, death?.date);
    const ageAbove100 = age !== null && age >= 100;

    if (!burial) {
        return (
            <td className={classNames({ error: Boolean(death), warn: ageAbove100 })}>
                <i>no burial?</i>
            </td>
        );
    }

    const className = classNames({
        warn: ageAbove100 || !burial.links || burial.links.length === 0,
        notice: !burial.date || !FULL_DATE_REGEXP.test(burial.date) || !burial.place
    });

    return (
        <td className={className}>
            {burial.check ? <div style={{ color: 'red', fontWeight: 'bold' }}>CHECK!!!</div> : null}
            {burial.date ?? <i>date?</i>}
            <br />
            {burial.place ?? <i>place?</i>}
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
            )) ?? <i>links?</i>}
        </td>
    );
}
Component.displayName = 'BurialCell';
export const BurialCell = memo(Component);

type Props = MappedPerson['dates'];
