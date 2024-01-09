import classNames from 'classnames';
import { memo } from 'react';

import { FULL_DATE_REGEXP, getAge } from '../store/data/utils';
import type { MappedPerson } from '../store/person/map';

import { SourcesIndicator } from './SourcesIndicator';


function Component({ birth, death, burial, rowSpan }: Props) {
    const age = getAge(birth?.date, death?.date);
    const ageAbove100 = age !== null && age >= 100;

    if (!burial) {
        return (
            <td
                className={classNames({ error: Boolean(death), warn: ageAbove100 })}
                rowSpan={rowSpan}
            >
                <i>{death ? 'no burial info!' : null}</i>
                <SourcesIndicator sources={undefined} />
            </td>
        );
    }

    const className = classNames({
        warn: ageAbove100,
        notice: !burial.date || !FULL_DATE_REGEXP.test(burial.date) || !burial.place
    });

    return (
        <td
            className={className}
            rowSpan={rowSpan}
        >
            {burial.check ? <div className="check">CHECK!!!</div> : null}
            {burial.date ?? <i>date?</i>}
            <br />
            {burial.place ?? <i>place?</i>}
            <SourcesIndicator sources={burial.sources} />
        </td>
    );
}
Component.displayName = 'BurialCell';
export const BurialCell = memo(Component);

type Props = MappedPerson['dates'] & { rowSpan?: number };
