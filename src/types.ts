

export type LangMap = { [lang: string]: string[] };

/** Label object for multilingual strings */
export interface I18nData {
    [language: string]: string[];
}

/** URI reference */
export interface URIData {
    id: string;
    label?: I18nData;
}

export namespace SourceTypes {

    /* ──────────────────────────────
        ROOT SOURCE OBJECT
    ─────────────────────────────── */

    export interface SourceData {
        "@context"?: string;
        id: string;
        type?: string;
        typeLabel?: I18nData;
        label?: I18nData;
        creator?: CreatorData;
        sourceTypes?: SourceTypesData;
        recordHistory?: RecordHistoryData;
        contents?: ContentsData;
        materialGroups?: MaterialGroupsData;
        relationships?: RelationshipsData;
        referencesNotes?: ReferencesNotesData;
        exemplars?: ExemplarsData;
        sourceItems?: SourceItemsData;
        dates?: DatesData;
    }

    export interface ContentsData {
        sectionLabel?: I18nData;
        summary?: SummaryItemData[];
        subjects?: SubjectsData;
    }

    export interface ContentTypeData {
        label?: I18nData;
        type?: string;
    }

    export interface CreatedData {
        label?: I18nData;
        value?: string;
    }

    export interface CreatorData {
        role?: RoleData;
        relatedTo?: RelatedToData;
    }

    export interface DatesData {
        earliestDate?: number;
        latestDate?: number;
        dateStatement?: string;
    }

    export interface ExemplarsItemData {
        id: string;
        type?: string;
        sectionLabel?: I18nData;
        label?: I18nData;
        summary?: MaterialSummaryData[];
        notes?: NotesItemData[];
        heldBy?: RelatedToData;
    }

    export interface ExemplarsData {
        id?: string;
        type?: string;
        sectionLabel?: I18nData;
        items?: ExemplarsItemData[];
    }

    export interface MaterialSummaryData {
        label?: I18nData;
        value?: I18nData;
        type?: string[];
    }

    export interface MaterialGroupItemData {
        label?: I18nData;
        summary?: MaterialSummaryData[];
    }

    export interface MaterialGroupsData {
        sectionLabel?: I18nData;
        items?: MaterialGroupItemData[];
    }

    export interface NotesItemData {
        label?: I18nData;
        value?: I18nData;
    }

    export interface RecordHistoryData {
        type?: string;
        created?: CreatedData;
        updated?: UpdatedData;
    }

    export interface ReferencesNotesData {
        sectionLabel?: I18nData;
        type?: string;
        notes?: NotesItemData[];
    }

    export interface RelatedToData {
        id: string;
        label: I18nData;
        type?: string;
    }

    export interface RelationshipsItemData {
        role?: RoleData;
        relatedTo?: RelatedToData;
    }

    export interface RelationshipsData {
        sectionLabel?: I18nData;
        items?: RelationshipsItemData[];
    }

    export interface RoleData {
        label?: I18nData;
        value?: string;
        id?: string;
    }

    export interface SourceItemsData {
        sectionLabel?: I18nData;
        url?: string;
        totalItems?: number;
        items?: SourceData[];
    }

    export interface SourceTypeData {
        label?: I18nData;
        type?: string;
    }

    export interface SourceTypesData {
        recordType?: SourceTypeData;
        sourceType?: SourceTypeData;
        contentTypes?: ContentTypeData[];
    }

    export interface SubjectsItemData {
        id: string;
        type?: string;
        label?: I18nData;
        value?: string;
    }

    export interface SubjectsData {
        sectionLabel?: I18nData;
        items?: SubjectsItemData[];
    }

    export interface SummaryItemData {
        label?: I18nData;
        value?: I18nData;
        type?: string[];
    }

    export interface UpdatedData {
        label?: I18nData;
        value?: string;
    }
}

export namespace WorkTypes {

    /* ──────────────────────────────
        ROOT WORK OBJECT
    ─────────────────────────────── */

    export interface WorkData {
        "@context"?: string;
        id: string;
        type?: string;
        label?: I18nData;
        creator?: CreatorData;
        summary?: SummaryData[];
        partOf: PartOfData;
        recordHistory?: RecordHistoryData;
        incipits?: IncipitsData;
        //externalAuthorities?: ExternalAuthoritiesData;
        //formOfWork?: FormOfWorkData;
        //relationships?: RelationshipsData;
    }

    export interface CreatedData {
        label?: I18nData;
        value?: string;
    }

    export interface CreatorData {
        role?: RoleData;
        relatedTo?: RelatedToData;
    }

    export interface IncipitsData {
        id?: string;
        type?: string;
        sectionLabel?: I18nData;
        items?: IncipitsItemData[];
    }

    export interface IncipitsItemData {
        id: string;
        type?: string;
        sectionLabel?: I18nData;
        label?: I18nData;
        summary?: IncipitSummaryData[];
    }

    export interface IncipitSummaryData {
        label?: I18nData;
        value?: I18nData;
     }

    export interface ItemsData {
        relationshipType?: string;
        relatedTo?: RelatedToData;
        workNumber?: string;
    }

    export interface PartOfData {
        label?: I18nData;
        type?: string;
        items?: ItemsData[];
    }

    export interface RecordHistoryData {
        type?: string;
        created?: CreatedData;
        updated?: UpdatedData;
    }

    export interface RelatedToData {
        id: string;
        label: I18nData;
        type?: string;
        typeLabel?: I18nData;
        status?: StatusData;
    }

    export interface RoleData {
        label?: I18nData;
        value?: string;
        id?: string;
    }

    export interface StatusData {
        label?: I18nData;
        value?: string;
    }

    export interface SummaryData {
        label?: I18nData;
        value?: I18nData;
    }

    export interface UpdatedData {
        label?: I18nData;
        value?: string;
    }

}