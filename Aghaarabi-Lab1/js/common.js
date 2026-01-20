/* 
  Parts of this file were generated with assistance from ChatGPT.
*/

(() => {
  "use strict";

  const STORAGE_KEY = "lab1_notes";
  const SAVED_AT_KEY = "lab1_saved_at";

  function nowTimeString() {
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  }

  function loadNotes() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    //AI suggested checking if parsed info is an array as it could be anything 
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function saveNotes(notesArray) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notesArray));
    const t = nowTimeString();
    localStorage.setItem(SAVED_AT_KEY, t);
    return t;
  }

  function getLastSavedAt() {
    return localStorage.getItem(SAVED_AT_KEY) || "";
  }

  
  window.Lab1Storage = Object.freeze({
    loadNotes,
    saveNotes,
    getLastSavedAt,
    nowTimeString
  });
})();
