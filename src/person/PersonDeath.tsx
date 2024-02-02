import classNames from 'classnames';
import { memo } from 'react';

import { PlaceWithTooltip } from '../components/PlaceWithTooltip';
import { SourcesIndicator } from '../components/SourcesIndicator';
import type { MappedPerson } from '../store/data/person';
import { FULL_DATE_REGEXP, getAge } from '../store/utils';


function Component({ birth, death, burial, rowSpan }: Props) {
    const age = getAge(birth?.date, death?.date);
    const ageAbove100 = age !== null && age >= 100;

    if (!death) {
        return (
            <td
                className={classNames({ error: Boolean(burial), warn: ageAbove100 })}
                rowSpan={rowSpan}
            >
                <i>{burial ? 'no death info!' : null}</i>
                <SourcesIndicator sources={undefined} />
            </td>
        );
    }

    const dateClassName = classNames({
        error: !death.date,
        warn: ageAbove100 || (death.date && !FULL_DATE_REGEXP.test(death.date))
    });
    const placeClassName = classNames({
        error: !death.place,
        warn: !death.place?.ref
    });
    const className = classNames({ notice: dateClassName || placeClassName });

    return (
        <td
            className={className}
            rowSpan={rowSpan}
        >
            {death.check ? <div className="check">CHECK!!!</div> : null}
            <span className={dateClassName}>{death.date ?? <i>date?</i>}</span>
            {death.cause ? <><br />{death.cause}<br /></> : <br />}
            <span className={placeClassName}>
                {death.place?.name
                    ? <PlaceWithTooltip place={death.place.name} />
                    : <i>place?</i>}
            </span>
            <SourcesIndicator sources={death.sources} />
        </td>
    );
}
Component.displayName = 'DeathCell';
export const DeathCell = memo(Component);

type Props = MappedPerson['dates'] & { rowSpan?: number };
