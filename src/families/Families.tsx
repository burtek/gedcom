import { memo } from 'react';

import { useAppSelector } from '../store';
import { getFamilies } from '../store/family/slice';

import { Family } from './Family';


const Component = ({ show = false }) => {
    const families = useAppSelector(getFamilies);

    return (
        <table style={{ display: show ? undefined : 'none' }}>
            <thead>
                <tr>
                    <th />
                    <th colSpan={3}>has</th>
                    <th colSpan={4}>married</th>
                </tr>
                <tr>
                    <th>appID</th>
                    <th>wife</th>
                    <th>husband</th>
                    <th>children</th>
                    <th>date</th>
                    <th>place</th>
                    <th>status</th>
                </tr>
            </thead>
            <tbody>
                {families.map(family => (
                    <Family
                        family={family}
                        key={family.id}
                    />
                ))}
            </tbody>
        </table>
    );
};
Component.displayName = 'Families';

export const Families = memo(Component);
