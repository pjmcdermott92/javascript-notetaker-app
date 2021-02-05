const notesCounterElement = document.querySelector('[data-notes-counter]')
const notesContainerElement = document.querySelector('[data-notes-container]')

const LOCAL_STORAGE_NAMESPACE = 'my-notes-app.notes'
let savedNotes = localStorage.getItem(LOCAL_STORAGE_NAMESPACE)
window.notesArray = JSON.parse(savedNotes) || []


import Note from './Note.js'

export default class NoteManager {
    constructor(notes, noteContainerElement) {
        this.notes = notes.map(note => new Note(note, this))
        this.noteContainerElement = noteContainerElement
    }

    renderAllNotes() {
        this.noteContainerElement.innerHTML = ''
        this.renderSingleNote()
        renderNewNoteButton()
        addGlobalEventListener(document, '[data-new-note-button]', 'click', e => {
            this.addNewNote()
        })
    }

    renderSingleNote() {
        this.notes.forEach(note => {
            let noteTemplate = Note.getNoteTemplate()
            noteTemplate = noteTemplate.replace('{{title}}', note.title)
            noteTemplate = noteTemplate.replace('{{content}}', note.content)
            const newNoteDiv = document.createElement('div')
            newNoteDiv.className = 'note'
            newNoteDiv.setAttribute('data-note-element', '')
            newNoteDiv.style = (`background-color: var(--${note.color}-note-color)`)
            newNoteDiv.innerHTML = noteTemplate
            this.noteContainerElement.appendChild(newNoteDiv)
            
            addGlobalEventListener(newNoteDiv, '[data-delete-note-button]', 'click', e => {
                note.deleteNote(note.id)
            })
            addGlobalEventListener(newNoteDiv, '[data-note-color-button]', 'click', e => {
                newNoteDiv.querySelector('.note-colors').classList.toggle('active')
                addGlobalEventListener(newNoteDiv, '.color', 'click', e => {
                    note.changeNoteColor(e.target.dataset.color, note.id)
                })
            })
            newNoteDiv.addEventListener('input', e => {
                if(e.target.className === 'note-title-section') {
                    note.updateNoteTitle(e, note.id)
                }
                if(e.target.className === 'note-content-section') {
                    note.updateNoteContent(e, note.id)
                }
            })
        })
    }

    addNewNote() {
        notesArray.push(
            {
                id: `note-${Date.now().toString()}`,
                title: '',
                content: '',
                color: 'default'
            }
        )
        loadAllNotes()
    }

    saveNotes() {
        localStorage.setItem(LOCAL_STORAGE_NAMESPACE, JSON.stringify(notesArray))
        updateNotesCounter()
    }
}

function renderNewNoteButton() {
    const newNoteButtonDiv = document.createElement('div')
    newNoteButtonDiv.classList.add('note')
    newNoteButtonDiv.classList.add('new-btn')
    newNoteButtonDiv.setAttribute('data-new-note-button', '')
    newNoteButtonDiv.innerHTML = `<i class="fa fa-plus add-note"></i>`
    notesContainerElement.appendChild(newNoteButtonDiv)
}

function addGlobalEventListener(scope, selector, type, callback) {
    scope.querySelectorAll(selector).forEach(selector => {
        selector.addEventListener(type, callback)
    })
}

export function loadAllNotes() {
    if (notesArray.length < 1) renderNewNoteButton()
    const newNoteManager = new NoteManager(notesArray, notesContainerElement)
    newNoteManager.renderAllNotes()
}

export function updateNotesCounter() {
    const numberOfNotes = notesArray.length
    if(numberOfNotes == 0) {
        notesCounterElement.innerText = 'You have no saved notes.'
        return
    }
    const countStringWord = numberOfNotes === 1 ? 'note' : 'notes'
    notesCounterElement.innerText = `You have ${numberOfNotes} ${countStringWord} saved.`
}