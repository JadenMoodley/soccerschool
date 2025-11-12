import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { saveFinance } from '../lib/database'

export default function FinanceModal({ open, onClose, onSave, finance, students }) {
  const [studentId, setStudentId] = useState('')
  const [hoursPaid, setHoursPaid] = useState('')
  const [hoursUsed, setHoursUsed] = useState('')
  const [hourlyRate, setHourlyRate] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (finance) {
      setStudentId(finance.student_id || '')
      setHoursPaid(finance.hours_paid?.toString() || '')
      setHoursUsed(finance.hours_used?.toString() || '')
      setHourlyRate(finance.hourly_rate?.toString() || '')
    } else {
      resetForm()
    }
  }, [finance, open])

  const resetForm = () => {
    setStudentId('')
    setHoursPaid('')
    setHoursUsed('')
    setHourlyRate('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!studentId) {
      alert('Please select a student')
      return
    }

    setLoading(true)
    try {
      await saveFinance({
        ...(finance?.id && { id: finance.id }),
        student_id: studentId,
        hours_paid: hoursPaid ? parseFloat(hoursPaid) : 0,
        hours_used: hoursUsed ? parseFloat(hoursUsed) : 0,
        hourly_rate: hourlyRate ? parseFloat(hourlyRate) : 0,
        hourly_cost: 0, // Removed - not needed
      })
      onSave()
      resetForm()
    } catch (error) {
      console.error('Error saving finance:', error)
      alert('Failed to save finance record')
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-gray-200 flex justify-between items-center p-6">
          <h3 className="text-2xl font-bold text-gray-900">
            {finance ? 'Edit Finance Record' : 'Add Finance Record'}
          </h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Student <span className="text-red-500">*</span>
            </label>
            <select
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="w-full bg-gray-50 rounded-xl px-4 py-3 border-2 border-gray-200 focus:border-green-500 focus:outline-none transition-colors"
              required
            >
              <option value="">Select a student</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Hours Paid
              </label>
              <input
                type="number"
                step="0.1"
                value={hoursPaid}
                onChange={(e) => setHoursPaid(e.target.value)}
                className="w-full bg-gray-50 rounded-xl px-4 py-3 border-2 border-gray-200 focus:border-green-500 focus:outline-none transition-colors"
                placeholder="e.g., 250"
              />
              <p className="text-xs text-gray-500 mt-1">Total hours the student has paid for</p>
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Hours Used
              </label>
              <input
                type="number"
                step="0.1"
                value={hoursUsed}
                onChange={(e) => setHoursUsed(e.target.value)}
                className="w-full bg-gray-50 rounded-xl px-4 py-3 border-2 border-gray-200 focus:border-green-500 focus:outline-none transition-colors"
                placeholder="e.g., 6"
              />
              <p className="text-xs text-gray-500 mt-1">Hours already used in training</p>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Hourly Rate (ZAR)
            </label>
            <input
              type="number"
              step="0.01"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(e.target.value)}
              className="w-full bg-gray-50 rounded-xl px-4 py-3 border-2 border-gray-200 focus:border-green-500 focus:outline-none transition-colors"
              placeholder="e.g., 200"
            />
            <p className="text-xs text-gray-500 mt-1">Price per hour charged to the student</p>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Revenue is calculated as Hours Paid × Hourly Rate. 
              This tracks how much the student has paid in advance.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {loading ? 'Saving...' : 'Save Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
