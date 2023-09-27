/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { RootData } from './data-types';
import { EntryType } from './data-types';


export async function readFile(file: File) {
    const fileReader = new FileReader();
    const content = await new Promise<string>((resolve, reject) => {
        fileReader.addEventListener('load', () => {
            resolve(fileReader.result as string);
        });
        fileReader.addEventListener('error', reject);
        fileReader.addEventListener('abort', reject);
        fileReader.readAsText(file, 'utf-8');
    });

    const lines = content.trim().split(/\r?\n/g);

    const result: Partial<RootData> = {};
    let prevLevel = 0;
    let prevNode: any = result;
    let currentNode: any = null;
    const parents: any[] = [];

    for (const line of lines) {
        const [levelStr, tagStr, ...values] = line.split(' ');
        const value = values.join(' ') || null;
        const level = Number(levelStr);
        const tag = tagStr as Uppercase<string>;

        if (level === prevLevel + 1) {
            parents.push(prevNode);
            prevNode = currentNode;
            prevLevel = level;
        } else if (level < prevLevel) {
            while (prevLevel > level) {
                prevLevel--;
                prevNode = parents.pop();
            }
        }

        const data = { value };
        if (
            (prevNode.value === EntryType.FAM && tag === 'CHIL')
            || (prevNode.value === EntryType.INDI && tag === 'NAME')
            || (tag === 'SOUR' && /^@S\d+@$/.test(value ?? ''))
        ) {
            prevNode[tag] ??= [];
            (prevNode[tag] as any[]).push(data);
        } else {
            prevNode[tag] = data;
        }

        currentNode = data;
    }

    return result as RootData;
}
