var RISMOnlineCustom = (function (exports) {
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
            container.className = "ro-" + this.constructor.name.toLowerCase();
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
            container.className = "ro-" + this.constructor.name.toLowerCase();
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
            container.className = "ro-" + this.constructor.name.toLowerCase();
            const a = this.id.toHTML();
            a.textContent = "";
            a.appendChild(this.label.toHTML(lang));
            container.appendChild(a);
            return container;
        }
    }
    function h(tag, attrs = {}, ...children) {
        const el = document.createElement(tag);
        for (const [key, value] of Object.entries(attrs)) {
            if (key.startsWith('on') && typeof value === 'function') {
                el.addEventListener(key.slice(2).toLowerCase(), value);
            }
            else if (value != null) {
                el.setAttribute(key, String(value));
            }
        }
        for (const child of children) {
            if (child instanceof I18n) {
                el.append(document.createTextNode(child.get('en').join()));
            }
            else if (child instanceof Node) {
                el.append(child);
            }
            else if (child !== null) {
                el.append(document.createTextNode(child));
            }
        }
        return el;
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

    function renderSource(source) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        return h('article', { class: 'source' }, h('h2', {}, (_b = (_a = source.labelledLink) === null || _a === void 0 ? void 0 : _a.label) !== null && _b !== void 0 ? _b : '(untitled)'), h('p', {}, h('strong', {}, 'Type:'), ' ', (_e = (_d = (_c = source.sourceTypes) === null || _c === void 0 ? void 0 : _c.sourceType) === null || _d === void 0 ? void 0 : _d.label) !== null && _e !== void 0 ? _e : '—'), h('p', {}, h('strong', {}, 'Date:'), ' ', (_g = (_f = source.dates) === null || _f === void 0 ? void 0 : _f.dateStatement) !== null && _g !== void 0 ? _g : '—'), h('a', { href: (_h = source.labelledLink) === null || _h === void 0 ? void 0 : _h.id }, 'View record'), renderExemplars(source.exemplars));
    }
    function renderExemplars(exemplars) {
        return null;
    }
    class CustomSourceRenderer {
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
                container.appendChild(renderSource(source));
            }
            catch (error) {
                console.error("Failed to fetch or render JSON-LD:", error);
            }
        }
    }

    exports.CustomSourceRenderer = CustomSourceRenderer;

    return exports;

})({});
