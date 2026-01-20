/* 
  Parts of this file were generated with assistance from ChatGPT.
*/

(() => {
  "use strict";

  // Object Constructor for a Note (required)
  function Note(noteData, onChange, onRemove) {
    this.id = noteData.id;
    this.text = noteData.text;

    this.row = document.createElement("div");
    this.row.className = "note-row";

    this.textArea = document.createElement("textarea");
    this.textArea.className = "note-area";
    this.textArea.value = this.text;

    this.removeBtn = document.createElement("button");
    this.removeBtn.className = "btn-remove";
    this.removeBtn.textContent = USER_MSG.BTN_REMOVE;

    this.row.appendChild(this.textArea);
    this.row.appendChild(this.removeBtn);

    this.textArea.addEventListener("input", () => {
      this.text = this.textArea.value;
      onChange(this.id, this.text);
    });

    this.removeBtn.addEventListener("click", () => {
      onRemove(this.id);
    });
    //
    // They make the object self-contained (OOP) and keep WriterApp simpler???
    this.renderTo = (parent) => parent.appendChild(this.row);
    //???
    this.destroy = () => this.row.remove();
  }

  function WriterApp() {
    this.notes = [];       //{id, text}
    this.noteObjects = []; 

    this.container = document.getElementById("notesContainer");
    this.savedAtEl = document.getElementById("savedAt");
    this.btnAdd = document.getElementById("btnAdd");
    this.btnBack = document.getElementById("btnBack");

    this.btnAdd.textContent = USER_MSG.BTN_ADD;
    this.btnBack.textContent = USER_MSG.BTN_BACK;

    this.updateSavedAt = () => {
      const t = Lab1Storage.getLastSavedAt();
      this.savedAtEl.textContent = t ? `${USER_MSG.SAVED_AT}${t}` : `${USER_MSG.SAVED_AT}`;
    };


// refined and modified by ChatGPT, aving a method in an object
    this.syncSave = () => {
      const t = Lab1Storage.saveNotes(this.notes);
      this.savedAtEl.textContent = `${USER_MSG.SAVED_AT}${t}`;
    };

    this.findIndexById = (id) => this.notes.findIndex(n => n.id === id);

    this.onNoteChange = (id, newText) => {
      const idx = this.findIndexById(id);
      if (idx !== -1) this.notes[idx].text = newText;
    
    };

    this.onNoteRemove = (id) => {
      const idx = this.findIndexById(id);
      if (idx === -1) return;

      // remove from data
      this.notes.splice(idx, 1);

      // remove from DOM object list/ AI assitance has been used here
      const objIdx = this.noteObjects.findIndex(o => o.id === id);
      if (objIdx !== -1) {
        this.noteObjects[objIdx].destroy();
        this.noteObjects.splice(objIdx, 1);
      }

      // MUST remove instantly from localStorage
      this.syncSave();
    };

    this.addNote = () => {
      const newNote = {
        //generates a unique string ID for the note.
        id: crypto.randomUUID(),
        text: ""
      };
      this.notes.push(newNote);

      const noteObj = new Note(newNote, this.onNoteChange, this.onNoteRemove);
      this.noteObjects.push(noteObj);
      noteObj.renderTo(this.container);

      // optional: save right away so reader sees new empty note, (Chat GPT added this part)
      this.syncSave();
    };

    this.loadExisting = () => {
      this.notes = Lab1Storage.loadNotes();

      // build UI dynamically based on stored notes
      this.container.innerHTML = "";
      this.noteObjects = [];

      for (const n of this.notes) {
        const noteObj = new Note(n, this.onNoteChange, this.onNoteRemove);
        this.noteObjects.push(noteObj);
        noteObj.renderTo(this.container);
      }

      this.updateSavedAt();
    };

    this.startAutoSave = () => {
      // store notes every 2 seconds
      setInterval(() => {
        this.syncSave();
      }, 2000);
    };

    this.init = () => {
      this.loadExisting();
      this.btnAdd.addEventListener("click", this.addNote);
      this.startAutoSave();
    };
  }


  //ensure the DOM is fully loaded before accessing elements or initializing the application.(ChatGPT added this!)
  document.addEventListener("DOMContentLoaded", () => {
    const app = new WriterApp();
    app.init();
  });
})();
