import { useState } from 'react'

export default function TaskList({ tasks, onUpdate, onDelete, loading }) {
  const [busyId, setBusyId] = useState(null)
  const [error, setError] = useState('')

  async function handleToggle(task) {
    setError('')
    setBusyId(task._id)

    try {
      await onUpdate(task._id, { completed: !task.completed })
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setBusyId(null)
    }
  }

  async function handleDelete(task) {
    setError('')
    setBusyId(task._id)

    try {
      await onDelete(task._id)
    } catch (requestError) {
      setError(requestError.message)
      setBusyId(null)
    }
  }

  if (loading) {
    return <p className="task-empty-state">Loading tasks...</p>
  }

  return (
    <div className="task-list" aria-live="polite">
      {error && <p className="task-error" role="alert">{error}</p>}

      {tasks.length === 0 ? (
        <p className="task-empty-state">No tasks yet. Add your first study task.</p>
      ) : (
        tasks.map((task) => (
          <article className={`task-item ${task.completed ? 'task-completed' : ''}`} key={task._id}>
            <label>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleToggle(task)}
                disabled={busyId === task._id}
              />
              <span>
                <strong>{task.title}</strong>
                <small>{task.description}</small>
              </span>
            </label>
            <button
              type="button"
              onClick={() => handleDelete(task)}
              disabled={busyId === task._id}
              aria-label={`Delete ${task.title}`}
            >
              Delete
            </button>
          </article>
        ))
      )}
    </div>
  )
}
