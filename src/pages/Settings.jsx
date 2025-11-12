import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { getStudents, getSessions } from '../lib/database'
import { Users, Calendar } from 'lucide-react'

export default function Settings() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalSessions: 0,
  })
  const navigate = useNavigate()

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const [students, sessions] = await Promise.all([
        getStudents(),
        getSessions(),
      ])
      setStats({
        totalStudents: students.length,
        totalSessions: sessions.length,
      })
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }

  const handleLogout = async () => {
    if (confirm('Are you sure you want to logout?')) {
      await supabase.auth.signOut()
      navigate('/login')
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Settings</h2>

      <div className="space-y-6">
        {/* Statistics */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Statistics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <Users size={32} className="mx-auto text-green-600 mb-2" />
              <p className="text-3xl font-bold text-gray-800">{stats.totalStudents}</p>
              <p className="text-sm text-gray-500">Students</p>
            </div>
            <div className="text-center">
              <Calendar size={32} className="mx-auto text-green-600 mb-2" />
              <p className="text-3xl font-bold text-gray-800">{stats.totalSessions}</p>
              <p className="text-sm text-gray-500">Sessions</p>
            </div>
          </div>
        </div>

        {/* Logout */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Account</h3>
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-colors"
          >
            Logout
          </button>
        </div>

        {/* App Info */}
        <div className="text-center text-gray-400 text-sm">
          <p>Soccer School Admin Portal</p>
          <p className="mt-1">Version 1.0.0</p>
        </div>
      </div>
    </div>
  )
}

