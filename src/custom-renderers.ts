import { h } from "./base";
import { SourceTypes } from "./types";
import { Sources } from './sources'

function renderSource(source: Sources.Source): Element {
    return h('article', { class: 'source' },
        h('h2', {}, source.labelledLink?.label ?? '(untitled)'),
        h('p', {}, h('strong', {}, 'Type:'), ' ', source.sourceTypes?.sourceType?.label ?? '—'),
        h('p', {}, h('strong', {}, 'Date:'), ' ', source.dates?.dateStatement ?? '—'),
        h('a', { href: source.labelledLink?.id }, 'View record'),
        renderExemplars(source.exemplars)
    );
}

function renderExemplars(exemplars: Sources.ExemplarsItem): Element {
    return null;
}

export class CustomSourceRenderer {
    constructor(private uri: string, private containerId: string) { }

    async render(language: string = "en"): Promise<void> {
        try {
            const response = await fetch(this.uri, {
                headers: { Accept: "application/ld+json" },
            });
            const data = await response.json() as SourceTypes.SourceData;
            const context = new Sources.Source(data);

            const container = document.getElementById(this.containerId);

            if (!container) {
                console.error(`Container with ID "${this.containerId}" not found.`);
                return;
            }

            container.appendChild(renderSource(context));

        } catch (error) {
            console.error("Failed to fetch or render JSON-LD:", error);
        }
    }
}
