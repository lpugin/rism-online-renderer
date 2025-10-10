import { I18nData } from "./types";

export class ROElement {
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

export class URI extends ROElement {
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

export class I18n extends ROElement {
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

export class LabelledLink extends ROElement {
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

export function h(tag: string, attrs: Record<string, any> = {}, ...children: (string | Node | I18n)[]): Element {
    const el = document.createElement(tag);
    for (const [key, value] of Object.entries(attrs)) {
        if (key.startsWith('on') && typeof value === 'function') {
            el.addEventListener(key.slice(2).toLowerCase(), value);
        } else if (value != null) {
            el.setAttribute(key, String(value));
        }
    }
    for (const child of children) {
        if (child instanceof I18n) {
            el.append(document.createTextNode(child.get('en')));    
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
