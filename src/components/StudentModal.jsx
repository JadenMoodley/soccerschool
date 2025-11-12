import { useState, useEffect, useRef } from 'react'
import { X, Camera, Upload, User } from 'lucide-react'
import { saveStudent } from '../lib/database'
import { uploadImage } from '../lib/storage'

export default function StudentModal({ open, onClose, onSave, student }) {
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [picture, setPicture] = useState('')
  const [paymentStatus, setPaymentStatus] = useState('unpaid')
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)

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

  const handleImageSelect = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB')
      return
    }

    setUploading(true)
    try {
      const imageUrl = await uploadImage(file, 'students')
      setPicture(imageUrl)
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Failed to upload image. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleTakePhoto = () => {
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute('capture', 'environment')
      fileInputRef.current.click()
    }
  }

  const handleChooseFromGallery = () => {
    if (fileInputRef.current) {
      fileInputRef.current.removeAttribute('capture')
      fileInputRef.current.click()
    }
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-gray-200 flex justify-between items-center p-6">
          <h3 className="text-xl font-bold text-gray-800">
            {student ? 'Edit Student' : 'Add Student'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Image Upload */}
          <div className="flex flex-col items-center">
            <div className="relative">
              {picture ? (
                <img
                  src={picture}
                  alt="Student"
                  className="w-32 h-32 rounded-full object-cover border-4 border-green-200"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center border-4 border-green-200">
                  <User size={48} className="text-white" />
                </div>
              )}
              {uploading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
            <div className="flex gap-2 mt-4">
              <button
                type="button"
                onClick={handleTakePhoto}
                disabled={uploading}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                <Camera size={18} />
                <span>Take Photo</span>
              </button>
              <button
                type="button"
                onClick={handleChooseFromGallery}
                disabled={uploading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                <Upload size={18} />
                <span>Choose Photo</span>
              </button>
            </div>
            {uploading && (
              <p className="text-sm text-gray-500 mt-2">Uploading image...</p>
            )}
          </div>

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
                <option value="partial">Partial</option>
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
              disabled={loading || uploading}
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
