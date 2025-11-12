import { useState, useEffect } from 'react'
import { X, Wallet } from 'lucide-react'
import { saveBooking, getBookingsByDateRange } from '../lib/database'
import { format } from 'date-fns'
import { formatZAR } from '../utils/currency'

export default function BookingModal({ open, onClose, onSave, booking, students, trainingPlans, defaultDate }) {
  const [studentId, setStudentId] = useState('')
  const [date, setDate] = useState('')
  const [startTime, setStartTime] = useState('09:00')
  const [endTime, setEndTime] = useState('10:00')
  const [trainingPlan, setTrainingPlan] = useState('')
  const [notes, setNotes] = useState('')
  const [status, setStatus] = useState('scheduled')
  const [paymentStatus, setPaymentStatus] = useState('unpaid')
  const [amountPaid, setAmountPaid] = useState('')
  const [amountDue, setAmountDue] = useState('')
  const [hourlyRate, setHourlyRate] = useState('')
  const [loading, setLoading] = useState(false)
  const [conflicts, setConflicts] = useState([])

  useEffect(() => {
    if (booking) {
      setStudentId(booking.student_id || '')
      setDate(booking.date || '')
      setStartTime(booking.start_time || '09:00')
      setEndTime(booking.end_time || '10:00')
      setTrainingPlan(booking.training_plan || '')
      setNotes(booking.notes || '')
      setStatus(booking.status || 'scheduled')
      setPaymentStatus(booking.payment_status || 'unpaid')
      setAmountPaid(booking.amount_paid?.toString() || '')
      setAmountDue(booking.amount_due?.toString() || '')
    } else {
      resetForm()
      if (defaultDate) {
        setDate(format(defaultDate, 'yyyy-MM-dd'))
      } else {
        setDate(format(new Date(), 'yyyy-MM-dd'))
      }
    }
  }, [booking, open, defaultDate])

  useEffect(() => {
    if (studentId && date && startTime && endTime && !booking?.id) {
      checkConflicts()
    }
  }, [studentId, date, startTime, endTime])

  useEffect(() => {
    if (startTime && endTime && hourlyRate) {
      const start = new Date(`2000-01-01T${startTime}`)
      const end = new Date(`2000-01-01T${endTime}`)
      const hours = (end - start) / (1000 * 60 * 60)
      const due = hours * parseFloat(hourlyRate || 0)
      setAmountDue(due.toFixed(2))
    }
  }, [startTime, endTime, hourlyRate])

  const checkConflicts = async () => {
    try {
      const existingBookings = await getBookingsByDateRange(date, date)
      const conflicts = existingBookings.filter(b => {
        if (b.id === booking?.id) return false
        const bStart = b.start_time
        const bEnd = b.end_time
        return (startTime < bEnd && endTime > bStart)
      })
      setConflicts(conflicts)
    } catch (error) {
      console.error('Error checking conflicts:', error)
    }
  }

  const resetForm = () => {
    setStudentId('')
    setDate(format(new Date(), 'yyyy-MM-dd'))
    setStartTime('09:00')
    setEndTime('10:00')
    setTrainingPlan('')
    setNotes('')
    setStatus('scheduled')
    setPaymentStatus('unpaid')
    setAmountPaid('')
    setAmountDue('')
    setHourlyRate('')
    setConflicts([])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!studentId) {
      alert('Please select a student')
      return
    }
    if (!date) {
      alert('Please select a date')
      return
    }
    if (startTime >= endTime) {
      alert('End time must be after start time')
      return
    }
    if (conflicts.length > 0 && !confirm(`Warning: ${conflicts.length} conflicting booking(s) found. Continue anyway?`)) {
      return
    }

    setLoading(true)
    try {
      await saveBooking({
        ...(booking?.id && { id: booking.id }),
        student_id: studentId,
        date: date,
        start_time: startTime,
        end_time: endTime,
        training_plan: trainingPlan || null,
        notes: notes.trim() || null,
        status: status,
        payment_status: paymentStatus,
        amount_paid: amountPaid ? parseFloat(amountPaid) : 0,
        amount_due: amountDue ? parseFloat(amountDue) : 0,
      })
      onSave()
      resetForm()
    } catch (error) {
      console.error('Error saving booking:', error)
      alert('Failed to save booking')
    } finally {
      setLoading(false)
    }
  }

  const getStudentHourlyRate = () => {
    // This would ideally come from the finance record
    // For now, we'll let user enter it
    return hourlyRate
  }

  if (!open) return null

  const selectedStudent = students.find(s => s.id === studentId)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-gray-200 flex justify-between items-center p-6">
          <h3 className="text-2xl font-bold text-gray-900">
            {booking ? 'Edit Booking' : 'New Booking'}
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
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={format(new Date(), 'yyyy-MM-dd')}
                className="w-full bg-gray-50 rounded-xl px-4 py-3 border-2 border-gray-200 focus:border-green-500 focus:outline-none transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-gray-50 rounded-xl px-4 py-3 border-2 border-gray-200 focus:border-green-500 focus:outline-none transition-colors"
              >
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Start Time <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full bg-gray-50 rounded-xl px-4 py-3 border-2 border-gray-200 focus:border-green-500 focus:outline-none transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                End Time <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full bg-gray-50 rounded-xl px-4 py-3 border-2 border-gray-200 focus:border-green-500 focus:outline-none transition-colors"
                required
              />
            </div>
          </div>

          {/* Conflict Warning */}
          {conflicts.length > 0 && (
            <div className="bg-yellow-50 border-2 border-yellow-400 rounded-xl p-4">
              <p className="text-yellow-800 font-semibold mb-2">⚠️ Time Conflict Detected!</p>
              <p className="text-yellow-700 text-sm">
                {conflicts.length} booking(s) already scheduled for this time slot.
              </p>
            </div>
          )}

          {/* Payment Section */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 border-2 border-green-200">
            <div className="flex items-center gap-2 mb-4">
              <Wallet size={20} className="text-green-600" />
              <h4 className="font-bold text-gray-900">Payment Information</h4>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-sm">
                  Hourly Rate (ZAR)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(e.target.value)}
                  className="w-full bg-white rounded-xl px-4 py-3 border-2 border-gray-200 focus:border-green-500 focus:outline-none transition-colors"
                  placeholder="e.g., 200"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-sm">
                  Payment Status
                </label>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                  className="w-full bg-white rounded-xl px-4 py-3 border-2 border-gray-200 focus:border-green-500 focus:outline-none transition-colors"
                >
                  <option value="paid">Paid</option>
                  <option value="partial">Partial</option>
                  <option value="unpaid">Unpaid</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-sm">
                  Amount Paid (ZAR)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={amountPaid}
                  onChange={(e) => setAmountPaid(e.target.value)}
                  className="w-full bg-white rounded-xl px-4 py-3 border-2 border-gray-200 focus:border-green-500 focus:outline-none transition-colors"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-sm">
                  Amount Due (ZAR)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={amountDue}
                  onChange={(e) => setAmountDue(e.target.value)}
                  className="w-full bg-white rounded-xl px-4 py-3 border-2 border-gray-200 focus:border-green-500 focus:outline-none transition-colors"
                  placeholder="Auto-calculated"
                  readOnly
                />
                <p className="text-xs text-gray-500 mt-1">Based on hours × rate</p>
              </div>
            </div>

            {amountDue > 0 && (
              <div className="mt-4 pt-4 border-t border-green-200">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-semibold">Remaining:</span>
                  <span className={`text-lg font-bold ${
                    parseFloat(amountDue || 0) - parseFloat(amountPaid || 0) > 0
                      ? 'text-red-600'
                      : 'text-green-600'
                  }`}>
                    {formatZAR(Math.max(0, parseFloat(amountDue || 0) - parseFloat(amountPaid || 0)))}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Training Plan</label>
            <select
              value={trainingPlan}
              onChange={(e) => setTrainingPlan(e.target.value)}
              className="w-full bg-gray-50 rounded-xl px-4 py-3 border-2 border-gray-200 focus:border-green-500 focus:outline-none transition-colors"
            >
              <option value="">Select a plan (optional)</option>
              {trainingPlans.map((plan) => (
                <option key={plan.id} value={plan.name}>
                  {plan.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full bg-gray-50 rounded-xl px-4 py-3 border-2 border-gray-200 focus:border-green-500 focus:outline-none transition-colors"
              placeholder="Add any notes about this booking..."
            />
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
              {loading ? 'Saving...' : 'Save Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
