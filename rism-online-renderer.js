var RISMOnline = (function (exports) {
    'use strict';

    class ROElement {
        constructor() {
            this.hidden = ["@context", "type"];
        }
        hide(member) {
            this.hidden.push(member);
        }
        createHTMLElement() {
            const container = document.createElement("div");
            container.className = this.constructor.name.toLowerCase();
            return container;
        }
        createHTMLTextElement(content) {
            const container = document.createElement("div");
            container.textContent = content;
            return container;
        }
        toHTML(lang) {
            const container = this.createHTMLElement();
            for (let member in this) {
                // console.log(member);
                if (this.isHidden(member))
                    continue;
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
                    });
                }
                else if (typeof this[member] === "string") {
                    const text = document.createElement("div");
                    text.textContent = this[member];
                    container.appendChild(text);
                }
                else if (typeof this[member] === "number") {
                    const text = document.createElement("div");
                    text.textContent = this[member].toString();
                    container.appendChild(text);
                }
            }
            return container;
        }
        isHidden(member) {
            if (this.hidden.includes(member))
                return true;
            return false;
        }
    }
    class URI extends ROElement {
        constructor(link, displayText) {
            super();
            this.link = link;
            this.displayText = displayText;
        }
        toHTML() {
            const a = document.createElement("a");
            a.textContent = (this.displayText) ? this.displayText : this.link;
            a.setAttribute("href", this.link);
            a.setAttribute("target", "_blank");
            return a;
        }
    }
    class I18n extends ROElement {
        constructor(initialMap) {
            super();
            this.map = initialMap;
        }
        get(language) {
            return (this.has(language) ? this.map[language] : []);
        }
        has(language) {
            return Object.prototype.hasOwnProperty.call(this.map, language);
        }
        toHTML(lang) {
            const container = document.createElement("div");
            container.className = this.constructor.name.toLowerCase();
            if (this.map) {
                if (!lang || !this.has(lang)) {
                    lang = Object.keys(this.map)[0];
                }
                const langContainer = document.createElement("span");
                langContainer.className = `lang-${lang}`;
                this.get(lang).forEach((item) => {
                    const itemContainer = document.createElement("span");
                    itemContainer.textContent = item;
                    langContainer.appendChild(itemContainer);
                });
                container.appendChild(langContainer);
            }
            return container;
        }
    }
    class Label extends I18n {
    }
    class LabelledLink extends ROElement {
        constructor(label, id) {
            super();
            this.hide("label");
            this.hide("id");
            this.label = new I18n(label);
            this.id = new URI(id);
        }
        toHTML(lang) {
            const container = document.createElement("div");
            container.className = this.constructor.name.toLowerCase();
            const a = this.id.toHTML();
            a.textContent = "";
            a.appendChild(this.label.toHTML(lang));
            container.appendChild(a);
            return container;
        }
    }
    class Data extends ROElement {
        constructor(format, data) {
            super();
            this.format = format;
            this.data = data;
        }
        toHTML() {
            if (this.format === "image/svg+xml") {
                const div = document.createElement("div");
                const parser = new DOMParser();
                const doc = parser.parseFromString(this.data, "image/svg+xml");
                div.appendChild(doc.documentElement);
                return div;
            }
        }
    }

    /////////////////////////////
    var Sources;
    (function (Sources) {
        class SourceLabel extends I18n {
        }
        Sources.SourceLabel = SourceLabel;
        class Source extends ROElement {
            constructor(data) {
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
        Sources.Source = Source;
        /////
        class ContentType extends ROElement {
            constructor(data) {
                super();
                if (data) {
                    this.label = new Label(data.label);
                    this.type = data.type;
                }
            }
        }
        Sources.ContentType = ContentType;
        class Contents extends ROElement {
            constructor(data) {
                super();
                if (data) {
                    this.sectionLabel = new Label(data.sectionLabel);
                    this.summary = (data.summary || []).map((item) => new SummaryItem(item));
                    this.subjects = new Subjects(data.subjects);
                }
            }
        }
        Sources.Contents = Contents;
        class Created extends ROElement {
            constructor(data) {
                super();
                if (data) {
                    this.label = new Label(data.label);
                    this.value = data.value;
                }
            }
        }
        Sources.Created = Created;
        class Creator extends ROElement {
            constructor(data) {
                super();
                if (data) {
                    this.role = new Role(data.role);
                    this.relatedTo = new RelatedTo(data.relatedTo);
                }
            }
        }
        Sources.Creator = Creator;
        class Dates extends ROElement {
            constructor(data) {
                super();
                if (data) {
                    this.earliestDate = data.earliestDate;
                    this.latestDate = data.latestDate;
                    this.dateStatement = data.dateStatement;
                }
            }
        }
        Sources.Dates = Dates;
        class Exemplars extends ROElement {
            constructor(data) {
                super();
                this.hide("id");
                if (data) {
                    this.id = new URI(data.id);
                    this.type = data.type;
                    this.sectionLabel = new Label(data.sectionLabel);
                    this.items = (data.items || []).map((item) => new ExemplarsItem(item));
                }
            }
        }
        Sources.Exemplars = Exemplars;
        class ExemplarsItem extends ROElement {
            constructor(data) {
                super();
                this.hide("id");
                if (data) {
                    this.id = new URI(data.id);
                    this.type = data.type;
                    this.sectionLabel = new Label(data.sectionLabel);
                    this.label = new Label(data.label);
                    this.summary = (data.summary || []).map((item) => new MaterialSummary(item));
                    this.notes = (data.notes || []).map((note) => new NotesItem(note));
                    this.heldBy = new RelatedTo(data.heldBy);
                }
            }
        }
        Sources.ExemplarsItem = ExemplarsItem;
        class MaterialGroupItem extends ROElement {
            constructor(data) {
                super();
                if (data) {
                    this.label = new Label(data.label);
                    this.summary = (data.summary || []).map((item) => new MaterialSummary(item));
                }
            }
        }
        Sources.MaterialGroupItem = MaterialGroupItem;
        class MaterialGroups extends ROElement {
            constructor(data) {
                super();
                if (data) {
                    this.sectionLabel = new Label(data.sectionLabel);
                    this.items = (data.items || []).map((item) => new MaterialGroupItem(item));
                }
            }
        }
        Sources.MaterialGroups = MaterialGroups;
        class MaterialSummary extends ROElement {
            constructor(data) {
                super();
                if (data) {
                    this.label = new Label(data.label);
                    this.value = new MaterialSummaryValue(data.value);
                    this.type = data.type;
                }
            }
        }
        Sources.MaterialSummary = MaterialSummary;
        class MaterialSummaryValue extends I18n {
        }
        Sources.MaterialSummaryValue = MaterialSummaryValue;
        class NotesItem extends ROElement {
            constructor(data) {
                super();
                if (data) {
                    this.label = new Label(data.label);
                    this.value = new NotesItemValue(data.value);
                }
            }
        }
        Sources.NotesItem = NotesItem;
        class NotesItemValue extends I18n {
        }
        Sources.NotesItemValue = NotesItemValue;
        class RecordHistory extends ROElement {
            constructor(data) {
                super();
                if (data) {
                    this.type = data.type;
                    this.created = new Created(data.created);
                    this.updated = new Updated(data.updated);
                }
            }
        }
        Sources.RecordHistory = RecordHistory;
        class ReferencesNotes extends ROElement {
            constructor(data) {
                super();
                if (data) {
                    this.sectionLabel = new Label(data.sectionLabel);
                    this.type = data.type;
                    this.notes = (data.notes || []).map((note) => new NotesItem(note));
                }
            }
        }
        Sources.ReferencesNotes = ReferencesNotes;
        class Relationships extends ROElement {
            constructor(data) {
                super();
                if (data) {
                    this.sectionLabel = new Label(data.sectionLabel);
                    this.items = (data.items || []).map((item) => new RelationshipsItem(item));
                }
            }
        }
        Sources.Relationships = Relationships;
        class RelationshipsItem extends ROElement {
            constructor(data) {
                super();
                if (data) {
                    this.role = new Role(data.role);
                    this.relatedTo = new RelatedTo(data.relatedTo);
                }
            }
        }
        Sources.RelationshipsItem = RelationshipsItem;
        class RelatedTo extends ROElement {
            constructor(data) {
                super();
                if (data) {
                    this.labelledLink = new LabelledLink(data.label, data.id);
                    this.type = data.type;
                }
            }
        }
        Sources.RelatedTo = RelatedTo;
        class Role extends ROElement {
            constructor(data) {
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
        Sources.Role = Role;
        class SourceItems extends ROElement {
            constructor(data) {
                super();
                if (data) {
                    this.labelledLink = new LabelledLink(data.sectionLabel, data.url);
                    this.totalItems = data.totalItems;
                    this.items = (data.items || []).map((item) => new Source(item));
                }
            }
        }
        Sources.SourceItems = SourceItems;
        class SourceType extends ROElement {
            constructor(data) {
                super();
                if (data) {
                    this.label = new Label(data.label);
                    this.type = data.type;
                }
            }
        }
        Sources.SourceType = SourceType;
        class SourceTypes extends ROElement {
            constructor(data) {
                super();
                if (data) {
                    this.recordType = new SourceType(data.recordType);
                    this.sourceType = new SourceType(data.sourceType);
                    this.contentTypes = (data.contentTypes || []).map((ct) => new ContentType(ct));
                }
            }
        }
        Sources.SourceTypes = SourceTypes;
        class Subjects extends ROElement {
            constructor(data) {
                super();
                if (data) {
                    this.sectionLabel = new Label(data.sectionLabel);
                    this.items = (data.items || []).map((item) => new SubjectsItem(item));
                }
            }
        }
        Sources.Subjects = Subjects;
        class SubjectsItem extends ROElement {
            constructor(data) {
                super();
                if (data) {
                    this.id = new URI(data.id);
                    this.type = data.type;
                    this.label = new Label(data.label);
                    this.value = data.value;
                }
            }
        }
        Sources.SubjectsItem = SubjectsItem;
        class SummaryItem extends ROElement {
            constructor(data) {
                super();
                if (data) {
                    this.label = new Label(data.label);
                    this.value = new SummaryValue(data.value);
                    this.type = data.type;
                }
            }
        }
        Sources.SummaryItem = SummaryItem;
        class SummaryValue extends I18n {
        }
        Sources.SummaryValue = SummaryValue;
        class Updated extends ROElement {
            constructor(data) {
                super();
                if (data) {
                    this.label = new Label(data.label);
                    this.value = data.value;
                }
            }
        }
        Sources.Updated = Updated;
    })(Sources || (Sources = {}));

    /////////////////////////////
    var Works;
    (function (Works) {
        class Work extends ROElement {
            constructor(data) {
                super();
                this.hide("id");
                this.hide("sources");
                if (data) {
                    this["@context"] = data["@context"];
                    this.labelledLink = new LabelledLink(data.label, data.id);
                    this.type = data.type;
                    this.creator = new Creator(data.creator);
                    this.summary = (data.summary || []).map((item) => new Summary(item));
                    this.partOf = new PartOf(data.partOf);
                    this.recordHistory = new RecordHistory(data.recordHistory);
                    this.incipits = new Incipits(data.incipits);
                    this.sources = new Sources(data.sources);
                    this.externalAuthorities = new ExternalAuthorities(data.externalAuthorities);
                    this.formOfWork = new FormOfWork(data.formOfWork);
                    this.relationships = new Relationships(data.relationships);
                    /*
                    this.sourceTypes = new SourceTypes(data.sourceTypes);
                    this.contents = new Contents(data.contents);
                    this.materialGroups = new MaterialGroups(data.materialGroups);
                    
                    this.referencesNotes = new ReferencesNotes(data.referencesNotes);
                    this.exemplars = new Exemplars(data.exemplars);
                    this.sourceItems = new SourceItems(data.sourceItems);
                    this.dates = new Dates(data.dates);
                    */
                }
            }
        }
        Works.Work = Work;
        /////
        class Created extends ROElement {
            constructor(data) {
                super();
                if (data) {
                    this.label = new Label(data.label);
                    this.value = data.value;
                }
            }
        }
        Works.Created = Created;
        class Creator extends ROElement {
            constructor(data) {
                super();
                if (data) {
                    this.role = new Role(data.role);
                    this.relatedTo = new RelatedTo(data.relatedTo);
                }
            }
        }
        Works.Creator = Creator;
        class Encodings extends ROElement {
            constructor(data) {
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
        Works.Encodings = Encodings;
        class ExternalAuthorities extends ROElement {
            constructor(data) {
                super();
                if (data) {
                    this.label = new Label(data.label);
                    this.items = (data.items || []).map((item) => new ExternalAuthoritiesItem(item));
                    this.type = data.type;
                }
            }
        }
        Works.ExternalAuthorities = ExternalAuthorities;
        class ExternalAuthoritiesItem extends ROElement {
            constructor(data) {
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
        Works.ExternalAuthoritiesItem = ExternalAuthoritiesItem;
        class FormOfWork extends ROElement {
            constructor(data) {
                super();
                if (data) {
                    this.sectionLabel = new Label(data.sectionLabel);
                    this.items = (data.items || []).map((item) => new FormOfWorkItem(item));
                    this.type = data.type;
                }
            }
        }
        Works.FormOfWork = FormOfWork;
        class FormOfWorkItem extends ROElement {
            constructor(data) {
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
        Works.FormOfWorkItem = FormOfWorkItem;
        class Incipits extends ROElement {
            constructor(data) {
                super();
                this.hide("id");
                if (data) {
                    this.id = new URI(data.id);
                    this.type = data.type;
                    this.sectionLabel = new Label(data.sectionLabel);
                    this.items = (data.items || []).map((item) => new IncipitsItem(item));
                }
            }
        }
        Works.Incipits = Incipits;
        class IncipitsItem extends ROElement {
            constructor(data) {
                super();
                this.hide("id");
                this.hide("properties");
                if (data) {
                    this.id = new URI(data.id);
                    this.type = data.type;
                    this.sectionLabel = new Label(data.sectionLabel);
                    this.label = new Label(data.label);
                    this.summary = (data.summary || []).map((item) => new IncipitSummary(item));
                    this.rendered = (data.rendered || []).map((item) => new Rendered(item));
                    this.encodings = (data.encodings || []).map((item) => new Encodings(item));
                    this.properties = new Properties(data.properties);
                    //this.heldBy = new RelatedTo(data.heldBy);
                }
            }
        }
        Works.IncipitsItem = IncipitsItem;
        class IncipitSummary extends ROElement {
            constructor(data) {
                super();
                if (data) {
                    this.label = new Label(data.label);
                    this.value = new I18n(data.value);
                    //this.value = new MaterialSummaryValue(data.value);
                    //this.type = data.type;
                }
            }
        }
        Works.IncipitSummary = IncipitSummary;
        class Item extends ROElement {
            constructor(data) {
                super();
                this.hide("relationshipType");
                if (data) {
                    this.relationshipType = data.relationshipType;
                    this.workNumber = data.workNumber;
                    this.relatedTo = new RelatedTo(data.relatedTo);
                }
            }
        }
        Works.Item = Item;
        class PAE extends ROElement {
            constructor(data) {
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
        Works.PAE = PAE;
        class PartOf extends ROElement {
            constructor(data) {
                super();
                this.hide("id");
                if (data) {
                    this.type = data.type;
                    this.label = new Label(data.label);
                    this.items = (data.items || []).map((item) => new Item(item));
                }
            }
        }
        Works.PartOf = PartOf;
        class Properties extends ROElement {
            constructor(data) {
                super();
                if (data) {
                    this.clef = data.clef;
                    this.keysig = data.keysig;
                    this.timesig = data.timesig;
                    this.notation = data.notation;
                }
            }
        }
        Works.Properties = Properties;
        class RecordHistory extends ROElement {
            constructor(data) {
                super();
                if (data) {
                    this.type = data.type;
                    this.created = new Created(data.created);
                    this.updated = new Updated(data.updated);
                }
            }
        }
        Works.RecordHistory = RecordHistory;
        class RelatedTo extends ROElement {
            constructor(data) {
                super();
                if (data) {
                    this.labelledLink = new LabelledLink(data.label, data.id);
                    this.type = data.type;
                    this.status = new Status(data.status);
                }
            }
        }
        Works.RelatedTo = RelatedTo;
        class Relationships extends ROElement {
            constructor(data) {
                super();
                if (data) {
                    this.sectionLabel = new Label(data.sectionLabel);
                    this.items = (data.items || []).map((item) => new RelationshipsItem(item));
                }
            }
        }
        Works.Relationships = Relationships;
        class RelationshipsItem extends ROElement {
            constructor(data) {
                super();
                if (data) {
                    this.role = new Role(data.role);
                    this.relatedTo = new RelatedTo(data.relatedTo);
                }
            }
        }
        Works.RelationshipsItem = RelationshipsItem;
        class Rendered extends ROElement {
            constructor(data) {
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
        Works.Rendered = Rendered;
        class Role extends ROElement {
            constructor(data) {
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
        Works.Role = Role;
        class Status extends ROElement {
            constructor(data) {
                super();
                this.hide("value");
                if (data) {
                    this.label = new Label(data.label);
                    this.value = data.value;
                }
            }
        }
        Works.Status = Status;
        class Sources extends ROElement {
            constructor(data) {
                super();
                this.hide("totalItems");
                if (data) {
                    this.url = new URI(data.url, data.totalItems.toString());
                    this.totalItems = data.totalItems;
                }
            }
        }
        Works.Sources = Sources;
        class Summary extends ROElement {
            constructor(data) {
                super();
                if (data) {
                    this.label = new Label(data.label);
                    this.value = new I18n(data.value);
                }
            }
        }
        Works.Summary = Summary;
        class Updated extends ROElement {
            constructor(data) {
                super();
                if (data) {
                    this.label = new Label(data.label);
                    this.value = data.value;
                }
            }
        }
        Works.Updated = Updated;
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
    })(Works || (Works = {}));

    class SourceRenderer {
        constructor(uri, containerId) {
            this.uri = uri;
            this.containerId = containerId;
        }
        async render(language = "en") {
            try {
                const response = await fetch(this.uri, {
                    headers: { Accept: "application/ld+json" },
                });
                const data = await response.json();
                const source = new Sources.Source(data);
                const container = document.getElementById(this.containerId);
                if (!container) {
                    console.error(`Container with ID "${this.containerId}" not found.`);
                    return;
                }
                container.appendChild(source.toHTML(language));
            }
            catch (error) {
                console.error("Failed to fetch or render JSON-LD:", error);
            }
        }
    }
    class WorkRenderer {
        constructor(uri, containerId) {
            this.uri = uri;
            this.containerId = containerId;
        }
        async render(language = "en") {
            try {
                const response = await fetch(this.uri, {
                    headers: { Accept: "application/ld+json" },
                });
                const data = await response.json();
                const work = new Works.Work(data);
                const container = document.getElementById(this.containerId);
                if (!container) {
                    console.error(`Container with ID "${this.containerId}" not found.`);
                    return;
                }
                container.appendChild(work.toHTML(language));
            }
            catch (error) {
                console.error("Failed to fetch or render JSON-LD:", error);
            }
        }
    }

    exports.SourceRenderer = SourceRenderer;
    exports.WorkRenderer = WorkRenderer;

    return exports;

})({});
