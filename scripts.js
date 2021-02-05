const notesCounterElement = document.querySelector('[data-notes-counter]')
const notesContainerElement = document.querySelector('[data-notes-container]')

const LOCAL_STORAGE_NAMESPACE = 'my-notes-app.notes'
let savedNotes = localStorage.getItem(LOCAL_STORAGE_NAMESPACE)
let notesArray = JSON.parse(savedNotes) || []

class NoteManager {
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

class Note {
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

function loadAllNotes() {
    if (notesArray.length < 1) renderNewNoteButton()
    const newNoteManager = new NoteManager(notesArray, notesContainerElement)
    newNoteManager.renderAllNotes()
}

function updateNotesCounter() {
    const numberOfNotes = notesArray.length
    if(numberOfNotes == 0) {
        notesCounterElement.innerText = 'You have no saved notes.'
        return
    }
    const countStringWord = numberOfNotes === 1 ? 'note' : 'notes'
    notesCounterElement.innerText = `You have ${numberOfNotes} ${countStringWord} saved.`
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

updateNotesCounter()
loadAllNotes()