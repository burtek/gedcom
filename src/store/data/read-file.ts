import { parse } from 'gedcom';


export async function readFile(file: File, { patchInput = [] as Array<(lines: string[]) => string[]> } = {}) {
    const fileReader = new FileReader();
    let content = await new Promise<string>((resolve, reject) => {
        fileReader.addEventListener('load', () => {
            resolve(fileReader.result as string);
        });
        fileReader.addEventListener('error', reject);
        fileReader.addEventListener('abort', reject);
        fileReader.readAsText(file, 'utf-8');
    });

    if (patchInput.length) {
        let lines = content.split(/\r?\n/g);
        patchInput.forEach(patcher => {
            lines = patcher(lines);
        });
        content = lines.join('\n');
    }

    const { children: items } = parse(content);

    return items as NestedData[];
}

export interface NestedData {
    type: string;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    data: { xref_id?: string; formal_name: string; pointer?: string };
    children: NestedData[];
    value: string | undefined;
}
