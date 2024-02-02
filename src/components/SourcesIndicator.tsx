
import classNames from 'classnames';
import Tooltip from 'rc-tooltip';
import type { ReactNode } from 'react';
import { memo, useMemo } from 'react';

import { useAppSelector } from '../store';
import { getSource } from '../store/data/source';


const SingleSource = ({ sourceProps }: { sourceProps: Source }) => {
    const source = useAppSelector(state => (sourceProps.source ? getSource(state, sourceProps.source) : null));

    return (
        <a
            href={sourceProps.link}
            target="_blank"
            rel="noreferrer noopener"
        >
            {source?.shortName}
            {sourceProps.page ? `, page: ${sourceProps.page}` : ''}
        </a>
    );
};
SingleSource.displayName = 'SingleSource';

const Component = ({ sources }: { sources?: Source[] }) => {
    const [hasSources, tooltip] = useMemo<[boolean, ReactNode]>(() => {
        if (!sources || sources.length === 0) {
            return [false, <p key="error">BRAK ŹRÓDŁA</p>];
        }

        const mapped = sources.map((source, index, { length }) => (
            <p key={source.link ?? source.page}>
                <SingleSource sourceProps={source} />
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

type Source = Partial<{
    page: string;
    link: string;
    source: string;
}>;
