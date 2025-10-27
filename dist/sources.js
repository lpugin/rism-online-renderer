import { I18n, Label, LabelledLink, ROElement, URI } from './base';
/////////////////////////////
export var Sources;
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
//# sourceMappingURL=sources.js.map