import classNames from 'classnames';
import { memo } from 'react';

import { PlaceWithTooltip } from '../components/PlaceWithTooltip';
import { SourcesIndicator } from '../components/SourcesIndicator';
import type { MappedPerson } from '../store/data/person';
import { getAge } from '../store/utils';


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

    const dateClassName = classNames({ warn: !burial.date });
    const placeClassName = classNames({ warn: !burial.place });
    const className = classNames({ notice: dateClassName || placeClassName });

    return (
        <td
            className={className}
            rowSpan={rowSpan}
        >
            {burial.check ? <div className="check">CHECK!!!</div> : null}
            <span className={dateClassName}>{burial.date ?? <i>date?</i>}</span>
            <br />
            <span className={placeClassName}>
                {burial.place?.name
                    ? (
                        <PlaceWithTooltip
                            place={burial.place.name}
                            restSingleLine
                            separator=" / "
                        />
                    )
                    : <i>place?</i>}
            </span>
            <SourcesIndicator sources={burial.sources} />
        </td>
    );
}
Component.displayName = 'BurialCell';
export const BurialCell = memo(Component);

type Props = MappedPerson['dates'] & { rowSpan?: number };
