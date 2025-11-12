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

