import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { saveStudent } from '../lib/database'

export default function StudentModal({ open, onClose, onSave, student }) {
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [picture, setPicture] = useState('')
  const [paymentStatus, setPaymentStatus] = useState('unpaid')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (student) {
      setName(student.name || '')
      setAge(student.age?.toString() || '')
      setPhone(student.phone || '')
      setEmail(student.email || '')
      setPicture(student.picture || '')
      setPaymentStatus(student.payment_status || 'unpaid')
    } else {
      resetForm()
    }
  }, [student, open])

  const resetForm = () => {
    setName('')
    setAge('')
    setPhone('')
    setEmail('')
    setPicture('')
    setPaymentStatus('unpaid')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim()) {
      alert('Please enter a name')
      return
    }

    setLoading(true)
    try {
      await saveStudent({
        ...(student?.id && { id: student.id }),
        name: name.trim(),
        age: age ? parseInt(age) : null,
        phone: phone.trim(),
        email: email.trim(),
        picture: picture.trim(),
        payment_status: paymentStatus,
      })
      onSave()
      resetForm()
    } catch (error) {
      console.error('Error saving student:', error)
      alert('Failed to save student')
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
            {student ? 'Edit Student' : 'Add Student'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-100 rounded-xl px-4 py-3 border border-gray-300 focus:border-green-600 focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Age</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full bg-gray-100 rounded-xl px-4 py-3 border border-gray-300 focus:border-green-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Payment Status</label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
                className="w-full bg-gray-100 rounded-xl px-4 py-3 border border-gray-300 focus:border-green-600 focus:outline-none"
              >
                <option value="paid">Paid</option>
                <option value="unpaid">Unpaid</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Phone</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-gray-100 rounded-xl px-4 py-3 border border-gray-300 focus:border-green-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-100 rounded-xl px-4 py-3 border border-gray-300 focus:border-green-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Picture URL</label>
            <input
              type="url"
              value={picture}
              onChange={(e) => setPicture(e.target.value)}
              className="w-full bg-gray-100 rounded-xl px-4 py-3 border border-gray-300 focus:border-green-600 focus:outline-none"
              placeholder="https://example.com/image.jpg"
            />
            {picture && (
              <img
                src={picture}
                alt="Preview"
                className="mt-2 w-24 h-24 rounded-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none'
                }}
              />
            )}
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

