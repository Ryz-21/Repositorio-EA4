import { useState, useEffect } from 'react'
import './App.css'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

function App() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [deletingUser, setDeletingUser] = useState(null)
  const [error, setError] = useState('')
  const [formErrors, setFormErrors] = useState({})
  const [form, setForm] = useState({
    nombre: '', apePaterno: '', apeMaterno: '',
    user: '', password: '', estado: 'activo'
  })

  useEffect(() => {
    fetchUsers()
  }, [])

  async function fetchUsers() {
    try {
      const res = await fetch(`${API}/usuarios`)
      if (!res.ok) throw new Error('Error al cargar usuarios')
      setUsers(await res.json())
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    if (formErrors[e.target.name]) {
      setFormErrors(prev => ({ ...prev, [e.target.name]: '' }))
    }
  }

  function openCreate() {
    setEditingUser(null)
    setForm({ nombre: '', apePaterno: '', apeMaterno: '', user: '', password: '', estado: 'activo' })
    setFormErrors({})
    setShowForm(true)
  }

  function openEdit(user) {
    setEditingUser(user)
    setForm({
      nombre: user.nombre, apePaterno: user.apePaterno,
      apeMaterno: user.apeMaterno, user: user.user,
      password: '', estado: user.estado
    })
    setFormErrors({})
    setShowForm(true)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setFormErrors({})

    const isEdit = !!editingUser
    const url = `${API}/usuarios${isEdit ? `/${editingUser.id}` : ''}`
    const method = isEdit ? 'PUT' : 'POST'

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })

      const body = await res.json().catch(() => null)

      if (!res.ok) {
        if (body && body.errors) {
          setFormErrors(body.errors)
          const first = Object.values(body.errors).flat()[0]
          throw new Error(first || 'Error de validación')
        }
        throw new Error(body?.message || 'Error al guardar')
      }

      if (isEdit) {
        setUsers(prev => prev.map(u => u.id === editingUser.id ? body : u))
      } else {
        setUsers(prev => [...prev, body])
      }
      setShowForm(false)
    } catch (e) {
      setError(e.message)
    }
  }

  async function confirmDelete() {
    if (!deletingUser) return

    try {
      const res = await fetch(`${API}/usuarios/${deletingUser.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Error al eliminar')
      setUsers(prev => prev.filter(u => u.id !== deletingUser.id))
      setDeletingUser(null)
    } catch (e) {
      setError(e.message)
      setDeletingUser(null)
    }
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <span className="header-brand">bd_ventas</span>
          <span className="header-label">Usuarios</span>
        </div>
      </header>

      <main className="main">
        <div className="toolbar">
          <div>
            <h1 className="page-title">Usuarios</h1>
            <p className="page-desc">Gestiona los accesos al sistema de ventas</p>
          </div>
          <button className="btn btn-primary" onClick={openCreate}>+ Nuevo usuario</button>
        </div>

        {error && <div className="error-msg" onClick={() => setError('')}>{error}</div>}

        <div className="card">
          {loading ? (
            <p className="loading">Cargando usuarios…</p>
          ) : users.length === 0 ? (
            <div className="empty">
              <p>Aún no hay usuarios registrados.</p>
              <button className="btn btn-primary" onClick={openCreate}>Agregar el primero</button>
            </div>
          ) : (
            <div className="table-wrap">
              <table className="user-table">
                <thead>
                  <tr>
                    <th>Nombre completo</th>
                    <th>Usuario</th>
                    <th>Estado</th>
                    <th className="col-actions">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td className="cell-name">
                        <span className="name-text">{user.nombre} {user.apePaterno} {user.apeMaterno}</span>
                      </td>
                      <td className="cell-user">
                        <span className="user-mono">{user.user}</span>
                      </td>
                      <td>
                        <span className={`status-dot ${user.estado === 'activo' ? 'active' : 'inactive'}`}>
                          {user.estado === 'activo' ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="col-actions">
                        <button className="btn-icon btn-edit" onClick={() => openEdit(user)} title="Editar usuario">
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M11.5 1.5L14.5 4.5L5.5 13.5L2 14L2.5 10.5L11.5 1.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>
                        </button>
                        <button className="btn-icon btn-delete" onClick={() => setDeletingUser(user)} title="Eliminar usuario">
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 4H13M6 4V2.5C6 2.22386 6.22386 2 6.5 2H9.5C9.77614 2 10 2.22386 10 2.5V4M5.5 7V11.5M10.5 7V11.5M3.5 4L4.5 13.5C4.5 13.7761 4.72386 14 5 14H11C11.2761 14 11.5 13.7761 11.5 13.5L12.5 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="table-count">{users.length} usuario{users.length !== 1 ? 's' : ''} registrado{users.length !== 1 ? 's' : ''}</p>
            </div>
          )}
        </div>
      </main>

      {showForm && (
        <div className="overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2 className="modal-title">{editingUser ? 'Editar usuario' : 'Nuevo usuario'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className={`form-group ${formErrors.nombre ? 'has-error' : ''}`}>
                  <label htmlFor="nombre">Nombre</label>
                  <input id="nombre" name="nombre" value={form.nombre} onChange={handleChange} required />
                  {formErrors.nombre && <span className="field-error">{formErrors.nombre[0]}</span>}
                </div>
                <div className={`form-group ${formErrors.apePaterno ? 'has-error' : ''}`}>
                  <label htmlFor="apePaterno">Apellido paterno</label>
                  <input id="apePaterno" name="apePaterno" value={form.apePaterno} onChange={handleChange} required />
                  {formErrors.apePaterno && <span className="field-error">{formErrors.apePaterno[0]}</span>}
                </div>
              </div>
              <div className="form-row">
                <div className={`form-group ${formErrors.apeMaterno ? 'has-error' : ''}`}>
                  <label htmlFor="apeMaterno">Apellido materno</label>
                  <input id="apeMaterno" name="apeMaterno" value={form.apeMaterno} onChange={handleChange} required />
                  {formErrors.apeMaterno && <span className="field-error">{formErrors.apeMaterno[0]}</span>}
                </div>
                <div className={`form-group ${formErrors.user ? 'has-error' : ''}`}>
                  <label htmlFor="user">Usuario</label>
                  <input id="user" name="user" value={form.user} onChange={handleChange} required />
                  {formErrors.user && <span className="field-error">{formErrors.user[0]}</span>}
                </div>
              </div>
              <div className="form-row">
                <div className={`form-group ${formErrors.password ? 'has-error' : ''}`}>
                  <label htmlFor="password">{editingUser ? 'Nueva contraseña (dejar vacío para mantener)' : 'Contraseña'}</label>
                  <input id="password" name="password" type="password" value={form.password} onChange={handleChange} required={!editingUser} />
                  {formErrors.password && <span className="field-error">{formErrors.password[0]}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="estado">Estado</label>
                  <select id="estado" name="estado" value={form.estado} onChange={handleChange}>
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                  </select>
                </div>
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setShowForm(false)}>Cancelar</button>
                <button type="submit" className="btn btn-accent">
                  {editingUser ? 'Guardar cambios' : 'Registrar usuario'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deletingUser && (
        <div className="overlay" onClick={() => setDeletingUser(null)}>
          <div className="modal modal-sm" onClick={e => e.stopPropagation()}>
            <h2 className="modal-title">¿Eliminar usuario?</h2>
            <p className="modal-desc">
              Se eliminará a <strong>{deletingUser.nombre} {deletingUser.apePaterno}</strong> ({deletingUser.user}). Esta acción no se puede deshacer.
            </p>
            <div className="form-actions">
              <button className="btn btn-ghost" onClick={() => setDeletingUser(null)}>Cancelar</button>
              <button className="btn btn-danger" onClick={confirmDelete}>Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
