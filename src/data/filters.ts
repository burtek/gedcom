import type { NestedData } from './read-file';


export const filterPersons = (node: NestedData) => node.type === 'INDI';
export const filterSources = (node: NestedData) => node.type === 'SOUR';
export const filterFamilies = (node: NestedData) => node.type === 'FAM';
