import type { FC } from 'react';
import { createRef, useMemo } from 'react';

import type { MappedPerson } from '../store/person/map';

import type { FoundName, Link } from './link-strategies';
import { LINKS_STRATEGIES } from './link-strategies';


const findByType = (type: string) => (
    name: MappedPerson['names'][number]
): name is FoundName => name.type === type && typeof name.surname === 'string';


const Component: FC<Props> = ({ person, rowSpan }) => {
    const [options, forms] = useMemo(() => LINKS_STRATEGIES.reduce<[options: JSX.Element[], forms: JSX.Element[]]>(
        ([renderedOptions, renderedForms], strat) => {
            const foundName = person.names.find(findByType('married')) ?? person.names.find(findByType('birth'));
            const renderUrls = (linkStrat: Link) => {
                const link = foundName && linkStrat.generateLink(person, foundName);
                if (!link) {
                    return null;
                }

                const post = linkStrat.generatePostRequest;

                if (post) {
                    const postData = post(person, foundName);
                    const ref = createRef<HTMLFormElement>();
                    renderedForms.push(
                        <form
                            key={`${strat.name}-${linkStrat.name}-form`}
                            method="POST"
                            action={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            // style={{ display: 'inline' }}
                            ref={ref}
                        >
                            {Object.keys(postData).map(key => (
                                <input
                                    key={`${strat.name}-${key}`}
                                    name={key}
                                    type="hidden"
                                    value={postData[key]}
                                />
                            ))}
                        </form>
                    );
                    return (
                        <option
                            key={`${strat.name}-${linkStrat.name}`}
                            onClick={() => ref.current?.submit()}
                        >
                            {linkStrat.name}
                        </option>
                    );
                }

                return (
                    <option
                        key={`${strat.name}-${linkStrat.name}`}
                        // eslint-disable-next-line react/jsx-handler-names
                        onClick={() => window.open(link, '_blank')}
                    >
                        {linkStrat.name}
                    </option>
                );
            };

            if ('strategies' in strat) {
                renderedOptions.push(
                    <optgroup
                        label={strat.name}
                        key={strat.name}
                    >
                        {strat.strategies(person).map(renderUrls)
                            .filter(Boolean) as JSX.Element[]}
                    </optgroup>
                );
                return [renderedOptions, renderedForms];
            }

            return [
                [...renderedOptions, renderUrls(strat)].filter(Boolean) as JSX.Element[],
                renderedForms
            ];
        },
        [[], []]
    ), [person]);

    return (
        <td
            className="person-utils"
            rowSpan={rowSpan}
        >
            {forms}
            <select
                value="nothing"
                style={{ width: '100%' }}
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                onChange={() => {}}
            >
                <option
                    value="nothing"
                    disabled
                >
                    Otwórz link
                </option>
                {options}
            </select>
        </td>
    );
};
Component.displayName = 'PersonLinks';
export const LinksCell = Component;

interface Props {
    person: MappedPerson;
    rowSpan?: number;
}
