import classNames from 'classnames';
import { Fragment, memo } from 'react';

import { FULL_DATE_REGEXP } from '../data/utils';

import type { MappedPerson } from './map';


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
            <br />
            {birth?.links.map(({ page, link, name }, index, { length }) => (
                <Fragment key={link}>
                    <a
                        href={link}
                        target="_blank"
                        rel="noreferrer noopener"
                    >
                        {name}
                        {page ? `, page: ${page}` : ''}
                    </a>
                    {index + 1 < length ? ', ' : ''}
                </Fragment>
            ))}
        </td>
    );
}
Component.displayName = 'BirthCell';
export const BirthCell = memo(Component);
