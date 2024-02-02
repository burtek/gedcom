import { createAsyncThunk } from '@reduxjs/toolkit';

import { readFile } from './read-file';


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
        const fileContent = await readFile(file, { patchInput: [patchGedKeeper] });

        thunkAPI.dispatch({ payload: fileContent, type: 'worker:parser/parse' });
    }
);
