import { useState,  useEffect} from 'react'
import './App.css'

interface Todo {
  descripcion: string
}

function App() {
  const [todoDescripcion, setTodoDescripcion] = useState('')
  const [todoList, setTodoList] = useState<Todo[]>([])
  const [editIndex, setEditIndex] = useState<number | null>(null)

  useEffect(() => {
    const storedList = localStorage.getItem('todoList')
    if (storedList) {
      setTodoList(JSON.parse(storedList) as Todo[]) 
    }
  }, [])


  useEffect(() => {
    if (todoList.length > 0) {
      localStorage.setItem('todoList', JSON.stringify(todoList)) 
    }
  }, [todoList]) 

  const handleChange = (e: any) => {
    setTodoDescripcion(e.target.value)
  }

  const handleAdd = () => {
    if (todoDescripcion.trim() === '') return
    const newTodo = { descripcion: todoDescripcion }
    setTodoList([newTodo, ...todoList])
    setTodoDescripcion('')
  }

  const handleUpdate = () => {
    if (editIndex === null || todoDescripcion.trim() === '') return
    const updatedList = [...todoList]
    updatedList[editIndex] = { descripcion: todoDescripcion }
    setTodoList(updatedList)
    setEditIndex(null)
    setTodoDescripcion('')
  }

  const handleRemove = () => {
    if (editIndex === null) return
    const updatedList = [...todoList]
    updatedList.splice(editIndex, 1)
    setTodoList(updatedList)
    setEditIndex(null)
    setTodoDescripcion('')
  }

  const handleSelect = (index: number) => {
    setEditIndex(index)
    setTodoDescripcion(todoList[index].descripcion)
  }

  return (
    <div style={{ border: '1px solid black', padding: '10px' }}>
      <div>
        <input
          type='text'
          value={todoDescripcion}
          onChange={handleChange}
          style={{ marginRight: 10 }}
        />
        <button onClick={handleAdd}>Add Product</button>
        <button onClick={handleUpdate}>Update Product</button>
        <button onClick={handleRemove}>Remove Product</button>
      </div>

      <div>Products Here:</div>
      <ul>
        {todoList.map((todo, index) => {
          return (
            <li
              key={index}
              onClick={() => handleSelect(index)}
              style={{
                cursor: 'pointer',
                fontWeight: editIndex === index ? 'bold' : 'normal',
              }}
            >
              {todo.descripcion}
            </li>
          )
        })}
      </ul>
      </div>
  )
}

export default App