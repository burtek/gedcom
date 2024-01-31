import Tooltip from 'rc-tooltip';
import { Fragment } from 'react';


export const PlaceWithTooltip = ({ place = '', restSingleLine = false, separator = ',' }) => {
    let parts = place.split(separator);
    if (parts.length <= 1) {
        return place;
    }
    if (restSingleLine) {
        const part = parts.shift() as string;
        parts = [part, parts.join(separator)];
    }

    return (
        <Tooltip
            destroyTooltipOnHide
            overlay={parts.flatMap(part => <Fragment key={part}>{part}<br /></Fragment>)}
            placement="right"
            overlayStyle={{ zIndex: 2 }}
        >
            <span style={{ textDecoration: 'underline', textDecorationStyle: 'dotted' }}>
                {parts[0]}
            </span>
        </Tooltip>
    );
};
PlaceWithTooltip.displayName = 'PlaceWithTooltip';
