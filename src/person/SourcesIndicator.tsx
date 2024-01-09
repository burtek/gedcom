
import classNames from 'classnames';
import Tooltip from 'rc-tooltip';
import type { ReactNode } from 'react';
import { memo, useMemo } from 'react';


const Component = ({ sources }: Props) => {
    const [hasSources, tooltip] = useMemo<[boolean, ReactNode]>(() => {
        if (!sources || sources.length === 0) {
            return [false, <p key="error">BRAK ŹRÓDŁA</p>];
        }

        const mapped = sources.map(({ page, link, name }, index, { length }) => (
            <p key={link}>
                <a
                    href={link}
                    target="_blank"
                    rel="noreferrer noopener"
                >
                    {name}
                    {page ? `, page: ${page}` : ''}
                </a>
                {index + 1 < length ? ', ' : ''}
            </p>
        ));

        return [true, mapped];
    }, [sources]);

    const className = classNames(
        'source-indicator-icon',
        hasSources ? 'notice' : 'error'
    );

    return (
        <Tooltip
            destroyTooltipOnHide
            overlay={tooltip}
            placement="left"
            overlayStyle={{ zIndex: 2 }}
        >
            <div className={className}>
                {hasSources ? '?' : '!'}
            </div>
        </Tooltip>
    );
};
Component.displayName = 'SourcesIndicator';

export const SourcesIndicator = memo(Component);

interface Props {
    sources?: Source[];
}

type Source = Partial<{
    name: string;
    page: string;
    link: string;
}>;
