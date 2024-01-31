import { createAsyncThunk } from '@reduxjs/toolkit';
import 'core-js/proposals/array-grouping-v2';

import { readFile } from './data/read-file';
import { mapFamily } from './family/map';
import { actions as families } from './family/slice';
import { mapLocation } from './location/map';
import { actions as locations } from './location/slice';
import { mapPerson } from './person/map';
import { actions as persons } from './person/slice';
import { mapSource } from './source/map';
import { actions as sources } from './source/slice';


const patchGedKeeper = (lines: string[]) => lines.flatMap((line, index, { [index + 1]: nextLine }) => {
    if (!nextLine) {
        return line;
    }

    const expectedNextLevel = parseInt(line.split(' ')[0] as string, 10) + 1;
    const nextLevel = parseInt(nextLine.split(' ')[0] as string, 10);

    if (nextLevel - expectedNextLevel > 0) {
        return [line, ...Array.from({ length: nextLevel - expectedNextLevel }, (_, i) => `${i + expectedNextLevel} _LVLFIX Y`)];
    }
    return line;
});

export const readAndParseData = createAsyncThunk(
    'readAndParseData',
    async (file: File, thunkAPI) => {
        // eslint-disable-next-line no-warning-comments
        // TODO: move to webworker, add loader and stuff
        const data = await readFile(file, { patchInput: [patchGedKeeper] });

        const grouped = Object.groupBy(data, datum => datum.type);

        if (grouped.INDI) {
            thunkAPI.dispatch(persons.load(grouped.INDI.map(mapPerson)));
        }
        if (grouped.FAM) {
            thunkAPI.dispatch(families.load(grouped.FAM.map(mapFamily)));
        }
        if (grouped.SOUR) {
            thunkAPI.dispatch(sources.load(grouped.SOUR.map(mapSource)));
        }
        if (grouped._LOC) {
            thunkAPI.dispatch(locations.load(grouped._LOC.map(mapLocation)));
        }
    }
);
