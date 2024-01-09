import classNames from 'classnames';
import { memo } from 'react';

import { FULL_DATE_REGEXP } from '../store/data/utils';
import type { MappedPerson } from '../store/person/map';

import { SourcesIndicator } from './SourcesIndicator';


function Component({ birth, rowSpan }: Pick<MappedPerson['dates'], 'birth'> & { rowSpan?: number }) {
    const className = classNames({
        error: !birth?.date,
        notice: !birth?.place || !FULL_DATE_REGEXP.test(birth.date ?? '')
    });


    return (
        <td
            className={className}
            rowSpan={rowSpan}
        >
            {birth?.check ? <div className="check">CHECK!!!</div> : null}
            {birth?.date ?? <i>date?</i>}
            <br />
            {birth?.place ?? <i>place?</i>}
            <SourcesIndicator sources={birth?.sources} />
        </td>
    );
}
Component.displayName = 'BirthCell';
export const BirthCell = memo(Component);
