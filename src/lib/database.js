import { supabase } from './supabase'

// Students
export const getStudents = async () => {
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data || []
}

export const saveStudent = async (student) => {
  if (student.id) {
    const { data, error } = await supabase
      .from('students')
      .update(student)
      .eq('id', student.id)
      .select()
      .single()
    if (error) throw error
    return data
  } else {
    const { data, error } = await supabase
      .from('students')
      .insert([student])
      .select()
      .single()
    if (error) throw error
    return data
  }
}

export const deleteStudent = async (id) => {
  const { error } = await supabase
    .from('students')
    .delete()
    .eq('id', id)
  if (error) throw error
}

// Sessions
export const getSessions = async () => {
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .order('date', { ascending: false })
  
  if (error) throw error
  return data || []
}

export const saveSession = async (session) => {
  if (session.id) {
    const { data, error } = await supabase
      .from('sessions')
      .update(session)
      .eq('id', session.id)
      .select()
      .single()
    if (error) throw error
    return data
  } else {
    const { data, error } = await supabase
      .from('sessions')
      .insert([session])
      .select()
      .single()
    if (error) throw error
    return data
  }
}

export const deleteSession = async (id) => {
  const { error } = await supabase
    .from('sessions')
    .delete()
    .eq('id', id)
  if (error) throw error
}

// Training Plans
export const getTrainingPlans = async () => {
  const { data, error } = await supabase
    .from('training_plans')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data || []
}

export const saveTrainingPlan = async (plan) => {
  if (plan.id) {
    const { data, error } = await supabase
      .from('training_plans')
      .update(plan)
      .eq('id', plan.id)
      .select()
      .single()
    if (error) throw error
    return data
  } else {
    const { data, error } = await supabase
      .from('training_plans')
      .insert([plan])
      .select()
      .single()
    if (error) throw error
    return data
  }
}

export const deleteTrainingPlan = async (id) => {
  const { error } = await supabase
    .from('training_plans')
    .delete()
    .eq('id', id)
  if (error) throw error
}

// Finances
export const getFinances = async () => {
  const { data, error } = await supabase
    .from('finances')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data || []
}

export const saveFinance = async (finance) => {
  if (finance.id) {
    const { data, error } = await supabase
      .from('finances')
      .update(finance)
      .eq('id', finance.id)
      .select()
      .single()
    if (error) throw error
    return data
  } else {
    const { data, error } = await supabase
      .from('finances')
      .insert([finance])
      .select()
      .single()
    if (error) throw error
    return data
  }
}

export const deleteFinance = async (id) => {
  const { error } = await supabase
    .from('finances')
    .delete()
    .eq('id', id)
  if (error) throw error
}

// Bookings Management
export const getBookings = async () => {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .order('date', { ascending: true })
    .order('start_time', { ascending: true })
  
  if (error) throw error
  return data || []
}

export const getBookingsByDateRange = async (startDate, endDate) => {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: true })
    .order('start_time', { ascending: true })
  
  if (error) throw error
  return data || []
}

export const saveBooking = async (booking) => {
  let result
  if (booking.id) {
    const { data, error } = await supabase
      .from('bookings')
      .update(booking)
      .eq('id', booking.id)
      .select()
      .single()
    if (error) throw error
    result = data
  } else {
    const { data, error } = await supabase
      .from('bookings')
      .insert([booking])
      .select()
      .single()
    if (error) throw error
    result = data
  }
  
  // Auto-sync to finance if payment is made or booking is completed
  if (result && (result.payment_status === 'paid' || result.payment_status === 'partial' || result.status === 'completed')) {
    try {
      await syncBookingToFinance(result.student_id)
    } catch (error) {
      console.warn('Failed to sync booking to finance:', error)
      // Don't throw - booking save should still succeed
    }
  }
  
  return result
}

export const deleteBooking = async (id) => {
  const { error } = await supabase
    .from('bookings')
    .delete()
    .eq('id', id)
  if (error) throw error
}

// Finance-Booking Integration
export const getBookingsByStudent = async (studentId) => {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('student_id', studentId)
    .order('date', { ascending: false })
  
  if (error) throw error
  return data || []
}

export const syncBookingToFinance = async (studentId) => {
  try {
    // Get all bookings for student
    const bookings = await getBookingsByStudent(studentId)
    
    // Calculate totals from bookings
    let totalHoursUsed = 0
    let totalRevenue = 0
    let hourlyRate = 0
    let totalHoursFromPaidBookings = 0
    
    bookings.forEach(booking => {
      // Calculate hours from time difference
      const start = new Date(`2000-01-01T${booking.start_time}`)
      const end = new Date(`2000-01-01T${booking.end_time}`)
      const hours = (end - start) / (1000 * 60 * 60)
      
      // Add to hours used if completed
      if (booking.status === 'completed') {
        totalHoursUsed += hours
      }
      
      // Calculate hours paid from paid bookings
      if (booking.payment_status === 'paid') {
        totalHoursFromPaidBookings += hours
        totalRevenue += parseFloat(booking.amount_paid || booking.amount_due || 0)
        
        // Get hourly rate from booking
        if (booking.amount_due > 0 && hours > 0) {
          const rate = parseFloat(booking.amount_due) / hours
          if (rate > 0) {
            hourlyRate = rate // Use latest rate
          }
        }
      } else if (booking.payment_status === 'partial' && booking.amount_paid > 0) {
        // For partial payments, calculate proportional hours
        if (booking.amount_due > 0 && hours > 0) {
          const rate = parseFloat(booking.amount_due) / hours
          const paidHours = parseFloat(booking.amount_paid) / rate
          totalHoursFromPaidBookings += paidHours
          totalRevenue += parseFloat(booking.amount_paid)
          
          if (rate > 0 && hourlyRate === 0) {
            hourlyRate = rate
          }
        }
      }
    })
    
    // Get or create finance record
    const { data: existingFinance } = await supabase
      .from('finances')
      .select('*')
      .eq('student_id', studentId)
      .single()
    
    if (existingFinance) {
      // Update existing finance with booking data (only if bookings exist)
      const updatedFinance = {
        ...existingFinance,
        hours_used: totalHoursUsed > 0 ? totalHoursUsed : existingFinance.hours_used,
        hourly_rate: hourlyRate > 0 ? hourlyRate : existingFinance.hourly_rate,
      }
      // Only update hours_paid if we have paid bookings
      if (totalHoursFromPaidBookings > 0) {
        updatedFinance.hours_paid = totalHoursFromPaidBookings
      }
      return await saveFinance(updatedFinance)
    } else if (totalHoursFromPaidBookings > 0 || totalHoursUsed > 0) {
      // Create new finance record only if there's data
      return await saveFinance({
        student_id: studentId,
        hours_paid: totalHoursFromPaidBookings,
        hours_used: totalHoursUsed,
        hourly_rate: hourlyRate,
      })
    }
    
    return null
  } catch (error) {
    console.error('Error syncing booking to finance:', error)
    throw error
  }
}

export const calculateBookingHours = (startTime, endTime) => {
  const start = new Date(`2000-01-01T${startTime}`)
  const end = new Date(`2000-01-01T${endTime}`)
  return (end - start) / (1000 * 60 * 60)
}

