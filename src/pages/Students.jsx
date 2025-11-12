import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Trash2, Edit, User, Search } from 'lucide-react'
import { getStudents, deleteStudent } from '../lib/database'
import StudentModal from '../components/StudentModal'

export default function Students() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    loadStudents()
  }, [])

  const loadStudents = async () => {
    try {
      const data = await getStudents()
      setStudents(data)
    } catch (error) {
      console.error('Error loading students:', error)
      alert('Failed to load students')
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = () => {
    setSelectedStudent(null)
    setModalOpen(true)
  }

  const handleEdit = (student) => {
    setSelectedStudent(student)
    setModalOpen(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this student?')) return
    
    try {
      await deleteStudent(id)
      loadStudents()
    } catch (error) {
      console.error('Error deleting student:', error)
      alert('Failed to delete student')
    }
  }

  const handleSave = () => {
    setModalOpen(false)
    setSelectedStudent(null)
    loadStudents()
  }

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (student.email && student.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (student.phone && student.phone.includes(searchTerm))
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Students</h2>
          <p className="text-gray-600 mt-1">Manage all your soccer school students</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl transition-all shadow-lg hover:shadow-xl font-semibold"
        >
          <Plus size={20} />
          <span>Add Student</span>
        </button>
      </div>

      {/* Search */}
      {students.length > 0 && (
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
            />
          </div>
        </div>
      )}

      {/* Students Grid */}
      {filteredStudents.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
          <User size={64} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-400 text-lg font-medium">
            {searchTerm ? 'No matching students found' : 'No students yet'}
          </p>
          {!searchTerm && (
            <p className="text-gray-400 text-sm mt-2">Click "Add Student" to get started</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStudents.map((student) => (
            <div
              key={student.id}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100 cursor-pointer group"
              onClick={() => navigate(`/students/${student.id}`)}
            >
              <div className="flex items-start space-x-4">
                {student.picture ? (
                  <img
                    src={student.picture}
                    alt={student.name}
                    className="w-20 h-20 rounded-full object-cover ring-4 ring-gray-100 group-hover:ring-green-200 transition-all"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center ring-4 ring-gray-100 group-hover:ring-green-200 transition-all">
                    <User size={40} className="text-white" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 text-lg mb-1 truncate">{student.name}</h3>
                  {student.age && (
                    <p className="text-sm text-gray-500 mb-2">Age: {student.age}</p>
                  )}
                  {student.payment_status && (
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        student.payment_status === 'paid'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {student.payment_status === 'paid' ? '✓ Paid' : 'Pending'}
                    </span>
                  )}
                </div>
                <div className="flex flex-col space-y-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleEdit(student)
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete(student.id)
                    }}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <StudentModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setSelectedStudent(null)
        }}
        onSave={handleSave}
        student={selectedStudent}
      />
    </div>
  )
}
