import { useState, useEffect } from 'react'
import './App.css'

interface Todo {
  descripcion: string
  sinStock?: boolean
  ultimaActualizacion?: string
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
    localStorage.setItem('todoList', JSON.stringify(todoList))
  }, [todoList])

  const handleChange = (e: any) => {
    setTodoDescripcion(e.target.value)
  }

  const handleAdd = () => {
    if (todoDescripcion.trim() === '') return
    const newTodo: Todo = {
      descripcion: todoDescripcion,
      sinStock: false,
      ultimaActualizacion: undefined,
    }
    setTodoList([newTodo, ...todoList])
    setTodoDescripcion('')
  }

  const handleUpdate = () => {
    if (editIndex === null || todoDescripcion.trim() === '') return
    const updatedList = [...todoList]
    updatedList[editIndex].descripcion = todoDescripcion
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

  const handleMarkOutOfStock = () => {
    if (editIndex === null) return
    const updatedList = [...todoList]
    updatedList[editIndex].sinStock = true
    updatedList[editIndex].ultimaActualizacion = new Date().toLocaleString()
    updatedList.sort((a, b) => Number(a.sinStock) - Number(b.sinStock))
    setTodoList(updatedList)
    setEditIndex(null)
    setTodoDescripcion('')
  }

  const handleSelect = (index: number) => {
    setEditIndex(index)
    setTodoDescripcion(todoList[index].descripcion)
  }

  return (
    <div className="app-container">
      <h2 className="title">Gestión de Productos</h2>

      <div className="input-group">
        <input
          type='text'
          value={todoDescripcion}
          onChange={handleChange}
          placeholder='Nombre del producto'
          className="input"
        />
        <button onClick={handleAdd}>Agregar</button>
        <button onClick={handleUpdate}>Actualizar</button>
        <button onClick={handleRemove}>Eliminar</button>
        <button onClick={handleMarkOutOfStock} className="out-of-stock-btn">
          Sin Stock
        </button>
      </div>

      <h3 className="subtitle">Lista de productos:</h3>
      <ul className="product-list">
        {todoList.map((todo, index) => (
          <li
            key={index}
            onClick={() => handleSelect(index)}
            className={`product-item ${todo.sinStock ? 'sin-stock' : ''} ${editIndex === index ? 'selected' : ''}`}
          >
            <div>
              {todo.descripcion} {todo.sinStock ? '(Sin stock)' : ''}
            </div>
            {todo.sinStock && todo.ultimaActualizacion && (
              <div className="fecha-actualizacion">
                Última actualización: {todo.ultimaActualizacion}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
