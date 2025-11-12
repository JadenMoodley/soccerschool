import { useState, useEffect } from 'react'
import { Plus, Trash2, Edit, Star, Search, Calendar } from 'lucide-react'
import { format } from 'date-fns'
import { getSessions, deleteSession, getStudents, getTrainingPlans } from '../lib/database'
import SessionModal from '../components/SessionModal'

export default function Sessions() {
  const [sessions, setSessions] = useState([])
  const [students, setStudents] = useState([])
  const [trainingPlans, setTrainingPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedSession, setSelectedSession] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [sessionsData, studentsData, plansData] = await Promise.all([
        getSessions(),
        getStudents(),
        getTrainingPlans(),
      ])
      setSessions(sessionsData)
      setStudents(studentsData)
      setTrainingPlans(plansData)
    } catch (error) {
      console.error('Error loading data:', error)
      alert('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = () => {
    setSelectedSession(null)
    setModalOpen(true)
  }

  const handleEdit = (session) => {
    setSelectedSession(session)
    setModalOpen(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this session?')) return
    
    try {
      await deleteSession(id)
      loadData()
    } catch (error) {
      console.error('Error deleting session:', error)
      alert('Failed to delete session')
    }
  }

  const getStudentName = (studentId) => {
    const student = students.find(s => s.id === studentId)
    return student ? student.name : 'Unknown'
  }

  const getWeekNumber = (date) => {
    const sessionDate = new Date(date)
    const today = new Date()
    const diffTime = Math.abs(today - sessionDate)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return Math.floor(diffDays / 7) + 1
  }

  const filteredSessions = sessions.filter((session) => {
    const studentName = getStudentName(session.student_id).toLowerCase()
    const planName = (session.training_plan || '').toLowerCase()
    return (
      studentName.includes(searchTerm.toLowerCase()) ||
      planName.includes(searchTerm.toLowerCase())
    )
  })

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
          <h2 className="text-3xl font-bold text-gray-900">Training Sessions</h2>
          <p className="text-gray-600 mt-1">Track all training sessions and progress</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl transition-all shadow-lg hover:shadow-xl font-semibold"
        >
          <Plus size={20} />
          <span>Add Session</span>
        </button>
      </div>

      {/* Search */}
      {sessions.length > 0 && (
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by student or training plan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
            />
          </div>
        </div>
      )}

      {/* Sessions List */}
      {filteredSessions.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
          <Calendar size={64} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-400 text-lg font-medium">
            {searchTerm ? 'No matching sessions found' : 'No sessions yet'}
          </p>
          {!searchTerm && (
            <p className="text-gray-400 text-sm mt-2">Click "Add Session" to get started</p>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredSessions.map((session) => {
            const weekNumber = getWeekNumber(session.date)
            return (
              <div
                key={session.id}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center flex-wrap gap-3 mb-3">
                      <h3 className="font-bold text-gray-900 text-xl">
                        {getStudentName(session.student_id)}
                      </h3>
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                        Week {weekNumber}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-500 mb-3">
                      <Calendar size={16} className="mr-2" />
                      <span>{format(new Date(session.date), 'MMM dd, yyyy')}</span>
                    </div>
                    {session.training_plan && (
                      <p className="text-sm text-gray-600 mb-3 bg-gray-50 px-3 py-2 rounded-lg inline-block">
                        📋 {session.training_plan}
                      </p>
                    )}
                    {session.rating > 0 && (
                      <div className="flex items-center space-x-1 mb-3">
                        <span className="text-sm text-gray-600 mr-2">Rating:</span>
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={18}
                            className={i < session.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                          />
                        ))}
                      </div>
                    )}
                    {session.notes && (
                      <p className="text-sm text-gray-600 mb-3 bg-blue-50 p-3 rounded-lg">
                        {session.notes}
                      </p>
                    )}
                    {session.things_to_work_on && session.things_to_work_on.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {session.things_to_work_on.map((item, index) => (
                          <span
                            key={index}
                            className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-medium"
                          >
                            ⚠️ {item}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(session)}
                      className="p-3 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(session.id)}
                      className="p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <SessionModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setSelectedSession(null)
        }}
        onSave={() => {
          setModalOpen(false)
          setSelectedSession(null)
          loadData()
        }}
        session={selectedSession}
        students={students}
        trainingPlans={trainingPlans}
      />
    </div>
  )
}
