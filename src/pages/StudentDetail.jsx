import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, User, Calendar, Star, Wallet } from 'lucide-react'
import { format } from 'date-fns'
import { getSessions, getFinances, getStudents } from '../lib/database'
import { formatZAR } from '../utils/currency'

export default function StudentDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [student, setStudent] = useState(null)
  const [sessions, setSessions] = useState([])
  const [finance, setFinance] = useState(null)
  const [stats, setStats] = useState({
    totalSessions: 0,
    averageRating: 0,
    weeksActive: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStudentData()
  }, [id])

  const loadStudentData = async () => {
    try {
      const [allStudents, allSessions, allFinances] = await Promise.all([
        getStudents(),
        getSessions(),
        getFinances(),
      ])

      const foundStudent = allStudents.find(s => s.id === id)
      if (!foundStudent) {
        navigate('/students')
        return
      }

      setStudent(foundStudent)

      const studentSessions = allSessions
        .filter(s => s.student_id === id)
        .sort((a, b) => new Date(b.date) - new Date(a.date))

      setSessions(studentSessions)

      const studentFinance = allFinances.find(f => f.student_id === id)
      setFinance(studentFinance)

      // Calculate stats
      const ratings = studentSessions.filter(s => s.rating).map(s => s.rating)
      const averageRating = ratings.length > 0
        ? ratings.reduce((a, b) => a + b, 0) / ratings.length
        : 0

      const firstSession = studentSessions[studentSessions.length - 1]
      const weeksActive = firstSession
        ? Math.floor((new Date() - new Date(firstSession.date)) / (1000 * 60 * 60 * 24 * 7)) + 1
        : 0

      setStats({
        totalSessions: studentSessions.length,
        averageRating: averageRating.toFixed(1),
        weeksActive: Math.max(weeksActive, 0),
      })
    } catch (error) {
      console.error('Error loading student data:', error)
      alert('Failed to load student data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  if (!student) {
    return null
  }

  return (
    <div>
      <button
        onClick={() => navigate('/students')}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-6"
      >
        <ArrowLeft size={20} />
        <span>Back to Students</span>
      </button>

      {/* Student Header */}
      <div className="bg-green-600 rounded-xl p-6 mb-6 text-white">
        <div className="flex items-center space-x-4">
          {student.picture ? (
            <img
              src={student.picture}
              alt={student.name}
              className="w-24 h-24 rounded-full object-cover border-4 border-white"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center border-4 border-white">
              <User size={48} />
            </div>
          )}
          <div>
            <h2 className="text-3xl font-bold">{student.name}</h2>
            {student.age && (
              <p className="text-white/80 mt-1">Age: {student.age}</p>
            )}
            {student.payment_status && (
              <span
                className={`inline-block mt-2 px-4 py-1 rounded-full text-sm ${
                  student.payment_status === 'paid'
                    ? 'bg-green-500'
                    : 'bg-yellow-500'
                }`}
              >
                {student.payment_status.toUpperCase()}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 text-center">
          <Calendar size={32} className="mx-auto text-green-600 mb-2" />
          <p className="text-2xl font-bold text-gray-800">{stats.totalSessions}</p>
          <p className="text-sm text-gray-500">Sessions</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 text-center">
          <Star size={32} className="mx-auto text-yellow-400 mb-2" />
          <p className="text-2xl font-bold text-gray-800">{stats.averageRating}</p>
          <p className="text-sm text-gray-500">Avg Rating</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 text-center">
          <Calendar size={32} className="mx-auto text-green-600 mb-2" />
          <p className="text-2xl font-bold text-gray-800">{stats.weeksActive}</p>
          <p className="text-sm text-gray-500">Weeks Active</p>
        </div>
      </div>

      {/* Finance */}
      {finance && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center space-x-2">
            <Wallet size={20} className="text-green-600" />
            <span>Finance</span>
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500">Hours Paid</p>
              <p className="font-semibold text-gray-800">{finance.hours_paid || 0} hrs</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Hours Used</p>
              <p className="font-semibold text-gray-800">{finance.hours_used || 0} hrs</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Remaining</p>
              <p className={`font-semibold ${
                (finance.hours_paid || 0) - (finance.hours_used || 0) >= 0
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}>
                {((finance.hours_paid || 0) - (finance.hours_used || 0)).toFixed(1)} hrs
              </p>
            </div>
          </div>
          {finance.hourly_rate > 0 && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-gray-500">Revenue</p>
              <p className="text-lg font-semibold text-green-600">
                {formatZAR((finance.hours_paid || 0) * (finance.hourly_rate || 0))}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Session History */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Session History</h3>
        {sessions.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No sessions yet</p>
        ) : (
          <div className="space-y-4">
            {sessions.map((session) => {
              const weekNumber = Math.floor((new Date() - new Date(session.date)) / (1000 * 60 * 60 * 24 * 7)) + 1
              return (
                <div
                  key={session.id}
                  className="border-b border-gray-200 pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-gray-800">
                        {format(new Date(session.date), 'MMM dd, yyyy')}
                      </p>
                      {session.training_plan && (
                        <p className="text-sm text-gray-500">{session.training_plan}</p>
                      )}
                    </div>
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                      Week {weekNumber}
                    </span>
                  </div>
                  {session.rating > 0 && (
                    <div className="flex items-center space-x-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={i < session.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                        />
                      ))}
                    </div>
                  )}
                  {session.notes && (
                    <p className="text-sm text-gray-600 mb-2">{session.notes}</p>
                  )}
                  {session.things_to_work_on && session.things_to_work_on.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {session.things_to_work_on.map((item, index) => (
                        <span
                          key={index}
                          className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

