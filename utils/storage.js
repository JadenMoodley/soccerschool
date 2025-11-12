import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  PIN: '@soccer_school:pin',
  STUDENTS: '@soccer_school:students',
  SESSIONS: '@soccer_school:sessions',
  TRAINING_PLANS: '@soccer_school:training_plans',
  FINANCES: '@soccer_school:finances',
};

// PIN Management
export const getPin = async () => {
  try {
    const pin = await AsyncStorage.getItem(STORAGE_KEYS.PIN);
    return pin || '2005'; // Default PIN
  } catch (error) {
    console.error('Error getting PIN:', error);
    return '2005';
  }
};

export const setPin = async (pin) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.PIN, pin);
    return true;
  } catch (error) {
    console.error('Error setting PIN:', error);
    return false;
  }
};

// Students Management
export const getStudents = async () => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.STUDENTS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting students:', error);
    return [];
  }
};

export const saveStudents = async (students) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
    return true;
  } catch (error) {
    console.error('Error saving students:', error);
    return false;
  }
};

// Sessions Management
export const getSessions = async () => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.SESSIONS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting sessions:', error);
    return [];
  }
};

export const saveSessions = async (sessions) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
    return true;
  } catch (error) {
    console.error('Error saving sessions:', error);
    return false;
  }
};

// Training Plans Management
export const getTrainingPlans = async () => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.TRAINING_PLANS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting training plans:', error);
    return [];
  }
};

export const saveTrainingPlans = async (plans) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.TRAINING_PLANS, JSON.stringify(plans));
    return true;
  } catch (error) {
    console.error('Error saving training plans:', error);
    return false;
  }
};

// Finances Management
export const getFinances = async () => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.FINANCES);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting finances:', error);
    return [];
  }
};

export const saveFinances = async (finances) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.FINANCES, JSON.stringify(finances));
    return true;
  } catch (error) {
    console.error('Error saving finances:', error);
    return false;
  }
};

