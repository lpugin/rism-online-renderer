import { Sources } from "./sources";
import { SourceTypes } from "./types";

import { Works } from "./works";
import { WorkTypes } from "./types";

export class SourceRenderer {
  constructor(private uri: string, private containerId: string) { }

  async render(language: string = "en"): Promise<void> {
    try {
      const response = await fetch(this.uri, {
        headers: { Accept: "application/ld+json" },
      });
      const data = await response.json() as SourceTypes.SourceData;
      const source = new Sources.Source(data);
      const container = document.getElementById(this.containerId);

      if (!container) {
        console.error(`Container with ID "${this.containerId}" not found.`);
        return;
      }

      container.appendChild(source.toHTML(language));
    } catch (error) {
      console.error("Failed to fetch or render JSON-LD:", error);
    }
  }
}

export class WorkRenderer {
  constructor(private uri: string, private containerId: string) { }

  async render(language: string = "en"): Promise<void> {
    try {
      const response = await fetch(this.uri, {
        headers: { Accept: "application/ld+json" },
      });
      const data = await response.json() as WorkTypes.WorkData;
      const work = new Works.Work(data);
      const container = document.getElementById(this.containerId);

      if (!container) {
        console.error(`Container with ID "${this.containerId}" not found.`);
        return;
      }

      container.appendChild(work.toHTML(language));
    } catch (error) {
      console.error("Failed to fetch or render JSON-LD:", error);
    }
  }
}