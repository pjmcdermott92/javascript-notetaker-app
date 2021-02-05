import { loadAllNotes } from './NoteManager.js'

export default class Note {
    constructor({id, title, content, color}, noteManager) {
        this.id = id
        this.title = title
        this.content = content
        this.color = color
        this.noteManager = noteManager
    }

    static getNoteTemplate() {
        return `
            <div class="note-title-section" contenteditable>
                {{title}}
            </div>
            <div class="note-content-section" contenteditable>
                {{content}}
            </div>
            <div class="note-color-btn" data-note-color-button><i class="fas fa-palette"></i></div>
            <div class="delete-note-btn" data-delete-note-button><i class="fa fa-trash"></i></div>
            <div class="note-colors">
                <div class="color default" data-color="default"></div>
                <div class="color green" data-color="green"></div>
                <div class="color red" data-color="red"></div>
                <div class="color blue" data-color="blue"></div>
                <div class="color purple" data-color="purple"></div>
            </div>
        `
    }

    updateNoteTitle(event, noteId) {
        const currentNote = notesArray.find(note => note.id === noteId)
        currentNote.title = event.target.innerText
        this.noteManager.saveNotes()
    }

    updateNoteContent(event, noteId) {
        const currentNote = notesArray.find(note => note.id === noteId)
        currentNote.content = event.target.innerHTML
        this.noteManager.saveNotes()
    }

    changeNoteColor(color, noteId) {
        const currentNote = notesArray.find(note => note.id === noteId)
        currentNote.color = color
        loadAllNotes()
        this.checkIfNoteIsBlank(noteId)
    }

    deleteNote(noteId) {
        const workingNotes = notesArray
        const currentNote = workingNotes.find(note => note.id === noteId)
        const currentNoteIndex = workingNotes.indexOf(currentNote)
        workingNotes.splice(currentNoteIndex, 1)
        const updatedNotes = workingNotes.filter(note => note.title.length >= 1 || note.content.length >= 1)
        notesArray = updatedNotes
        loadAllNotes()
        this.noteManager.saveNotes()
    }

    checkIfNoteIsBlank(noteId) {
        const currentNote = notesArray.filter(note => note.id === noteId)
        if (currentNote[0].title.length > 1 || currentNote[0].content.length > 1) {
            this.noteManager.saveNotes()
        }
    }
}