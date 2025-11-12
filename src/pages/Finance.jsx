import { useState, useEffect } from 'react'
import { Plus, Trash2, Edit, TrendingUp, Clock, Wallet } from 'lucide-react'
import { getFinances, deleteFinance, getStudents } from '../lib/database'
import { formatZAR } from '../utils/currency'
import FinanceModal from '../components/FinanceModal'

export default function Finance() {
  const [finances, setFinances] = useState([])
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedFinance, setSelectedFinance] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [financesData, studentsData] = await Promise.all([
        getFinances(),
        getStudents(),
      ])
      setFinances(financesData)
      setStudents(studentsData)
    } catch (error) {
      console.error('Error loading data:', error)
      alert('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = () => {
    setSelectedFinance(null)
    setModalOpen(true)
  }

  const handleEdit = (finance) => {
    setSelectedFinance(finance)
    setModalOpen(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this finance record?')) return
    
    try {
      await deleteFinance(id)
      loadData()
    } catch (error) {
      console.error('Error deleting finance:', error)
      alert('Failed to delete finance record')
    }
  }

  const getStudentName = (studentId) => {
    const student = students.find(s => s.id === studentId)
    return student ? student.name : 'Unknown'
  }

  const calculateTotals = () => {
    let totalHoursPaid = 0
    let totalHoursUsed = 0
    let totalRevenue = 0

    finances.forEach((finance) => {
      totalHoursPaid += parseFloat(finance.hours_paid || 0)
      totalHoursUsed += parseFloat(finance.hours_used || 0)
      totalRevenue += parseFloat(finance.hours_paid || 0) * parseFloat(finance.hourly_rate || 0)
    })

    const remainingHours = totalHoursPaid - totalHoursUsed
    const utilizationRate = totalHoursPaid > 0 ? (totalHoursUsed / totalHoursPaid) * 100 : 0

    return {
      totalHoursPaid,
      totalHoursUsed,
      totalRevenue,
      remainingHours,
      utilizationRate,
    }
  }

  const filteredFinances = finances.filter((finance) => {
    const studentName = getStudentName(finance.student_id).toLowerCase()
    return studentName.includes(searchTerm.toLowerCase())
  })

  const totals = calculateTotals()

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
          <h2 className="text-3xl font-bold text-gray-900">Finance Management</h2>
          <p className="text-gray-600 mt-1">Track payments and hours for all students</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl transition-all shadow-lg hover:shadow-xl font-semibold"
        >
          <Plus size={20} />
          <span>Add Record</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <Wallet size={24} className="opacity-80" />
            <TrendingUp size={20} />
          </div>
          <p className="text-white/80 text-sm font-medium">Total Revenue</p>
          <p className="text-3xl font-bold mt-1">{formatZAR(totals.totalRevenue)}</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <Clock size={24} className="opacity-80" />
            <span className="text-sm font-medium">{totals.utilizationRate.toFixed(1)}%</span>
          </div>
          <p className="text-white/80 text-sm font-medium">Hours Paid</p>
          <p className="text-3xl font-bold mt-1">{totals.totalHoursPaid.toFixed(1)} hrs</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <Clock size={24} className="opacity-80" />
          </div>
          <p className="text-white/80 text-sm font-medium">Hours Used</p>
          <p className="text-3xl font-bold mt-1">{totals.totalHoursUsed.toFixed(1)} hrs</p>
        </div>

        <div className={`rounded-2xl p-6 text-white shadow-lg ${
          totals.remainingHours >= 0 
            ? 'bg-gradient-to-br from-emerald-500 to-emerald-600' 
            : 'bg-gradient-to-br from-red-500 to-red-600'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <Clock size={24} className="opacity-80" />
          </div>
          <p className="text-white/80 text-sm font-medium">Remaining Hours</p>
          <p className="text-3xl font-bold mt-1">{totals.remainingHours.toFixed(1)} hrs</p>
        </div>
      </div>

      {/* Search */}
      {finances.length > 0 && (
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <input
            type="text"
            placeholder="Search by student name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
          />
        </div>
      )}

      {/* Finance Records */}
      {filteredFinances.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
          <Wallet size={64} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-400 text-lg font-medium">
            {searchTerm ? 'No matching records found' : 'No finance records yet'}
          </p>
          {!searchTerm && (
            <p className="text-gray-400 text-sm mt-2">Click "Add Record" to get started</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredFinances.map((finance) => {
            const revenue = parseFloat(finance.hours_paid || 0) * parseFloat(finance.hourly_rate || 0)
            const remainingHours = parseFloat(finance.hours_paid || 0) - parseFloat(finance.hours_used || 0)
            const usagePercent = finance.hours_paid > 0 
              ? (finance.hours_used / finance.hours_paid) * 100 
              : 0

            return (
              <div
                key={finance.id}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-gray-900 text-xl mb-1">
                      {getStudentName(finance.student_id)}
                    </h3>
                    <p className="text-sm text-gray-500">Rate: {formatZAR(finance.hourly_rate || 0)}/hr</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(finance)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(finance.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Usage</span>
                    <span className="font-semibold text-gray-900">{usagePercent.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        usagePercent > 90 ? 'bg-red-500' : 
                        usagePercent > 70 ? 'bg-yellow-500' : 
                        'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(usagePercent, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs text-gray-500 mb-1">Hours Paid</p>
                    <p className="text-2xl font-bold text-gray-900">{finance.hours_paid || 0}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs text-gray-500 mb-1">Hours Used</p>
                    <p className="text-2xl font-bold text-gray-900">{finance.hours_used || 0}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Remaining</p>
                    <p className={`text-lg font-bold ${
                      remainingHours >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {remainingHours.toFixed(1)} hrs
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Total Revenue</p>
                    <p className="text-lg font-bold text-green-600">
                      {formatZAR(revenue)}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <FinanceModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setSelectedFinance(null)
        }}
        onSave={() => {
          setModalOpen(false)
          setSelectedFinance(null)
          loadData()
        }}
        finance={selectedFinance}
        students={students}
      />
    </div>
  )
}
