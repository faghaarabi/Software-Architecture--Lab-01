

(() => {
  "use strict";

  function ReaderApp() {
    this.container = document.getElementById("readerContainer");
    this.updatedAtEl = document.getElementById("updatedAt");
    this.btnBack = document.getElementById("btnBack");
    this.btnBack.textContent = USER_MSG.BTN_BACK;

    this.render = (notes) => {
      this.container.innerHTML = "";

      if (!notes.length) {
        const p = document.createElement("p");
        p.textContent = USER_MSG.NO_NOTES;
        this.container.appendChild(p);
        return;
      }

      for (const n of notes) {
        const row = document.createElement("div");
        row.className = "note-row";

        const ta = document.createElement("textarea");
        ta.className = "note-area";
        ta.value = n.text;
        ta.readOnly = true;

        row.appendChild(ta);
        this.container.appendChild(row);
      }
    };

    this.pull = () => {
      const notes = Lab1Storage.loadNotes();
      this.render(notes);

      const t = Lab1Storage.nowTimeString();
      this.updatedAtEl.textContent = `${USER_MSG.UPDATED_AT}${t}`;
    };

    this.startPolling = () => {
      this.pull();
      setInterval(() => this.pull(), 2000);
    };
    // AI 
    // (ChatGPT) assitance has been used int this section
// “It listens for changes to localStorage made in other tabs and triggers a refresh when the notes key is updated.
    this.init = () => {
      this.startPolling();

      window.addEventListener("storage", (e) => {
        if (e.key === "lab1_notes") this.pull();
      });
    };
  }
// When the HTML page is fully loaded, create the Reader app and start it.”
  document.addEventListener("DOMContentLoaded", () => {
    const app = new ReaderApp();
    app.init();
  });
})();
