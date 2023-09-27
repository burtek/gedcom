import classNames from 'classnames';
import { memo } from 'react';

import { FULL_DATE_REGEXP } from '../data/utils';

import type { MappedPerson } from './map';


function Component({ birth }: Pick<MappedPerson['dates'], 'birth'>) {
    const className = classNames({
        error: !birth?.date,
        notice: !birth?.place || !FULL_DATE_REGEXP.test(birth.date ?? '')
    });

    return (
        <td className={className}>
            {birth?.check ? <div className="check">CHECK!!!</div> : null}
            {birth?.date ?? <i>date?</i>}
            <br />
            {birth?.place ?? <i>place?</i>}
        </td>
    );
}
Component.displayName = 'BirthCell';
export const BirthCell = memo(Component);
