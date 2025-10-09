var RISMOnline = (function (exports) {
    'use strict';

    class Renderer {
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
                const context = new Source(data);
                const container = document.getElementById(this.containerId);
                if (!container) {
                    console.error(`Container with ID "${this.containerId}" not found.`);
                    return;
                }
                container.appendChild(context.toHTML(language));
            }
            catch (error) {
                console.error("Failed to fetch or render JSON-LD:", error);
            }
        }
    }
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
        constructor(link) {
            super();
            this.link = link;
        }
        toHTML() {
            const a = document.createElement("a");
            a.textContent = this.link;
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
            return (this.has(language) ? this.map[language] : "");
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
                langContainer.textContent = this.get(lang);
                container.appendChild(langContainer);
            }
            return container;
        }
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
    /////////////////////////////
    class SourceLabel extends I18n {
    }
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
    /////
    class ContentType extends ROElement {
        constructor(data) {
            super();
            if (data) {
                this.label = new I18n(data.label);
                this.type = data.type;
            }
        }
    }
    class Contents extends ROElement {
        constructor(data) {
            super();
            if (data) {
                this.sectionLabel = new I18n(data.sectionLabel);
                this.summary = (data.summary || []).map((item) => new SummaryItem(item));
                this.subjects = new Subjects(data.subjects);
            }
        }
    }
    class Creator extends ROElement {
        constructor(data) {
            super();
            if (data) {
                this.role = new Role(data.role);
                this.relatedTo = new RelatedTo(data.relatedTo);
            }
        }
    }
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
    class Exemplars extends ROElement {
        constructor(data) {
            super();
            this.hide("id");
            if (data) {
                this.id = new URI(data.id);
                this.type = data.type;
                this.sectionLabel = new I18n(data.sectionLabel);
                this.items = (data.items || []).map((item) => new ExemplarsItem(item));
            }
        }
    }
    class ExemplarsItem extends ROElement {
        constructor(data) {
            super();
            this.hide("id");
            if (data) {
                this.id = new URI(data.id);
                this.type = data.type;
                this.sectionLabel = new I18n(data.sectionLabel);
                this.label = new I18n(data.label);
                this.summary = (data.summary || []).map((item) => new MaterialSummary(item));
                this.notes = (data.notes || []).map((note) => new NotesItem(note));
                this.heldBy = new RelatedTo(data.heldBy);
            }
        }
    }
    class MaterialGroupItem extends ROElement {
        constructor(data) {
            super();
            if (data) {
                this.label = new I18n(data.label);
                this.summary = (data.summary || []).map((item) => new MaterialSummary(item));
            }
        }
    }
    class MaterialGroups extends ROElement {
        constructor(data) {
            super();
            if (data) {
                this.sectionLabel = new I18n(data.sectionLabel);
                this.items = (data.items || []).map((item) => new MaterialGroupItem(item));
            }
        }
    }
    class MaterialSummary extends ROElement {
        constructor(data) {
            super();
            if (data) {
                this.label = new I18n(data.label);
                this.value = new MaterialSummaryValue(data.value);
                this.type = data.type;
            }
        }
    }
    class MaterialSummaryValue extends I18n {
    }
    class NotesItem extends ROElement {
        constructor(data) {
            super();
            if (data) {
                this.label = new I18n(data.label);
                this.value = new NotesItemValue(data.value);
            }
        }
    }
    class NotesItemValue extends I18n {
    }
    class RecordHistory extends ROElement {
        constructor(data) {
            super();
            if (data) {
                this.type = data.type;
                this.createdLabel = new I18n(data.createdLabel);
                this.updatedLabel = new I18n(data.updatedLabel);
                this.created = data.created;
                this.updated = data.updated;
            }
        }
        toHTML(lang) {
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
        constructor(data) {
            super();
            if (data) {
                this.sectionLabel = new I18n(data.sectionLabel);
                this.type = data.type;
                this.notes = (data.notes || []).map((note) => new NotesItem(note));
            }
        }
    }
    class Relationships extends ROElement {
        constructor(data) {
            super();
            if (data) {
                this.sectionLabel = new I18n(data.sectionLabel);
                this.items = (data.items || []).map((item) => new RelationshipsItem(item));
            }
        }
    }
    class RelationshipsItem extends ROElement {
        constructor(data) {
            super();
            if (data) {
                this.role = new Role(data.role);
                this.relatedTo = new RelatedTo(data.relatedTo);
            }
        }
    }
    class RelatedTo extends ROElement {
        constructor(data) {
            super();
            if (data) {
                this.labelledLink = new LabelledLink(data.label, data.id);
                this.type = data.type;
            }
        }
    }
    class Role extends ROElement {
        constructor(data) {
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
        constructor(data) {
            super();
            if (data) {
                this.labelledLink = new LabelledLink(data.sectionLabel, data.url);
                this.totalItems = data.totalItems;
                this.items = (data.items || []).map((item) => new Source(item));
            }
        }
    }
    class SourceType extends ROElement {
        constructor(data) {
            super();
            if (data) {
                this.label = new I18n(data.label);
                this.type = data.type;
            }
        }
    }
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
    class Subjects extends ROElement {
        constructor(data) {
            super();
            if (data) {
                this.sectionLabel = new I18n(data.sectionLabel);
                this.items = (data.items || []).map((item) => new SubjectsItem(item));
            }
        }
    }
    class SubjectsItem extends ROElement {
        constructor(data) {
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
        constructor(data) {
            super();
            if (data) {
                this.label = new I18n(data.label);
                this.value = new SummaryValue(data.value);
                this.type = data.type;
            }
        }
    }
    class SummaryValue extends I18n {
    }

    exports.Renderer = Renderer;

    return exports;

})({});
