import { parse } from 'gedcom';


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
