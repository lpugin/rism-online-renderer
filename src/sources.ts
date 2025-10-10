import { SourceTypes } from "./types";

import { I18n, LabelledLink, ROElement, URI } from './base';

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
    label?: I18n;
    type?: string;

    constructor(data: SourceTypes.ContentTypeData) {
      super();
      if (data) {
        this.label = new I18n(data.label);
        this.type = data.type;
      }
    }
  }

  export class Contents extends ROElement {
    sectionLabel?: I18n;
    summary?: SummaryItem[];
    subjects?: Subjects;

    constructor(data: SourceTypes.ContentsData) {
      super();
      if (data) {
        this.sectionLabel = new I18n(data.sectionLabel);
        this.summary = (data.summary || []).map((item: SourceTypes.SummaryItemData) => new SummaryItem(item));
        this.subjects = new Subjects(data.subjects);
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
    sectionLabel?: I18n;
    items?: ExemplarsItem[];

    constructor(data: SourceTypes.ExemplarsData) {
      super();
      this.hide("id");
      if (data) {
        this.id = new URI(data.id);
        this.type = data.type;
        this.sectionLabel = new I18n(data.sectionLabel);
        this.items = (data.items || []).map((item: SourceTypes.ExemplarsItemData) => new ExemplarsItem(item));
      }
    }
  }

  export class ExemplarsItem extends ROElement {
    id?: URI;
    type?: string;
    sectionLabel?: I18n;
    label?: I18n;
    summary?: MaterialSummary[];
    notes?: NotesItem[];
    heldBy?: RelatedTo;

    constructor(data: SourceTypes.ExemplarsItemData) {
      super();
      this.hide("id");
      if (data) {
        this.id = new URI(data.id);
        this.type = data.type;
        this.sectionLabel = new I18n(data.sectionLabel);
        this.label = new I18n(data.label);
        this.summary = (data.summary || []).map(
          (item: SourceTypes.MaterialSummaryData) => new MaterialSummary(item)
        );
        this.notes = (data.notes || []).map((note: SourceTypes.NotesItemData) => new NotesItem(note));
        this.heldBy = new RelatedTo(data.heldBy);
      }
    }
  }

  export class MaterialGroupItem extends ROElement {
    label?: I18n;
    summary?: MaterialSummary[];

    constructor(data: SourceTypes.MaterialGroupItemData) {
      super();
      if (data) {
        this.label = new I18n(data.label);
        this.summary = (data.summary || []).map(
          (item: SourceTypes.MaterialSummaryData) => new MaterialSummary(item)
        );
      }
    }
  }

  export class MaterialGroups extends ROElement {
    sectionLabel?: I18n;
    items?: MaterialGroupItem[];

    constructor(data: SourceTypes.MaterialGroupsData) {
      super();
      if (data) {
        this.sectionLabel = new I18n(data.sectionLabel);
        this.items = (data.items || []).map((item: SourceTypes.MaterialGroupItemData) => new MaterialGroupItem(item));
      }
    }
  }

  export class MaterialSummary extends ROElement {
    label?: I18n;
    value?: MaterialSummaryValue;
    type?: string[];

    constructor(data: SourceTypes.MaterialSummaryData) {
      super();
      if (data) {
        this.label = new I18n(data.label);
        this.value = new MaterialSummaryValue(data.value);
        this.type = data.type;
      }
    }
  }

  export class MaterialSummaryValue extends I18n { }

  export class NotesItem extends ROElement {
    label?: I18n;
    value?: NotesItemValue;

    constructor(data: SourceTypes.NotesItemData) {
      super();
      if (data) {
        this.label = new I18n(data.label);
        this.value = new NotesItemValue(data.value);
      }
    }
  }

  export class NotesItemValue extends I18n { }

  export class RecordHistory extends ROElement {
    type?: string;
    createdLabel?: I18n;
    updatedLabel?: I18n;
    created?: string;
    updated?: string;

    constructor(data: SourceTypes.RecordHistoryData) {
      super();
      if (data) {
        this.type = data.type;
        this.createdLabel = new I18n(data.createdLabel);
        this.updatedLabel = new I18n(data.updatedLabel);
        this.created = data.created;
        this.updated = data.updated;
      }
    }

    toHTML(lang?: string): HTMLElement {
      const container = this.createHTMLElement();
      if (this.created && this.createdLabel) {
        const createdDiv = document.createElement("div");
        createdDiv.appendChild(this.createdLabel.toHTML(lang));
        createdDiv.appendChild(this.createHTMLTextElement(this.created));
        container.appendChild(createdDiv);
      }
      if (this.updated && this.updatedLabel) {
        const updatedDiv = document.createElement("div");
        updatedDiv.appendChild(this.updatedLabel.toHTML(lang));
        updatedDiv.appendChild(this.createHTMLTextElement(this.updated));
        container.appendChild(updatedDiv);
      }
      return container;
    }
  }

  export class ReferencesNotes extends ROElement {
    sectionLabel?: I18n;
    type?: string;
    notes?: NotesItem[];

    constructor(data: SourceTypes.ReferencesNotesData) {
      super();
      if (data) {
        this.sectionLabel = new I18n(data.sectionLabel);
        this.type = data.type;
        this.notes = (data.notes || []).map((note: SourceTypes.NotesItemData) => new NotesItem(note));
      }
    }
  }

  export class Relationships extends ROElement {
    sectionLabel?: I18n;
    items?: RelationshipsItem[];

    constructor(data: SourceTypes.RelationshipsData) {
      super();
      if (data) {
        this.sectionLabel = new I18n(data.sectionLabel);
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
    label?: I18n;
    value?: string;
    id?: string;

    constructor(data: SourceTypes.RoleData) {
      super();
      this.hide("value");
      this.hide("id");
      if (data) {
        this.label = new I18n(data.label);
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
    label?: I18n;
    type?: string;

    constructor(data: SourceTypes.SourceTypeData) {
      super();
      if (data) {
        this.label = new I18n(data.label);
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
    sectionLabel?: I18n;
    items?: SubjectsItem[];

    constructor(data: SourceTypes.SubjectsData) {
      super();
      if (data) {
        this.sectionLabel = new I18n(data.sectionLabel);
        this.items = (data.items || []).map((item: SourceTypes.SubjectsItemData) => new SubjectsItem(item));
      }
    }
  }

  export class SubjectsItem extends ROElement {
    id?: URI;
    type?: string[];
    label?: I18n;
    value?: string;

    constructor(data: SourceTypes.SubjectsItemData) {
      super();
      if (data) {
        this.id = new URI(data.id);
        this.type = data.type;
        this.label = new I18n(data.label);
        this.value = data.value;
      }
    }
  }

  export class SummaryItem extends ROElement {
    label?: I18n;
    value?: SummaryValue;
    type?: string[];

    constructor(data: SourceTypes.SummaryItemData) {
      super();
      if (data) {
        this.label = new I18n(data.label);
        this.value = new SummaryValue(data.value);
        this.type = data.type;
      }
    }
  }

  export class SummaryValue extends I18n { }
}


