import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { saveTrainingPlan } from '../lib/database'

export default function TrainingPlanModal({ open, onClose, onSave, plan }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [drills, setDrills] = useState([])
  const [newDrill, setNewDrill] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (plan) {
      setName(plan.name || '')
      setDescription(plan.description || '')
      setDrills(plan.drills || [])
    } else {
      resetForm()
    }
  }, [plan, open])

  const resetForm = () => {
    setName('')
    setDescription('')
    setDrills([])
    setNewDrill('')
  }

  const handleAddDrill = () => {
    if (newDrill.trim()) {
      setDrills([...drills, newDrill.trim()])
      setNewDrill('')
    }
  }

  const handleRemoveDrill = (index) => {
    setDrills(drills.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim()) {
      alert('Please enter a plan name')
      return
    }

    setLoading(true)
    try {
      await saveTrainingPlan({
        ...(plan?.id && { id: plan.id }),
        name: name.trim(),
        description: description.trim() || null,
        drills: drills,
      })
      onSave()
      resetForm()
    } catch (error) {
      console.error('Error saving plan:', error)
      alert('Failed to save training plan')
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
            {plan ? 'Edit Training Plan' : 'Add Training Plan'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Plan Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-100 rounded-xl px-4 py-3 border border-gray-300 focus:border-green-600 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full bg-gray-100 rounded-xl px-4 py-3 border border-gray-300 focus:border-green-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Drills</label>
            <div className="flex space-x-2 mb-2">
              <input
                type="text"
                value={newDrill}
                onChange={(e) => setNewDrill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddDrill())}
                placeholder="Add drill..."
                className="flex-1 bg-gray-100 rounded-xl px-4 py-2 border border-gray-300 focus:border-green-600 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddDrill}
                className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {drills.map((drill, index) => (
                <span
                  key={index}
                  className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm flex items-center space-x-2"
                >
                  <span>{drill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveDrill(index)}
                    className="text-green-700 hover:text-green-900"
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

