import { useState, useEffect } from 'react'
import { X, Star } from 'lucide-react'
import { saveSession } from '../lib/database'

export default function SessionModal({ open, onClose, onSave, session, students, trainingPlans }) {
  const [studentId, setStudentId] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [trainingPlan, setTrainingPlan] = useState('')
  const [rating, setRating] = useState(0)
  const [notes, setNotes] = useState('')
  const [thingsToWorkOn, setThingsToWorkOn] = useState([])
  const [newThing, setNewThing] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (session) {
      setStudentId(session.student_id || '')
      setDate(session.date ? new Date(session.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0])
      setTrainingPlan(session.training_plan || '')
      setRating(session.rating || 0)
      setNotes(session.notes || '')
      setThingsToWorkOn(session.things_to_work_on || [])
    } else {
      resetForm()
    }
  }, [session, open])

  const resetForm = () => {
    setStudentId('')
    setDate(new Date().toISOString().split('T')[0])
    setTrainingPlan('')
    setRating(0)
    setNotes('')
    setThingsToWorkOn([])
    setNewThing('')
  }

  const handleAddThing = () => {
    if (newThing.trim()) {
      setThingsToWorkOn([...thingsToWorkOn, newThing.trim()])
      setNewThing('')
    }
  }

  const handleRemoveThing = (index) => {
    setThingsToWorkOn(thingsToWorkOn.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!studentId) {
      alert('Please select a student')
      return
    }

    setLoading(true)
    try {
      await saveSession({
        ...(session?.id && { id: session.id }),
        student_id: studentId,
        date: new Date(date).toISOString(),
        training_plan: trainingPlan || null,
        rating: rating || null,
        notes: notes.trim() || null,
        things_to_work_on: thingsToWorkOn,
      })
      onSave()
      resetForm()
    } catch (error) {
      console.error('Error saving session:', error)
      alert('Failed to save session')
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-xl font-bold text-gray-800">
            {session ? 'Edit Session' : 'Add Session'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Student *</label>
            <select
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="w-full bg-gray-100 rounded-xl px-4 py-3 border border-gray-300 focus:border-green-600 focus:outline-none"
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

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Date *</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-gray-100 rounded-xl px-4 py-3 border border-gray-300 focus:border-green-600 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Training Plan</label>
            <select
              value={trainingPlan}
              onChange={(e) => setTrainingPlan(e.target.value)}
              className="w-full bg-gray-100 rounded-xl px-4 py-3 border border-gray-300 focus:border-green-600 focus:outline-none"
            >
              <option value="">Select a plan</option>
              {trainingPlans.map((plan) => (
                <option key={plan.id} value={plan.name}>
                  {plan.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Rating</label>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="focus:outline-none"
                >
                  <Star
                    size={32}
                    className={star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="w-full bg-gray-100 rounded-xl px-4 py-3 border border-gray-300 focus:border-green-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Things to Work On</label>
            <div className="flex space-x-2 mb-2">
              <input
                type="text"
                value={newThing}
                onChange={(e) => setNewThing(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddThing())}
                placeholder="Add item..."
                className="flex-1 bg-gray-100 rounded-xl px-4 py-2 border border-gray-300 focus:border-green-600 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddThing}
                className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {thingsToWorkOn.map((item, index) => (
                <span
                  key={index}
                  className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm flex items-center space-x-2"
                >
                  <span>{item}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveThing(index)}
                    className="text-yellow-700 hover:text-yellow-900"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex space-x-4 pt-4">
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
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

