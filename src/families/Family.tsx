import classNames from 'classnames';
import { memo, useDebugValue } from 'react';

import { useSearchContext } from '../context/search-context';
import { useAppSelector } from '../store';
import type { MappedFamily } from '../store/family/map';
import type { MappedPerson } from '../store/person/map';
import { getPerson } from '../store/person/slice';


const namesToString = ({ names }: MappedPerson) => {
    const birth = names.find(name => name.type === 'birth');
    const married = names.find(name => name.type === 'married');

    if (birth) {
        return `${birth.name ?? '???'} ${birth.surname ?? '???'}`;
    } else if (married) {
        return `(${married.name ?? '???'} ${married.surname ?? '???'})`;
    } else if (names[0]) {
        return `(${names[0].name ?? '???'} ${names[0].surname ?? '???'})`;
    }
    return '???';
};

const usePerson = (id?: string) => {
    useDebugValue(id);
    const person = useAppSelector(state => (id ? getPerson(state, id) : undefined));
    useDebugValue(person);
    return person ? namesToString(person) : null;
};

const Component = ({ family }: Props) => {
    const husband = usePerson(family.husband);
    const wife = usePerson(family.wife);
    const search = useSearchContext();

    if (search && ![husband, wife, family.married.place, family.id].some(value => (value ?? '').toLowerCase().includes(search.toLowerCase()))) {
        return null;
    }

    return (
        <tr key={family.uid}>
            <td>{family.id}</td>
            <td className={classNames({ error: !husband })}>{husband ?? '???'}</td>
            <td className={classNames({ error: !wife })}>{wife ?? '???'}</td>
            <td>{family.children}</td>
            <td className={classNames({ error: !family.married.date })}>{family.married.date}</td>
            <td className={classNames({ error: !family.married.place })}>{family.married.place}</td>
            <td className={classNames({ error: !family.married.status })}>{family.married.status}</td>
        </tr>
    );
};
Component.displayName = 'Family';

export const Family = memo(Component);

interface Props {
    family: MappedFamily;
}
