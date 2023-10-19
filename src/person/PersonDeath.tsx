import classNames from 'classnames';
import { memo } from 'react';

import { FULL_DATE_REGEXP, getAge } from '../data/utils';

import type { MappedPerson } from './map';


function Component({ birth, death, burial }: Props) {
    const age = getAge(birth?.date, death?.date);
    const ageAbove100 = age !== null && age >= 100;

    if (!death) {
        return (
            <td className={classNames({ error: Boolean(burial), warn: ageAbove100 })}>
                <i>{burial ? 'no death info!' : null}</i>
            </td>
        );
    }

    const className = classNames({
        error: !death.date,
        warn: ageAbove100 || !FULL_DATE_REGEXP.test(death.date ?? ''),
        notice: !death.cause || !death.place
    });

    return (
        <td className={className}>
            {death.check ? <div className="check">CHECK!!!</div> : null}
            {death.date ?? <i>date?</i>}
            <br />
            {death.cause ?? <i>cause?</i>}
            <br />
            {death.place ?? <i>place?</i>}
        </td>
    );
}
Component.displayName = 'DeathCell';
export const DeathCell = memo(Component);

type Props = MappedPerson['dates'];
