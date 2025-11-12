import { useState, useEffect } from 'react'
import { Plus, Trash2, Edit } from 'lucide-react'
import { getTrainingPlans, deleteTrainingPlan } from '../lib/database'
import TrainingPlanModal from '../components/TrainingPlanModal'

export default function TrainingPlans() {
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(null)

  useEffect(() => {
    loadPlans()
  }, [])

  const loadPlans = async () => {
    try {
      const data = await getTrainingPlans()
      setPlans(data)
    } catch (error) {
      console.error('Error loading plans:', error)
      alert('Failed to load training plans')
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = () => {
    setSelectedPlan(null)
    setModalOpen(true)
  }

  const handleEdit = (plan) => {
    setSelectedPlan(plan)
    setModalOpen(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this training plan?')) return
    
    try {
      await deleteTrainingPlan(id)
      loadPlans()
    } catch (error) {
      console.error('Error deleting plan:', error)
      alert('Failed to delete training plan')
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Training Plans</h2>
        <button
          onClick={handleAdd}
          className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl transition-colors"
        >
          <Plus size={20} />
          <span>Add Plan</span>
        </button>
      </div>

      {plans.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl">
          <p className="text-gray-400 text-lg">No training plans yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-200"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 text-lg mb-1">{plan.name}</h3>
                  {plan.description && (
                    <p className="text-sm text-gray-500">{plan.description}</p>
                  )}
                </div>
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => handleEdit(plan)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(plan.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              {plan.drills && plan.drills.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs text-gray-500 mb-2">Drills:</p>
                  <div className="flex flex-wrap gap-2">
                    {plan.drills.map((drill, index) => (
                      <span
                        key={index}
                        className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs"
                      >
                        {drill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <TrainingPlanModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setSelectedPlan(null)
        }}
        onSave={() => {
          setModalOpen(false)
          setSelectedPlan(null)
          loadPlans()
        }}
        plan={selectedPlan}
      />
    </div>
  )
}

