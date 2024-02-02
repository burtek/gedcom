export interface NestedData {
    type: string;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    data: { xref_id?: string; formal_name: string; pointer?: string };
    children: NestedData[];
    value: string | undefined;
}
