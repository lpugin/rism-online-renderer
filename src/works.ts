import { WorkTypes } from "./types";

import { Data, I18n, Label, LabelledLink, ROElement, URI } from './base';

/////////////////////////////

export namespace Works {

  export class Work extends ROElement {
    "@context"?: string;
    labelledLink?: LabelledLink;
    type?: string;
    creator?: Creator;
    summary?: Summary[];
    partOf?: PartOf;
    recordHistory?: RecordHistory;
    incipits?: Incipits;
    sources?: Sources;
    externalAuthorities?: ExternalAuthorities;
    formOfWork?: FormOfWork;
    relationships?: Relationships;

    constructor(data: WorkTypes.WorkData) {
      super();
      this.hide("id");
      this.hide("sources");
      if (data) {
        this["@context"] = data["@context"];
        this.labelledLink = new LabelledLink(data.label, data.id);
        this.type = data.type;
        this.creator = new Creator(data.creator);
        this.summary = (data.summary || []).map(
          (item: WorkTypes.SummaryData) => new Summary(item)
        );
        this.partOf = new PartOf(data.partOf);
        this.recordHistory = new RecordHistory(data.recordHistory);
        this.incipits = new Incipits(data.incipits);
        this.sources = new Sources(data.sources);
        this.externalAuthorities = new ExternalAuthorities(data.externalAuthorities);
        this.formOfWork = new FormOfWork(data.formOfWork);
        this.relationships = new Relationships(data.relationships);
      }
    }
  }

  /////

  export class Created extends ROElement {
    label?: Label;
    value?: string;

    constructor(data: WorkTypes.CreatedData) {
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

    constructor(data: WorkTypes.CreatorData) {
      super();
      if (data) {
        this.role = new Role(data.role);
        this.relatedTo = new RelatedTo(data.relatedTo);
      }
    }
  }

  export class Encodings extends ROElement {
    label?: Label;
    format?: string;
    data?: PAE;
    url?: string;

    constructor(data: WorkTypes.EncodingsData) {
      super();
      this.hide("label");
      this.hide("format");
      this.hide("data");
      this.hide("url");
      if (data) {
        this.label = new Label(data.label);
        this.format = data.format;
        this.data = new PAE(data.data);
        this.url = data.url;
      }
    }
  }

  export class ExternalAuthorities extends ROElement {
    label?: Label;
    items: ExternalAuthoritiesItem[];
    type?: string;

    constructor(data: WorkTypes.ExternalAuthoritiesData) {
      super();
      if (data) {
        this.label = new Label(data.label);
        this.items = (data.items || []).map((item: WorkTypes.ExternalAuthoritiesItemData) => new ExternalAuthoritiesItem(item));
        this.type = data.type;
      }
    }
  }

  export class ExternalAuthoritiesItem extends ROElement {
    url?: string;
    base?: string;
    labelledLinked?: LabelledLink;
    value?: string;
    type?: string;

    constructor(data: WorkTypes.ExternalAuthoritiesItemData) {
      super();
      this.hide("url");
      this.hide("base");
      this.hide("value");
      if (data) {
        this.url = data.url;
        this.base = data.base;
        this.labelledLinked = new LabelledLink(data.label, data.url);
        this.value = data.value;
        this.type = data.type;
      }
    }
  }

  export class FormOfWork extends ROElement {
    sectionLabel?: Label;
    items: FormOfWorkItem[];
    type?: string;

    constructor(data: WorkTypes.FormOfWorkData) {
      super();
      if (data) {
        this.sectionLabel = new Label(data.sectionLabel);
        this.items = (data.items || []).map((item: WorkTypes.FormOfWorkItemData) => new FormOfWorkItem(item));
        this.type = data.type;
      }
    }
  }

  export class FormOfWorkItem extends ROElement {
    id?: string;
    label?: Label;
    value?: string;
    type?: string;

    constructor(data: WorkTypes.FormOfWorkItemData) {
      super();
      this.hide("id");
      this.hide("base");
      this.hide("value");
      if (data) {
        this.id = data.id;
        this.label = new Label(data.label);
        this.value = data.value;
        this.type = data.type;
      }
    }
  }

  export class Incipits extends ROElement {
    id?: URI;
    type?: string;
    sectionLabel?: Label;
    items?: IncipitsItem[];

    constructor(data: WorkTypes.IncipitsData) {
      super();
      this.hide("id");
      if (data) {
        this.id = new URI(data.id);
        this.type = data.type;
        this.sectionLabel = new Label(data.sectionLabel);
        this.items = (data.items || []).map((item: WorkTypes.IncipitsItemData) => new IncipitsItem(item));
      }
    }
  }

  export class IncipitsItem extends ROElement {
    id?: URI;
    type?: string;
    sectionLabel?: Label;
    label?: Label;
    summary?: IncipitSummary[];
    rendered?: Rendered[];
    encodings?: Encodings[];
    properties?: Properties;
    heldBy?: RelatedTo;

    constructor(data: WorkTypes.IncipitsItemData) {
      super();
      this.hide("id");
      this.hide("properties");
      if (data) {
        this.id = new URI(data.id);
        this.type = data.type;
        this.sectionLabel = new Label(data.sectionLabel);
        this.label = new Label(data.label);
        this.summary = (data.summary || []).map(
          (item: WorkTypes.IncipitSummaryData) => new IncipitSummary(item)
        );
        this.rendered = (data.rendered || []).map((item: WorkTypes.RenderedData) => new Rendered(item));
        this.encodings = (data.encodings || []).map((item: WorkTypes.EncodingsData) => new Encodings(item));
        this.properties = new Properties(data.properties);
      }
    }
  }

  export class IncipitSummary extends ROElement {
    label?: Label;
    value?: I18n;

    constructor(data: WorkTypes.IncipitSummaryData) {
      super();
      if (data) {
        this.label = new Label(data.label);
        this.value = new I18n(data.value);
      }
    }
  }

  export class Item extends ROElement {
    relationshipType?: string;
    workNumber?: string;
    relatedTo?: RelatedTo;

    constructor(data: WorkTypes.ItemsData) {
      super();
      this.hide("relationshipType");
      if (data) {
        this.relationshipType = data.relationshipType;
        this.workNumber = data.workNumber;
        this.relatedTo = new RelatedTo(data.relatedTo);
      }
    }
  }

  export class PAE extends ROElement {
    clef?: string;
    keysig?: string;
    timesig?: string;
    key?: string;
    data?: string;

    constructor(data: WorkTypes.PAEData) {
      super();
      if (data) {
        this.clef = data.clef;
        this.keysig = data.keysig;
        this.timesig = data.timesig;
        this.key = data.key;
        this.data = data.data;
      }
    }
  }

  export class PartOf extends ROElement {
    type?: string;
    label?: Label;
    items?: Item[];

    constructor(data: WorkTypes.PartOfData) {
      super();
      this.hide("id");
      if (data) {
        this.type = data.type;
        this.label = new Label(data.label);
        this.items = (data.items || []).map((item: WorkTypes.ItemsData) => new Item(item));
      }
    }
  }

  export class Properties extends ROElement {
    clef?: string;
    keysig?: string;
    timesig?: string;
    notation?: string;

    constructor(data: WorkTypes.PropertiesData) {
      super();
      if (data) {
        this.clef = data.clef;
        this.keysig = data.keysig;
        this.timesig = data.timesig;
        this.notation = data.notation;
      }
    }
  }

  export class RecordHistory extends ROElement {
    type?: string;
    created?: Created;
    updated?: Updated;

    constructor(data: WorkTypes.RecordHistoryData) {
      super();
      if (data) {
        this.type = data.type;
        this.created = new Created(data.created);
        this.updated = new Updated(data.updated);
      }
    }
  }

  export class RelatedTo extends ROElement {
    labelledLink?: LabelledLink;
    type?: string;
    status?: Status;

    constructor(data: WorkTypes.RelatedToData) {
      super();
      if (data) {
        this.labelledLink = new LabelledLink(data.label, data.id);
        this.type = data.type;
        this.status = new Status(data.status)
      }
    }
  }

  export class Relationships extends ROElement {
    sectionLabel?: Label;
    items?: RelationshipsItem[];

    constructor(data: WorkTypes.RelationshipsData) {
      super();
      if (data) {
        this.sectionLabel = new Label(data.sectionLabel);
        this.items = (data.items || []).map((item: WorkTypes.RelationshipsItemData) => new RelationshipsItem(item));
      }
    }
  }

  export class RelationshipsItem extends ROElement {
    role?: Role;
    relatedTo?: RelatedTo;

    constructor(data: WorkTypes.RelationshipsItemData) {
      super();
      if (data) {
        this.role = new Role(data.role);
        this.relatedTo = new RelatedTo(data.relatedTo);
      }
    }
  }

  export class Rendered extends ROElement {
    format?: string;
    data?: Data;
    url?: string;

    constructor(data: WorkTypes.RenderedData) {
      super();
      this.hide("format");
      this.hide("url");
      if (data) {
        this.format = data.format;
        if (data.data) {
          this.data = new Data(data.format, data.data);
        }
        this.url = data.url;
      }
    }
  }

  export class Role extends ROElement {
    label?: Label;
    value?: string;
    id?: string;

    constructor(data: WorkTypes.RoleData) {
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

  export class Status extends ROElement {
    label?: Label;
    value?: string;

    constructor(data: WorkTypes.StatusData) {
      super();
      this.hide("value");
      if (data) {
        this.label = new Label(data.label);
        this.value = data.value;
      }
    }
  }

  export class Sources extends ROElement {
    url?: URI;
    totalItems?: number;

    constructor(data: WorkTypes.SourcesData) {
      super();
      this.hide("totalItems");
      if (data) {
        this.url = new URI(data.url, data.totalItems.toString());
        this.totalItems = data.totalItems;
      }
    }
  }

  export class Summary extends ROElement {
    label?: Label;
    value?: I18n;

    constructor(data: WorkTypes.SummaryData) {
      super();
      if (data) {
        this.label = new Label(data.label);
        this.value = new I18n(data.value);
      }
    }
  }

  export class Updated extends ROElement {
    label?: Label;
    value?: string;

    constructor(data: WorkTypes.UpdatedData) {
      super();
      if (data) {
        this.label = new Label(data.label);
        this.value = data.value;
      }
    }
  }

  /*
  class ContentType extends ROElement {
    label?: I18n;
    type?: string;
  
    constructor(data: Sources.ContentTypeData) {
      super();
      if (data) {
        this.label = new I18n(data.label);
        this.type = data.type;
      }
    }
  }
  
  class Contents extends ROElement {
    sectionLabel?: I18n;
    summary?: SummaryItem[];
    subjects?: Subjects;
  
    constructor(data: Sources.ContentsData) {
      super();
      if (data) {
        this.sectionLabel = new I18n(data.sectionLabel);
        this.summary = (data.summary || []).map((item: Sources.SummaryItemData) => new SummaryItem(item));
        this.subjects = new Subjects(data.subjects);
      }
    }
  }
  
  class Creator extends ROElement {
    role?: Role;
    relatedTo?: RelatedTo;
  
    constructor(data: Sources.CreatorData) {
      super();
      if (data) {
        this.role = new Role(data.role);
        this.relatedTo = new RelatedTo(data.relatedTo);
      }
    }
  }
  
  class Dates extends ROElement {
    earliestDate?: number;
    latestDate?: number;
    dateStatement?: string;
  
    constructor(data: Sources.DatesData) {
      super();
      if (data) {
        this.earliestDate = data.earliestDate;
        this.latestDate = data.latestDate;
        this.dateStatement = data.dateStatement;
      }
    }
  }
  
  class Exemplars extends ROElement {
    id?: URI;
    type?: string;
    sectionLabel?: I18n;
    items?: ExemplarsItem[];
  
    constructor(data: Sources.ExemplarsData) {
      super();
      this.hide("id");
      if (data) {
        this.id = new URI(data.id);
        this.type = data.type;
        this.sectionLabel = new I18n(data.sectionLabel);
        this.items = (data.items || []).map((item: Sources.ExemplarsItemData) => new ExemplarsItem(item));
      }
    }
  }
  
  class ExemplarsItem extends ROElement {
    id?: URI;
    type?: string;
    sectionLabel?: I18n;
    label?: I18n;
    summary?: MaterialSummary[];
    notes?: NotesItem[];
    heldBy?: RelatedTo;
  
    constructor(data: Sources.ExemplarsItemData) {
      super();
      this.hide("id");
      if (data) {
        this.id = new URI(data.id);
        this.type = data.type;
        this.sectionLabel = new I18n(data.sectionLabel);
        this.label = new I18n(data.label);
        this.summary = (data.summary || []).map(
          (item: Sources.MaterialSummaryData) => new MaterialSummary(item)
        );
        this.notes = (data.notes || []).map((note: Sources.NotesItemData) => new NotesItem(note));
        this.heldBy = new RelatedTo(data.heldBy);
      }
    }
  }
  
  class MaterialGroupItem extends ROElement {
    label?: I18n;
    summary?: MaterialSummary[];
  
    constructor(data: Sources.MaterialGroupItemData) {
      super();
      if (data) {
        this.label = new I18n(data.label);
        this.summary = (data.summary || []).map(
          (item: Sources.MaterialSummaryData) => new MaterialSummary(item)
        );
      }
    }
  }
  
  class MaterialGroups extends ROElement {
    sectionLabel?: I18n;
    items?: MaterialGroupItem[];
  
    constructor(data: Sources.MaterialGroupsData) {
      super();
      if (data) {
        this.sectionLabel = new I18n(data.sectionLabel);
        this.items = (data.items || []).map((item: Sources.MaterialGroupItemData) => new MaterialGroupItem(item));
      }
    }
  }
  
  class MaterialSummary extends ROElement {
    label?: I18n;
    value?: MaterialSummaryValue;
    type?: string[];
  
    constructor(data: Sources.MaterialSummaryData) {
      super();
      if (data) {
        this.label = new I18n(data.label);
        this.value = new MaterialSummaryValue(data.value);
        this.type = data.type;
      }
    }
  }
  
  class MaterialSummaryValue extends I18n { }
  
  class NotesItem extends ROElement {
    label?: I18n;
    value?: NotesItemValue;
  
    constructor(data: Sources.NotesItemData) {
      super();
      if (data) {
        this.label = new I18n(data.label);
        this.value = new NotesItemValue(data.value);
      }
    }
  }
  
  class NotesItemValue extends I18n { }
  
  class RecordHistory extends ROElement {
    type?: string;
    createdLabel?: I18n;
    updatedLabel?: I18n;
    created?: string;
    updated?: string;
  
    constructor(data: Sources.RecordHistoryData) {
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
  
  class ReferencesNotes extends ROElement {
    sectionLabel?: I18n;
    type?: string;
    notes?: NotesItem[];
  
    constructor(data: Sources.ReferencesNotesData) {
      super();
      if (data) {
        this.sectionLabel = new I18n(data.sectionLabel);
        this.type = data.type;
        this.notes = (data.notes || []).map((note: Sources.NotesItemData) => new NotesItem(note));
      }
    }
  }
  
  class Relationships extends ROElement {
    sectionLabel?: I18n;
    items?: RelationshipsItem[];
  
    constructor(data: Sources.RelationshipsData) {
      super();
      if (data) {
        this.sectionLabel = new I18n(data.sectionLabel);
        this.items = (data.items || []).map((item: Sources.RelationshipsItemData) => new RelationshipsItem(item));
      }
    }
  }
  
  class RelationshipsItem extends ROElement {
    role?: Role;
    relatedTo?: RelatedTo;
  
    constructor(data: Sources.RelationshipsItemData) {
      super();
      if (data) {
        this.role = new Role(data.role);
        this.relatedTo = new RelatedTo(data.relatedTo);
      }
    }
  }
  
  class RelatedTo extends ROElement {
    labelledLink?: LabelledLink;
    type?: string;
  
    constructor(data: Sources.RelatedToData) {
      super();
      if (data) {
        this.labelledLink = new LabelledLink(data.label, data.id);
        this.type = data.type;
      }
    }
  }
  
  class Role extends ROElement {
    label?: I18n;
    value?: string;
    id?: string;
  
    constructor(data: Sources.RoleData) {
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
  
  class SourceItems extends ROElement {
    labelledLink?: LabelledLink;
    totalItems?: number;
    items?: Source[];
  
    constructor(data: Sources.SourceItemsData) {
      super();
      if (data) {
        this.labelledLink = new LabelledLink(data.sectionLabel, data.url);
        this.totalItems = data.totalItems;
        this.items = (data.items || []).map((item: Sources.SourceData) => new Source(item));
      }
    }
  }
  
  class SourceType extends ROElement {
    label?: I18n;
    type?: string;
  
    constructor(data: Sources.SourceTypeData) {
      super();
      if (data) {
        this.label = new I18n(data.label);
        this.type = data.type;
      }
    }
  }
  
  class SourceTypes extends ROElement {
    recordType?: SourceType;
    sourceType?: SourceType;
    contentTypes?: ContentType[];
  
    constructor(data: Sources.SourceTypesData) {
      super();
      if (data) {
        this.recordType = new SourceType(data.recordType);
        this.sourceType = new SourceType(data.sourceType);
        this.contentTypes = (data.contentTypes || []).map(
          (ct: Sources.ContentTypeData) => new ContentType(ct)
        );
      }
    }
  }
  
  class Subjects extends ROElement {
    sectionLabel?: I18n;
    items?: SubjectsItem[];
  
    constructor(data: Sources.SubjectsData) {
      super();
      if (data) {
        this.sectionLabel = new I18n(data.sectionLabel);
        this.items = (data.items || []).map((item: Sources.SubjectsItemData) => new SubjectsItem(item));
      }
    }
  }
  
  class SubjectsItem extends ROElement {
    id?: URI;
    type?: string[];
    label?: I18n;
    value?: string;
  
    constructor(data: Sources.SubjectsItemData) {
      super();
      if (data) {
        this.id = new URI(data.id);
        this.type = data.type;
        this.label = new I18n(data.label);
        this.value = data.value;
      }
    }
  }
  
  class SummaryItem extends ROElement {
    label?: I18n;
    value?: SummaryValue;
    type?: string[];
  
    constructor(data: Sources.SummaryItemData) {
      super();
      if (data) {
        this.label = new I18n(data.label);
        this.value = new SummaryValue(data.value);
        this.type = data.type;
      }
    }
  }
  
  class SummaryValue extends I18n { }
  
  */

}
