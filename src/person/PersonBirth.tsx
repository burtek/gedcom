import classNames from 'classnames';
import { memo } from 'react';

import { PlaceWithTooltip } from '../components/PlaceWithTooltip';
import { SourcesIndicator } from '../components/SourcesIndicator';
import type { MappedPerson } from '../store/data/person';
import { FULL_DATE_REGEXP } from '../store/utils';


function Component({ birth, rowSpan }: Pick<MappedPerson['dates'], 'birth'> & { rowSpan?: number }) {
    const dateClassName = classNames({
        error: !birth?.date,
        warn: birth?.date && !FULL_DATE_REGEXP.test(birth.date)
    });
    const placeClassName = classNames({
        error: !birth?.place,
        warn: !birth?.place?.ref
    });
    const className = classNames({ notice: dateClassName || placeClassName });

    return (
        <td
            className={className}
            rowSpan={rowSpan}
        >
            {birth?.check ? <div className="check">CHECK!!!</div> : null}
            <span className={dateClassName}>{birth?.date ?? <i>date?</i>}</span>
            <br />
            <span className={placeClassName}>
                {birth?.place?.name
                    ? <PlaceWithTooltip place={birth.place.name} />
                    : <i>place?</i>}
            </span>
            <SourcesIndicator sources={birth?.sources} />
        </td>
    );
}
Component.displayName = 'BirthCell';
export const BirthCell = memo(Component);
