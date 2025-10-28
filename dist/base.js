export class ROElement {
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
                    else {
                        //console.log(item);
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
export class URI extends ROElement {
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
export class I18n extends ROElement {
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
export class Label extends I18n {
}
export class LabelledLink extends ROElement {
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
export class Data extends ROElement {
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
export function h(tag, attrs = {}, ...children) {
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
//# sourceMappingURL=base.js.map