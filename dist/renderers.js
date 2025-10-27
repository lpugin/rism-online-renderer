import { Sources } from "./sources";
import { Works } from "./works";
export class SourceRenderer {
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
export class WorkRenderer {
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
//# sourceMappingURL=renderers.js.map