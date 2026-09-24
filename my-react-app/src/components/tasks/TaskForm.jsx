import { useState } from 'react'

export default function TaskForm({ onCreate, disabled = false }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    if (!title.trim() || !description.trim()) {
      setError('Title and description are required.')
      return
    }

    setSubmitting(true)

    try {
      await onCreate({
        title: title.trim(),
        description: description.trim(),
      })
      setTitle('')
      setDescription('')
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="task-form-heading">
        <h3>Study Tasks</h3>
        <span>Keep track of your work</span>
      </div>

      <input
        type="text"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Task title"
        maxLength={120}
        disabled={disabled || submitting}
        aria-label="Task title"
      />
      <textarea
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        placeholder="Task description"
        maxLength={2000}
        disabled={disabled || submitting}
        aria-label="Task description"
        rows={3}
      />

      {error && <p className="task-error" role="alert">{error}</p>}

      <button type="submit" disabled={disabled || submitting}>
        {submitting ? 'Adding...' : 'Add Task'}
      </button>
    </form>
  )
}
