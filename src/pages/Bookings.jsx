import { useState, useEffect } from 'react'
import { Plus, Trash2, Edit, Calendar, Clock, User, ChevronLeft, ChevronRight, CheckCircle, XCircle, Wallet } from 'lucide-react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns'
import { getBookings, getBookingsByDateRange, deleteBooking, getStudents, getTrainingPlans, saveBooking, getFinances } from '../lib/database'
import { formatZAR } from '../utils/currency'
import BookingModal from '../components/BookingModal'

export default function Bookings() {
  const [bookings, setBookings] = useState([])
  const [students, setStudents] = useState([])
  const [trainingPlans, setTrainingPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [viewMode, setViewMode] = useState('calendar') // 'calendar' or 'list'

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    loadBookings()
  }, [currentMonth])

  const loadData = async () => {
    try {
      const [bookingsData, studentsData, plansData] = await Promise.all([
        getBookings(),
        getStudents(),
        getTrainingPlans(),
      ])
      setBookings(bookingsData)
      setStudents(studentsData)
      setTrainingPlans(plansData)
    } catch (error) {
      console.error('Error loading data:', error)
      alert('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const loadBookings = async () => {
    try {
      const startDate = format(startOfMonth(currentMonth), 'yyyy-MM-dd')
      const endDate = format(endOfMonth(currentMonth), 'yyyy-MM-dd')
      const data = await getBookingsByDateRange(startDate, endDate)
      setBookings(data)
    } catch (error) {
      console.error('Error loading bookings:', error)
    }
  }

  const handleAdd = (date = null) => {
    setSelectedBooking(null)
    setSelectedDate(date || new Date())
    setModalOpen(true)
  }

  const handleEdit = (booking) => {
    setSelectedBooking(booking)
    setSelectedDate(new Date(booking.date))
    setModalOpen(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this booking?')) return
    
    try {
      await deleteBooking(id)
      loadBookings()
    } catch (error) {
      console.error('Error deleting booking:', error)
      alert('Failed to delete booking')
    }
  }

  const handleStatusChange = async (booking, newStatus) => {
    try {
      await saveBooking({ ...booking, status: newStatus })
      loadBookings()
      // Auto-sync to finance when booking is completed
      if (newStatus === 'completed') {
        // Sync happens automatically in saveBooking function
      }
    } catch (error) {
      console.error('Error updating booking:', error)
      alert('Failed to update booking')
    }
  }

  const getStudentName = (studentId) => {
    const student = students.find(s => s.id === studentId)
    return student ? student.name : 'Unknown'
  }

  const getBookingsForDate = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    return bookings.filter(b => b.date === dateStr)
  }

  const getBookingsForToday = () => {
    const today = format(new Date(), 'yyyy-MM-dd')
    return bookings.filter(b => b.date === today && b.status === 'scheduled')
  }

  const calendarDays = () => {
    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(currentMonth)
    const calendarStart = startOfWeek(monthStart)
    const calendarEnd = endOfWeek(monthEnd)
    
    return eachDayOfInterval({ start: calendarStart, end: calendarEnd })
  }

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1))
  }

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  const goToToday = () => {
    setCurrentMonth(new Date())
    setSelectedDate(new Date())
  }

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

  const todayBookings = getBookingsForToday()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Training Bookings</h2>
          <p className="text-gray-600 mt-1">Schedule and manage future training sessions</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode(viewMode === 'calendar' ? 'list' : 'calendar')}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-xl transition-colors font-medium"
          >
            {viewMode === 'calendar' ? 'List View' : 'Calendar View'}
          </button>
          <button
            onClick={() => handleAdd()}
            className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl transition-all shadow-lg hover:shadow-xl font-semibold"
          >
            <Plus size={20} />
            <span>New Booking</span>
          </button>
        </div>
      </div>

      {/* Today's Bookings Summary */}
      {todayBookings.length > 0 && (
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">Today's Bookings</h3>
              <p className="text-blue-100">{todayBookings.length} session{todayBookings.length !== 1 ? 's' : ''} scheduled</p>
            </div>
            <Calendar size={32} className="opacity-80" />
          </div>
        </div>
      )}

      {viewMode === 'calendar' ? (
        /* Calendar View */
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Calendar Header */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6">
            <div className="flex items-center justify-between">
              <button
                onClick={prevMonth}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <ChevronLeft size={24} />
              </button>
              <div className="text-center">
                <h3 className="text-2xl font-bold">{format(currentMonth, 'MMMM yyyy')}</h3>
                <button
                  onClick={goToToday}
                  className="text-sm text-white/80 hover:text-white mt-1 underline"
                >
                  Go to Today
                </button>
              </div>
              <button
                onClick={nextMonth}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="p-4">
            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-2">
              {calendarDays().map((day, idx) => {
                const dayBookings = getBookingsForDate(day)
                const isCurrentMonth = isSameMonth(day, currentMonth)
                const isToday = isSameDay(day, new Date())
                const isSelected = isSameDay(day, selectedDate)

                return (
                  <div
                    key={idx}
                    className={`min-h-[100px] border-2 rounded-lg p-2 transition-all cursor-pointer ${
                      !isCurrentMonth
                        ? 'bg-gray-50 border-gray-100 opacity-50'
                        : isToday
                        ? 'bg-green-50 border-green-400'
                        : isSelected
                        ? 'bg-blue-50 border-blue-400'
                        : 'bg-white border-gray-200 hover:border-green-300'
                    }`}
                    onClick={() => {
                      setSelectedDate(day)
                      if (isCurrentMonth) handleAdd(day)
                    }}
                  >
                    <div className={`text-sm font-semibold mb-1 ${
                      isToday ? 'text-green-700' : isSelected ? 'text-blue-700' : 'text-gray-700'
                    }`}>
                      {format(day, 'd')}
                    </div>
                    <div className="space-y-1">
                      {dayBookings.slice(0, 3).map((booking) => {
                        const studentName = getStudentName(booking.student_id)
                        const paymentStatus = booking.payment_status || 'unpaid'
                        const isPaid = paymentStatus === 'paid'
                        const isPartial = paymentStatus === 'partial'
                        return (
                          <div
                            key={booking.id}
                            onClick={(e) => {
                              e.stopPropagation()
                              handleEdit(booking)
                            }}
                            className={`text-xs p-1.5 rounded truncate flex items-center gap-1 ${
                              booking.status === 'completed'
                                ? 'bg-green-100 text-green-700'
                                : booking.status === 'cancelled'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-blue-100 text-blue-700'
                            }`}
                            title={`${studentName} - ${booking.start_time} to ${booking.end_time}${isPaid ? ' ✓ Paid' : isPartial ? ' ⚠ Partial' : ' ⚠ Unpaid'}`}
                          >
                            <span>{format(new Date(`2000-01-01T${booking.start_time}`), 'HH:mm')}</span>
                            <span className="font-medium">{studentName}</span>
                            {isPaid && <span className="text-green-600">✓</span>}
                            {isPartial && <span className="text-yellow-600">⚠</span>}
                            {!isPaid && !isPartial && <span className="text-red-600">⚠</span>}
                          </div>
                        )
                      })}
                      {dayBookings.length > 3 && (
                        <div className="text-xs text-gray-500">
                          +{dayBookings.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      ) : (
        /* List View */
        <div className="space-y-4">
          {bookings.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
              <Calendar size={64} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-400 text-lg font-medium">No bookings yet</p>
              <p className="text-gray-400 text-sm mt-2">Click "New Booking" to schedule a session</p>
            </div>
          ) : (
            bookings.map((booking) => {
              const studentName = getStudentName(booking.student_id)
              const bookingDate = new Date(booking.date)
              const isPast = bookingDate < new Date() && booking.status === 'scheduled'
              
              return (
                <div
                  key={booking.id}
                  className={`bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border-2 ${
                    booking.status === 'completed'
                      ? 'border-green-200'
                      : booking.status === 'cancelled'
                      ? 'border-red-200 opacity-75'
                      : isPast
                      ? 'border-yellow-200'
                      : 'border-gray-100'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center flex-wrap gap-3 mb-3">
                        <h3 className="font-bold text-gray-900 text-xl">{studentName}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          booking.status === 'completed'
                            ? 'bg-green-100 text-green-700'
                            : booking.status === 'cancelled'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {booking.status}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
                          booking.payment_status === 'paid'
                            ? 'bg-green-100 text-green-700'
                            : booking.payment_status === 'partial'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          <Wallet size={12} />
                          {booking.payment_status === 'paid' ? 'Paid' : 
                           booking.payment_status === 'partial' ? 'Partial' : 'Unpaid'}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} />
                          <span className="font-medium">{format(bookingDate, 'EEEE, MMM dd, yyyy')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={16} />
                          <span className="font-medium">
                            {format(new Date(`2000-01-01T${booking.start_time}`), 'HH:mm')} - 
                            {format(new Date(`2000-01-01T${booking.end_time}`), 'HH:mm')}
                          </span>
                        </div>
                      </div>
                      {booking.training_plan && (
                        <p className="text-sm text-gray-600 mt-2 bg-gray-50 px-3 py-2 rounded-lg inline-block">
                          📋 {booking.training_plan}
                        </p>
                      )}
                      {(booking.amount_due > 0 || booking.amount_paid > 0) && (
                        <div className="mt-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-3 border border-green-200">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">Amount Due:</span>
                            <span className="font-bold text-gray-900">
                              {formatZAR(booking.amount_due || 0)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-sm mt-1">
                            <span className="text-gray-600">Amount Paid:</span>
                            <span className={`font-bold ${
                              parseFloat(booking.amount_paid || 0) >= parseFloat(booking.amount_due || 0)
                                ? 'text-green-600'
                                : 'text-yellow-600'
                            }`}>
                              {formatZAR(booking.amount_paid || 0)}
                            </span>
                          </div>
                          {parseFloat(booking.amount_due || 0) > parseFloat(booking.amount_paid || 0) && (
                            <div className="flex justify-between items-center text-sm mt-1 pt-2 border-t border-green-200">
                              <span className="text-gray-600">Remaining:</span>
                              <span className="font-bold text-red-600">
                                {formatZAR(parseFloat(booking.amount_due || 0) - parseFloat(booking.amount_paid || 0))}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                      {booking.notes && (
                        <p className="text-sm text-gray-600 mt-2">{booking.notes}</p>
                      )}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      {booking.status === 'scheduled' && (
                        <>
                          <button
                            onClick={() => handleStatusChange(booking, 'completed')}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm font-medium"
                            title="Mark as completed"
                          >
                            <CheckCircle size={16} />
                            Complete
                          </button>
                          <button
                            onClick={() => handleStatusChange(booking, 'cancelled')}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium"
                            title="Cancel booking"
                          >
                            <XCircle size={16} />
                            Cancel
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleEdit(booking)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(booking.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      )}

      <BookingModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setSelectedBooking(null)
        }}
        onSave={() => {
          setModalOpen(false)
          setSelectedBooking(null)
          loadBookings()
        }}
        booking={selectedBooking}
        students={students}
        trainingPlans={trainingPlans}
        defaultDate={selectedDate}
      />
    </div>
  )
}

