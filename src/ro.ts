import {
  I18nData,
  Sources
} from "./types";

export class Renderer {
  constructor(private uri: string, private containerId: string) {}

  async render(language: string = "en"): Promise<void> {
    try {
      const response = await fetch(this.uri, {
        headers: { Accept: "application/ld+json" },
      });
      const data = await response.json() as Sources.SourceData;
      const context = new Source(data);
      const container = document.getElementById(this.containerId);

      if (!container) {
        console.error(`Container with ID "${this.containerId}" not found.`);
        return;
      }

      container.appendChild(context.toHTML(language));
    } catch (error) {
      console.error("Failed to fetch or render JSON-LD:", error);
    }
  }
}

class ROElement {
  hidden: string[];

  constructor() {
    this.hidden = ["@context", "type"];
  } 

  hide(member: string): void {
    this.hidden.push(member);
  }

  createHTMLElement(): HTMLElement {
    const container = document.createElement("div");
    container.className = this.constructor.name.toLowerCase();
    return container;
  }

  createHTMLTextElement(content: string): HTMLElement {
    const container = document.createElement("div");
    container.textContent = content;
    return container;
  }

  toHTML(lang?: string): HTMLElement {
    const container = this.createHTMLElement();

    for (let member in this) {
      // console.log(member);
      if (this.isHidden(member)) continue;
      //
      if (this[member] instanceof ROElement) {
        const child = this[member].toHTML(lang);
        // Only add elements with children
        if (child.hasChildNodes()) {
          container.appendChild(child);
        }
        else {
          child.remove();
        }    
      }
      else if (Array.isArray(this[member])) {
        this[member].forEach((item) => {
          if (item instanceof ROElement) {
            container.appendChild(item.toHTML(lang));
          }
          else {
            //console.log(item);
          }
        });
      }
      else if (typeof this[member] === "string") {
        const text = document.createElement("div");
        text.textContent = this[member]
        container.appendChild(text);
      }

    }
    return container;
  }

  isHidden(member: string): boolean {
    if (this.hidden.includes(member)) return true;
    return false;
  }
}

class URI extends ROElement {
  link: string;

  constructor(link: string) {
    super()
    this.link = link
  }

  toHTML(): HTMLElement {
    const a = document.createElement("a");
    a.textContent = this.link;
    a.setAttribute("href", this.link);
    a.setAttribute("target", "_blank");
    return a;
  }
}

class I18n extends ROElement {
  private map: I18nData;

  constructor(initialMap: I18nData) {
    super()
    this.map = initialMap;
  }

  get(language: string): string {
    return (this.has(language) ? this.map[language] : "")
  }

  has(language: string): boolean {
    return Object.prototype.hasOwnProperty.call(this.map, language);
  }

  toHTML(lang?: string): HTMLElement {
    const container = document.createElement("div");
    container.className = this.constructor.name.toLowerCase();

    if (this.map) {
      if (!lang || !this.has(lang)) {
        lang = Object.keys(this.map)[0];
      }
      const langContainer = document.createElement("span");
      langContainer.className = `lang-${lang}`;
      langContainer.textContent = this.get(lang);
      container.appendChild(langContainer);
    }

    return container;
  }
}

class LabelledLink extends ROElement {
  label: I18n;
  id: URI;

  constructor(label: I18nData, id: string) {
    super()
    this.hide("label");
    this.hide("id");
    this.label = new I18n(label);
    this.id = new URI(id);
  }

  toHTML(lang?: string): HTMLElement {
    const container = document.createElement("div");
    container.className = this.constructor.name.toLowerCase();
    const a = this.id.toHTML();
    a.textContent = "";
    a.appendChild(this.label.toHTML(lang));
    container.appendChild(a);
    return container;
  }
}

/////////////////////////////

class SourceLabel extends I18n { }

class Source extends ROElement {
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

  constructor(data: Sources.SourceData) {
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

class MaterialSummaryValue extends I18n {}

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

class NotesItemValue extends I18n {}

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

class SummaryValue extends I18n {}

