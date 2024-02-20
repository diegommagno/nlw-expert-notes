import logo from './assets/logo-nlw-expert.svg'
import { NewNoteCard } from './components/new-note-card'
import { NoteCard } from './components/note-card'
import { ChangeEvent, useState } from 'react'

interface Note {
  id: string
  date: Date
  content: string
}

export function App() {
  const [search, setSearch] = useState('')
  const [notes, setNotes] = useState<Note[]>(() => {
    const notesOnStorage = localStorage.getItem('notes');	// Vou ver se no localStorage tenho um item chamado notes

    if (notesOnStorage) {
      return JSON.parse(notesOnStorage) // Se tiver, retorno o que está no localStorage
    }

    return []
  }) // Falo para o react que esse array vai ser um array de objetos com o formato descrito dentro de Note.
  // Isso era um [], agora é uma função retornando um array para não sempre iniciar vazio, e sim utilizar o que está no localStorage se não for vazio.

  function onNoteCreated(content: string) {
    const newNote = {
      id: crypto.randomUUID(),
      date: new Date(),
      content,
    }

    const notesArray = [newNote, ...notes]

    setNotes(notesArray)

    localStorage.setItem('notes', JSON.stringify(notesArray)) // Converter o array em texto porque o localStorage não aceita arrays
  }

  function onNoteDeleted(id: string) {
    const notesArray = notes.filter(note => {
      return note.id !== id
    })

    setNotes(notesArray)

    localStorage.setItem('notes', JSON.stringify(notesArray)) 
  }

  function handleSearch(event: ChangeEvent<HTMLInputElement>) {
    const query = event.target.value

    setSearch(query)
  }

  const filteredNotes = search !== ''
    ? notes.filter(note => note.content.toLocaleLowerCase().includes(search.toLocaleLowerCase()))
    : notes

  return (
    <div className="mx-auto max-w-6xl my-12 space-y-6 px-5">
      <img src={logo} alt='NLW Expert'/>
      
      <form className='w-full'>
        <input 
          type="text" 
          placeholder='Search in your notes...' 
          className='w-full bg-transparent text-3xl font-semibold tracking-tight outline-none placeholder: text-slate-500'
          onChange={handleSearch}
        />
      </form>
      
      <div className='h-px bg-slate-700'/>

      <div className="grid grid-col-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[250px]">
        <NewNoteCard onNoteCreated={onNoteCreated}/>

        {filteredNotes.map(note => {
          return <NoteCard key={note.id} note={note} onNoteDeleted={onNoteDeleted} />
        })}
      </div>
    </div>
  )
}