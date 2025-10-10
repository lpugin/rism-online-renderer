import { I18n } from "./base";
import { Sources } from './sources';
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
function renderSource(source) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    return h('article', { class: 'source' }, h('h2', {}, (_b = (_a = source.labelledLink) === null || _a === void 0 ? void 0 : _a.label) !== null && _b !== void 0 ? _b : '(untitled)'), h('p', {}, h('strong', {}, 'Type:'), ' ', (_e = (_d = (_c = source.sourceTypes) === null || _c === void 0 ? void 0 : _c.sourceType) === null || _d === void 0 ? void 0 : _d.label) !== null && _e !== void 0 ? _e : '—'), h('p', {}, h('strong', {}, 'Date:'), ' ', (_g = (_f = source.dates) === null || _f === void 0 ? void 0 : _f.dateStatement) !== null && _g !== void 0 ? _g : '—'), h('a', { href: (_h = source.labelledLink) === null || _h === void 0 ? void 0 : _h.id }, 'View record'), renderExemplars(source.exemplars));
}
function renderExemplars(exemplars) {
    return null;
}
export class CustomSourceRenderer {
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
            const context = new Sources.Source(data);
            const container = document.getElementById(this.containerId);
            if (!container) {
                console.error(`Container with ID "${this.containerId}" not found.`);
                return;
            }
            container.appendChild(renderSource(context));
        }
        catch (error) {
            console.error("Failed to fetch or render JSON-LD:", error);
        }
    }
}
//# sourceMappingURL=custom.js.map