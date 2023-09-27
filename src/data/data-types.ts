/* eslint-disable @typescript-eslint/naming-convention */

export interface StringValueOnly<S = string> {
    value: S;
}
export interface HasUID {
    _UID: StringValueOnly;
}
export interface DateTime extends StringValueOnly {
    TIME: StringValueOnly;
}
export interface Change {
    DATE: DateTime;
}
export interface Event {
    DATE: StringValueOnly;
    PLAC?: StringValueOnly;
}
export enum EntryType {
    SUBM = 'SUBM',
    INDI = 'INDI',
    FAM = 'FAM',
    NOTE = 'NOTE',
    SOUR = 'SOUR'
}

type Key<Prefix extends string> = `@${Prefix}${number}@`;
export type SubKey = Key<'SUB'>;
export type PersonKey = Key<'I'>;
export type FamilyKey = Key<'F'>;
// export type NoteKey = Key<'N'>;
export type SourceKey = Key<'S'>;

// ----

export interface RootData {
    HEAD: Head;
    [key: SubKey]: Sub;
    [key: PersonKey]: Person;
    [key: FamilyKey]: Family;
    // [key: NoteKey]: Note;
    [key: SourceKey]: Source;
    TRLR: StringValueOnly<null>;
}

// ----

export interface Head {
    value: null;
    SOUR: SourceApp;
    DEST: StringValueOnly;
    /** character encoding */
    CHAR: StringValueOnly;
    GEDC: GedComMeta;
    FILE: FileMeta;
    DATE: DateTime;
    SUBM: StringValueOnly;
}

export interface SourceApp extends StringValueOnly {
    VERS: StringValueOnly;
}

export interface GedComMeta {
    VERS: StringValueOnly;
    FORM: StringValueOnly;
}

export interface FileMeta extends StringValueOnly, HasUID {
    _REV: StringValueOnly;
}

// ----

export interface Sub extends StringValueOnly<EntryType.SUBM>, HasUID {
    NAME: StringValueOnly;
}

// ----

export interface PersonName extends StringValueOnly {
    SURN?: StringValueOnly;
    GIVN: StringValueOnly;
    TYPE?: StringValueOnly;
}
export interface PersonBirth extends StringValueOnly<null> {
    DATE?: DateTime;
    PLAC?: StringValueOnly;
}
export interface PersonDeath extends StringValueOnly<null> {
    DATE?: DateTime;
    PLAC?: StringValueOnly;
    CAUS?: StringValueOnly;
}
export interface PersonBurial extends StringValueOnly<null> {
    DATE?: DateTime;
    PLAC?: StringValueOnly;
    // NOTE?: StringValueOnly<NoteKey>;
    SOUR?: SourceReference[];
    TYPE?: StringValueOnly;
}

export interface Person extends StringValueOnly<EntryType.INDI>, HasUID {
    /** last change */
    CHAN?: Change;
    /** ? */
    RIN?: StringValueOnly;
    /** gender */
    SEX: StringValueOnly<'M' | 'F' | 'U'>;
    NAME: PersonName[];
    /** family */
    FAMC?: StringValueOnly<FamilyKey>;
    /** parents/family */
    FAMS?: StringValueOnly<FamilyKey>;
    /** birth */
    BIRT?: PersonBirth;
    /** death */
    DEAT?: PersonDeath;
    /** burial */
    BURI?: PersonBurial;
    /** occupancy */
    OCCU?: StringValueOnly;
}

// ----

export interface Family extends StringValueOnly<EntryType.FAM>, HasUID {
    _VWMAST?: StringValueOnly<'1'>;
    CHAN?: Change;

    HUSB?: StringValueOnly<PersonKey>;
    WIFE?: StringValueOnly<PersonKey>;
    CHIL?: StringValueOnly<PersonKey>[];

    ENGA?: Event;
    MARR?: Event & StringValueOnly<null | 'Y'>;

    _STAT?: StringValueOnly<'married'>;
}

// ----

// export interface Note extends StringValueOnly<EntryType.NOTE>, HasUID {
//     /** content */
//     CONT: StringValueOnly;
//     CHAN: Change;
// }

// ----

export interface Source extends StringValueOnly<EntryType.SOUR>, HasUID {
    CHAN: Change;
    ABBR: StringValueOnly;
}
export interface SourceReference extends StringValueOnly<SourceKey> {
    PAGE: StringValueOnly;
}
