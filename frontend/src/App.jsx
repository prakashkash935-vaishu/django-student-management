import { useEffect, useState } from 'react'

const API = 'http://127.0.0.1:8000/api'

const emptyStudent = { name: '', email: '', phone: '', course: '' }
const emptyCourse = { name: '', duration: '', fee: '' }

function App() {
  const [students, setStudents] = useState([])
  const [courses, setCourses] = useState([])
  const [error, setError] = useState('')
  const [studentForm, setStudentForm] = useState(emptyStudent)
  const [studentEditId, setStudentEditId] = useState(null)
  const [courseForm, setCourseForm] = useState(emptyCourse)
  const [courseEditId, setCourseEditId] = useState(null)

  const loadData = async () => {
    try {
      const [s, c] = await Promise.all([
        fetch(`${API}/students/`).then((r) => r.json()),
        fetch(`${API}/courses/`).then((r) => r.json()),
      ])
      setStudents(s)
      setCourses(c)
    } catch {
      setError('Could not load data. Is the Django server running?')
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const courseName = (id) => courses.find((c) => c.id === id)?.name || '-'

  const save = async (path, id, data) => {
    const url = id ? `${API}/${path}/${id}/` : `${API}/${path}/`
    const res = await fetch(url, {
      method: id ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      setError(JSON.stringify(await res.json()))
      return false
    }
    setError('')
    return true
  }

  const remove = async (path, id) => {
    if (!window.confirm('Are you sure you want to delete?')) return
    await fetch(`${API}/${path}/${id}/`, { method: 'DELETE' })
    loadData()
  }

  const submitStudent = async (e) => {
    e.preventDefault()
    if (await save('students', studentEditId, studentForm)) {
      setStudentForm(emptyStudent)
      setStudentEditId(null)
      loadData()
    }
  }

  const submitCourse = async (e) => {
    e.preventDefault()
    if (await save('courses', courseEditId, courseForm)) {
      setCourseForm(emptyCourse)
      setCourseEditId(null)
      loadData()
    }
  }

  const editStudent = (s) => {
    setStudentForm({ name: s.name, email: s.email, phone: s.phone, course: s.course })
    setStudentEditId(s.id)
  }

  const editCourse = (c) => {
    setCourseForm({ name: c.name, duration: c.duration, fee: c.fee })
    setCourseEditId(c.id)
  }

  const input = { padding: 6, marginRight: 8, marginBottom: 8 }
  const table = { borderCollapse: 'collapse', marginBottom: 30 }

  return (
    <div style={{ fontFamily: 'Arial', margin: 40 }}>
      <h1>Student Course Management</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <h2>Courses</h2>
      <form onSubmit={submitCourse}>
        <input
          style={input}
          placeholder="Course name"
          required
          value={courseForm.name}
          onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })}
        />
        <input
          style={input}
          placeholder="Duration"
          required
          value={courseForm.duration}
          onChange={(e) => setCourseForm({ ...courseForm, duration: e.target.value })}
        />
        <input
          style={input}
          type="number"
          placeholder="Fee"
          required
          value={courseForm.fee}
          onChange={(e) => setCourseForm({ ...courseForm, fee: e.target.value })}
        />
        <button type="submit">{courseEditId ? 'Update Course' : 'Add Course'}</button>
        {courseEditId && (
          <button
            type="button"
            onClick={() => {
              setCourseForm(emptyCourse)
              setCourseEditId(null)
            }}
          >
            Cancel
          </button>
        )}
      </form>
      <table border="1" cellPadding="8" style={table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Duration</th>
            <th>Fee</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((c) => (
            <tr key={c.id}>
              <td>{c.name}</td>
              <td>{c.duration}</td>
              <td>{c.fee}</td>
              <td>
                <button onClick={() => editCourse(c)}>Edit</button>{' '}
                <button onClick={() => remove('courses', c.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Students</h2>
      <form onSubmit={submitStudent}>
        <input
          style={input}
          placeholder="Name"
          required
          value={studentForm.name}
          onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
        />
        <input
          style={input}
          type="email"
          placeholder="Email"
          required
          value={studentForm.email}
          onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
        />
        <input
          style={input}
          placeholder="Phone"
          required
          value={studentForm.phone}
          onChange={(e) => setStudentForm({ ...studentForm, phone: e.target.value })}
        />
        <select
          style={input}
          required
          value={studentForm.course}
          onChange={(e) => setStudentForm({ ...studentForm, course: e.target.value })}
        >
          <option value="">Select course</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <button type="submit">{studentEditId ? 'Update Student' : 'Add Student'}</button>
        {studentEditId && (
          <button
            type="button"
            onClick={() => {
              setStudentForm(emptyStudent)
              setStudentEditId(null)
            }}
          >
            Cancel
          </button>
        )}
      </form>
      <table border="1" cellPadding="8" style={table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Course</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.email}</td>
              <td>{s.phone}</td>
              <td>{courseName(s.course)}</td>
              <td>
                <button onClick={() => editStudent(s)}>Edit</button>{' '}
                <button onClick={() => remove('students', s.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default App