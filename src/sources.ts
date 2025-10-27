import { SourceTypes } from "./types";

import { I18n, Label, LabelledLink, ROElement, URI } from './base';

/////////////////////////////

export namespace Sources {

  export class SourceLabel extends I18n { }

  export class Source extends ROElement {
    "@context"?: string;
    labelledLink?: LabelledLink;
    type?: string;
    typeLabel?: SourceLabel;
    creator?: Creator;
    sourceTypes?: SourceTypes;
    recordHistory?: RecordHistory;
    contents?: Contents;
    materialGroups?: MaterialGroups;
    relationships?: Relationships;
    referencesNotes?: ReferencesNotes;
    exemplars?: Exemplars;
    sourceItems?: SourceItems;
    dates?: Dates;

    constructor(data: SourceTypes.SourceData) {
      super();
      if (data) {
        this["@context"] = data["@context"];
        this.labelledLink = new LabelledLink(data.label, data.id);
        this.type = data.type;
        this.typeLabel = new SourceLabel(data.typeLabel);
        this.creator = new Creator(data.creator);
        this.sourceTypes = new SourceTypes(data.sourceTypes);
        this.recordHistory = new RecordHistory(data.recordHistory);
        this.contents = new Contents(data.contents);
        this.materialGroups = new MaterialGroups(data.materialGroups);
        this.relationships = new Relationships(data.relationships);
        this.referencesNotes = new ReferencesNotes(data.referencesNotes);
        this.exemplars = new Exemplars(data.exemplars);
        this.sourceItems = new SourceItems(data.sourceItems);
        this.dates = new Dates(data.dates);
      }
    }
  }

  /////

  export class ContentType extends ROElement {
    label?: Label;
    type?: string;

    constructor(data: SourceTypes.ContentTypeData) {
      super();
      if (data) {
        this.label = new Label(data.label);
        this.type = data.type;
      }
    }
  }

  export class Contents extends ROElement {
    sectionLabel?: Label;
    summary?: SummaryItem[];
    subjects?: Subjects;

    constructor(data: SourceTypes.ContentsData) {
      super();
      if (data) {
        this.sectionLabel = new Label(data.sectionLabel);
        this.summary = (data.summary || []).map((item: SourceTypes.SummaryItemData) => new SummaryItem(item));
        this.subjects = new Subjects(data.subjects);
      }
    }
  }

  export class Created extends ROElement {
    label?: Label;
    value?: string;

    constructor(data: SourceTypes.CreatedData) {
      super();
      if (data) {
        this.label = new Label(data.label);
        this.value = data.value;
      }
    }
  }

  export class Creator extends ROElement {
    role?: Role;
    relatedTo?: RelatedTo;

    constructor(data: SourceTypes.CreatorData) {
      super();
      if (data) {
        this.role = new Role(data.role);
        this.relatedTo = new RelatedTo(data.relatedTo);
      }
    }
  }

  export class Dates extends ROElement {
    earliestDate?: number;
    latestDate?: number;
    dateStatement?: string;

    constructor(data: SourceTypes.DatesData) {
      super();
      if (data) {
        this.earliestDate = data.earliestDate;
        this.latestDate = data.latestDate;
        this.dateStatement = data.dateStatement;
      }
    }
  }

  export class Exemplars extends ROElement {
    id?: URI;
    type?: string;
    sectionLabel?: Label;
    items?: ExemplarsItem[];

    constructor(data: SourceTypes.ExemplarsData) {
      super();
      this.hide("id");
      if (data) {
        this.id = new URI(data.id);
        this.type = data.type;
        this.sectionLabel = new Label(data.sectionLabel);
        this.items = (data.items || []).map((item: SourceTypes.ExemplarsItemData) => new ExemplarsItem(item));
      }
    }
  }

  export class ExemplarsItem extends ROElement {
    id?: URI;
    type?: string;
    sectionLabel?: Label;
    label?: Label;
    summary?: MaterialSummary[];
    notes?: NotesItem[];
    heldBy?: RelatedTo;

    constructor(data: SourceTypes.ExemplarsItemData) {
      super();
      this.hide("id");
      if (data) {
        this.id = new URI(data.id);
        this.type = data.type;
        this.sectionLabel = new Label(data.sectionLabel);
        this.label = new Label(data.label);
        this.summary = (data.summary || []).map(
          (item: SourceTypes.MaterialSummaryData) => new MaterialSummary(item)
        );
        this.notes = (data.notes || []).map((note: SourceTypes.NotesItemData) => new NotesItem(note));
        this.heldBy = new RelatedTo(data.heldBy);
      }
    }
  }

  export class MaterialGroupItem extends ROElement {
    label?: Label;
    summary?: MaterialSummary[];

    constructor(data: SourceTypes.MaterialGroupItemData) {
      super();
      if (data) {
        this.label = new Label(data.label);
        this.summary = (data.summary || []).map(
          (item: SourceTypes.MaterialSummaryData) => new MaterialSummary(item)
        );
      }
    }
  }

  export class MaterialGroups extends ROElement {
    sectionLabel?: Label;
    items?: MaterialGroupItem[];

    constructor(data: SourceTypes.MaterialGroupsData) {
      super();
      if (data) {
        this.sectionLabel = new Label(data.sectionLabel);
        this.items = (data.items || []).map((item: SourceTypes.MaterialGroupItemData) => new MaterialGroupItem(item));
      }
    }
  }

  export class MaterialSummary extends ROElement {
    label?: Label;
    value?: MaterialSummaryValue;
    type?: string[];

    constructor(data: SourceTypes.MaterialSummaryData) {
      super();
      if (data) {
        this.label = new Label(data.label);
        this.value = new MaterialSummaryValue(data.value);
        this.type = data.type;
      }
    }
  }

  export class MaterialSummaryValue extends I18n { }

  export class NotesItem extends ROElement {
    label?: Label;
    value?: NotesItemValue;

    constructor(data: SourceTypes.NotesItemData) {
      super();
      if (data) {
        this.label = new Label(data.label);
        this.value = new NotesItemValue(data.value);
      }
    }
  }

  export class NotesItemValue extends I18n { }

  export class RecordHistory extends ROElement {
    type?: string;
    created?: Created;
    updated?: Updated;

    constructor(data: SourceTypes.RecordHistoryData) {
      super();
      if (data) {
        this.type = data.type;
        this.created = new Created(data.created);
        this.updated = new Updated(data.updated);
      }
    }
  }

  export class ReferencesNotes extends ROElement {
    sectionLabel?: Label;
    type?: string;
    notes?: NotesItem[];

    constructor(data: SourceTypes.ReferencesNotesData) {
      super();
      if (data) {
        this.sectionLabel = new Label(data.sectionLabel);
        this.type = data.type;
        this.notes = (data.notes || []).map((note: SourceTypes.NotesItemData) => new NotesItem(note));
      }
    }
  }

  export class Relationships extends ROElement {
    sectionLabel?: Label;
    items?: RelationshipsItem[];

    constructor(data: SourceTypes.RelationshipsData) {
      super();
      if (data) {
        this.sectionLabel = new Label(data.sectionLabel);
        this.items = (data.items || []).map((item: SourceTypes.RelationshipsItemData) => new RelationshipsItem(item));
      }
    }
  }

  export class RelationshipsItem extends ROElement {
    role?: Role;
    relatedTo?: RelatedTo;

    constructor(data: SourceTypes.RelationshipsItemData) {
      super();
      if (data) {
        this.role = new Role(data.role);
        this.relatedTo = new RelatedTo(data.relatedTo);
      }
    }
  }

  export class RelatedTo extends ROElement {
    labelledLink?: LabelledLink;
    type?: string;

    constructor(data: SourceTypes.RelatedToData) {
      super();
      if (data) {
        this.labelledLink = new LabelledLink(data.label, data.id);
        this.type = data.type;
      }
    }
  }

  export class Role extends ROElement {
    label?: Label;
    value?: string;
    id?: string;

    constructor(data: SourceTypes.RoleData) {
      super();
      this.hide("value");
      this.hide("id");
      if (data) {
        this.label = new Label(data.label);
        this.value = data.value;
        this.id = data.id;
      }
    }
  }

  export class SourceItems extends ROElement {
    labelledLink?: LabelledLink;
    totalItems?: number;
    items?: Source[];

    constructor(data: SourceTypes.SourceItemsData) {
      super();
      if (data) {
        this.labelledLink = new LabelledLink(data.sectionLabel, data.url);
        this.totalItems = data.totalItems;
        this.items = (data.items || []).map((item: SourceTypes.SourceData) => new Source(item));
      }
    }
  }

  export class SourceType extends ROElement {
    label?: Label;
    type?: string;

    constructor(data: SourceTypes.SourceTypeData) {
      super();
      if (data) {
        this.label = new Label(data.label);
        this.type = data.type;
      }
    }
  }

  export class SourceTypes extends ROElement {
    recordType?: SourceType;
    sourceType?: SourceType;
    contentTypes?: ContentType[];

    constructor(data: SourceTypes.SourceTypesData) {
      super();
      if (data) {
        this.recordType = new SourceType(data.recordType);
        this.sourceType = new SourceType(data.sourceType);
        this.contentTypes = (data.contentTypes || []).map(
          (ct: SourceTypes.ContentTypeData) => new ContentType(ct)
        );
      }
    }
  }

  export class Subjects extends ROElement {
    sectionLabel?: Label;
    items?: SubjectsItem[];

    constructor(data: SourceTypes.SubjectsData) {
      super();
      if (data) {
        this.sectionLabel = new Label(data.sectionLabel);
        this.items = (data.items || []).map((item: SourceTypes.SubjectsItemData) => new SubjectsItem(item));
      }
    }
  }

  export class SubjectsItem extends ROElement {
    id?: URI;
    type?: string;
    label?: Label;
    value?: string;

    constructor(data: SourceTypes.SubjectsItemData) {
      super();
      if (data) {
        this.id = new URI(data.id);
        this.type = data.type;
        this.label = new Label(data.label);
        this.value = data.value;
      }
    }
  }

  export class SummaryItem extends ROElement {
    label?: Label;
    value?: SummaryValue;
    type?: string[];

    constructor(data: SourceTypes.SummaryItemData) {
      super();
      if (data) {
        this.label = new Label(data.label);
        this.value = new SummaryValue(data.value);
        this.type = data.type;
      }
    }
  }

  export class SummaryValue extends I18n { }


  export class Updated extends ROElement {
    label?: Label;
    value?: string;

    constructor(data: SourceTypes.UpdatedData) {
      super();
      if (data) {
        this.label = new Label(data.label);
        this.value = data.value;
      }
    }
  }
}
