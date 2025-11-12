import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getSessions, saveSessions, getStudents, getTrainingPlans } from '../utils/storage';
import { format } from 'date-fns';
import SessionModal from '../components/SessionModal';

export default function SessionsScreen() {
  const [sessions, setSessions] = useState([]);
  const [students, setStudents] = useState([]);
  const [trainingPlans, setTrainingPlans] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [sessionsData, studentsData, plansData] = await Promise.all([
      getSessions(),
      getStudents(),
      getTrainingPlans(),
    ]);
    setSessions(sessionsData.sort((a, b) => new Date(b.date) - new Date(a.date)));
    setStudents(studentsData);
    setTrainingPlans(plansData);
  };

  const handleAddSession = () => {
    setSelectedSession(null);
    setModalVisible(true);
  };

  const handleEditSession = (session) => {
    setSelectedSession(session);
    setModalVisible(true);
  };

  const handleDeleteSession = (id) => {
    Alert.alert(
      'Delete Session',
      'Are you sure you want to delete this session?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const updated = sessions.filter(s => s.id !== id);
            await saveSessions(updated);
            setSessions(updated.sort((a, b) => new Date(b.date) - new Date(a.date)));
          },
        },
      ]
    );
  };

  const handleSaveSession = async (sessionData) => {
    let updated;
    if (selectedSession) {
      updated = sessions.map(s => s.id === selectedSession.id ? { ...sessionData, id: selectedSession.id } : s);
    } else {
      updated = [...sessions, { ...sessionData, id: Date.now().toString() }];
    }
    await saveSessions(updated);
    setSessions(updated.sort((a, b) => new Date(b.date) - new Date(a.date)));
    setModalVisible(false);
    setSelectedSession(null);
    loadData();
  };

  const getStudentName = (studentId) => {
    const student = students.find(s => s.id === studentId);
    return student ? student.name : 'Unknown';
  };

  const getWeekNumber = (date) => {
    const startDate = new Date(date);
    const today = new Date();
    const diffTime = Math.abs(today - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.floor(diffDays / 7) + 1;
  };

  const renderSession = ({ item }) => {
    const studentName = getStudentName(item.studentId);
    const weekNumber = getWeekNumber(item.date);

    return (
      <TouchableOpacity
        className="bg-white rounded-xl p-4 mb-3 mx-4 shadow-sm border border-gray-200"
        onPress={() => handleEditSession(item)}
      >
        <View className="flex-row justify-between items-start mb-2">
          <View className="flex-1">
            <Text className="text-lg font-bold text-gray-800">{studentName}</Text>
            <Text className="text-sm text-gray-500">{format(new Date(item.date), 'MMM dd, yyyy')}</Text>
          </View>
          <View className="bg-green-100 px-3 py-1 rounded-full">
            <Text className="text-green-700 font-semibold text-xs">Week {weekNumber}</Text>
          </View>
        </View>
        
        {item.trainingPlan && (
          <Text className="text-sm text-gray-600 mb-2">Plan: {item.trainingPlan}</Text>
        )}
        
        {item.rating && (
          <View className="flex-row items-center mb-2">
            <Text className="text-sm text-gray-600 mr-2">Rating:</Text>
            {[...Array(5)].map((_, i) => (
              <Ionicons
                key={i}
                name={i < item.rating ? 'star' : 'star-outline'}
                size={16}
                color="#fbbf24"
              />
            ))}
          </View>
        )}
        
        {item.notes && (
          <Text className="text-sm text-gray-600 mb-2" numberOfLines={2}>{item.notes}</Text>
        )}
        
        {item.thingsToWorkOn && item.thingsToWorkOn.length > 0 && (
          <View className="mt-2">
            <Text className="text-xs text-gray-500 mb-1">Things to work on:</Text>
            <Text className="text-xs text-gray-600">{item.thingsToWorkOn.join(', ')}</Text>
          </View>
        )}

        <TouchableOpacity
          className="absolute top-4 right-4"
          onPress={() => handleDeleteSession(item.id)}
        >
          <Ionicons name="trash-outline" size={20} color="#ef4444" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      <FlatList
        data={sessions}
        renderItem={renderSession}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingVertical: 16 }}
        ListEmptyComponent={
          <View className="items-center justify-center py-20">
            <Ionicons name="calendar-outline" size={64} color="#d1d5db" />
            <Text className="text-gray-400 text-lg mt-4">No sessions yet</Text>
            <Text className="text-gray-400 text-sm mt-2">Tap + to add your first session</Text>
          </View>
        }
      />
      <TouchableOpacity
        className="absolute bottom-6 right-6 w-16 h-16 bg-green-600 rounded-full items-center justify-center shadow-lg"
        onPress={handleAddSession}
      >
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>
      <SessionModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setSelectedSession(null);
        }}
        onSave={handleSaveSession}
        session={selectedSession}
        students={students}
        trainingPlans={trainingPlans}
      />
    </View>
  );
}

