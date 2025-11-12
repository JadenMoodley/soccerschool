import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getSessions, getTrainingPlans, getFinances } from '../utils/storage';
import { format } from 'date-fns';

export default function StudentDetailScreen({ route, navigation: nav }) {
  const { student } = route.params;
  const [sessions, setSessions] = useState([]);
  const [finance, setFinance] = useState(null);
  const [stats, setStats] = useState({
    totalSessions: 0,
    averageRating: 0,
    weeksActive: 0,
  });

  useEffect(() => {
    loadStudentData();
  }, [student]);

  const loadStudentData = async () => {
    const [allSessions, finances] = await Promise.all([
      getSessions(),
      getFinances(),
    ]);

    const studentSessions = allSessions
      .filter(s => s.studentId === student.id)
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    setSessions(studentSessions);

    const studentFinance = finances.find(f => f.studentId === student.id);
    setFinance(studentFinance);

    // Calculate stats
    const ratings = studentSessions.filter(s => s.rating).map(s => s.rating);
    const averageRating = ratings.length > 0
      ? ratings.reduce((a, b) => a + b, 0) / ratings.length
      : 0;

    const firstSession = studentSessions[studentSessions.length - 1];
    const weeksActive = firstSession
      ? Math.floor((new Date() - new Date(firstSession.date)) / (1000 * 60 * 60 * 24 * 7)) + 1
      : 0;

    setStats({
      totalSessions: studentSessions.length,
      averageRating: averageRating.toFixed(1),
      weeksActive: Math.max(weeksActive, 0),
    });
  };

  const renderSession = ({ item }) => {
    const weekNumber = Math.floor((new Date() - new Date(item.date)) / (1000 * 60 * 60 * 24 * 7)) + 1;

    return (
      <View className="bg-white rounded-xl p-4 mb-3 mx-4 shadow-sm border border-gray-200">
        <View className="flex-row justify-between items-start mb-2">
          <View className="flex-1">
            <Text className="text-base font-bold text-gray-800">
              {format(new Date(item.date), 'MMM dd, yyyy')}
            </Text>
            {item.trainingPlan && (
              <Text className="text-sm text-gray-500 mt-1">{item.trainingPlan}</Text>
            )}
          </View>
          <View className="bg-green-100 px-3 py-1 rounded-full">
            <Text className="text-green-700 font-semibold text-xs">Week {weekNumber}</Text>
          </View>
        </View>

        {item.rating > 0 && (
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
          <Text className="text-sm text-gray-600 mb-2">{item.notes}</Text>
        )}

        {item.thingsToWorkOn && item.thingsToWorkOn.length > 0 && (
          <View className="mt-2">
            <Text className="text-xs text-gray-500 mb-1">Things to work on:</Text>
            <View className="flex-row flex-wrap">
              {item.thingsToWorkOn.map((item, index) => (
                <View key={index} className="bg-yellow-100 px-2 py-1 rounded-full mr-2 mb-1">
                  <Text className="text-yellow-700 text-xs">{item}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="bg-green-600 pt-12 pb-6 px-4">
        <TouchableOpacity
          className="absolute top-12 left-4 z-10"
          onPress={() => nav.goBack()}
        >
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <View className="items-center mt-4">
          {student.picture ? (
            <Image source={{ uri: student.picture }} className="w-24 h-24 rounded-full mb-4" />
          ) : (
            <View className="w-24 h-24 rounded-full bg-white/20 items-center justify-center mb-4">
              <Ionicons name="person" size={48} color="#fff" />
            </View>
          )}
          <Text className="text-2xl font-bold text-white">{student.name}</Text>
          {student.age && (
            <Text className="text-white/80 mt-1">Age: {student.age}</Text>
          )}
          {student.paymentStatus && (
            <View className="mt-2">
              <View className={`px-4 py-1 rounded-full ${
                student.paymentStatus === 'paid' ? 'bg-green-500' : 'bg-yellow-500'
              }`}>
                <Text className="text-white font-semibold text-sm">
                  {student.paymentStatus.toUpperCase()}
                </Text>
              </View>
            </View>
          )}
        </View>
      </View>

      <View className="p-4">
        <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
          <Text className="text-lg font-bold text-gray-800 mb-4">Statistics</Text>
          <View className="flex-row justify-between">
            <View className="items-center flex-1">
              <Ionicons name="calendar" size={32} color="#16a34a" />
              <Text className="text-2xl font-bold text-gray-800 mt-2">{stats.totalSessions}</Text>
              <Text className="text-sm text-gray-500">Sessions</Text>
            </View>
            <View className="items-center flex-1">
              <Ionicons name="star" size={32} color="#fbbf24" />
              <Text className="text-2xl font-bold text-gray-800 mt-2">{stats.averageRating}</Text>
              <Text className="text-sm text-gray-500">Avg Rating</Text>
            </View>
            <View className="items-center flex-1">
              <Ionicons name="time" size={32} color="#16a34a" />
              <Text className="text-2xl font-bold text-gray-800 mt-2">{stats.weeksActive}</Text>
              <Text className="text-sm text-gray-500">Weeks</Text>
            </View>
          </View>
        </View>

        {finance && (
          <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
            <Text className="text-lg font-bold text-gray-800 mb-4">Finance</Text>
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600">Hours Paid:</Text>
              <Text className="font-semibold text-gray-800">{finance.hoursPaid || 0} hrs</Text>
            </View>
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600">Hours Used:</Text>
              <Text className="font-semibold text-gray-800">{finance.hoursUsed || 0} hrs</Text>
            </View>
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600">Remaining:</Text>
              <Text className={`font-semibold ${
                (finance.hoursPaid || 0) - (finance.hoursUsed || 0) >= 0
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}>
                {(finance.hoursPaid || 0) - (finance.hoursUsed || 0)} hrs
              </Text>
            </View>
            {finance.hourlyRate > 0 && (
              <View className="mt-3 pt-3 border-t border-gray-200">
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Revenue:</Text>
                  <Text className="font-semibold text-green-600">
                    ${((finance.hoursPaid || 0) * (finance.hourlyRate || 0)).toFixed(2)}
                  </Text>
                </View>
              </View>
            )}
          </View>
        )}

        <Text className="text-lg font-bold text-gray-800 px-4 mb-2">Session History</Text>
        {sessions.length === 0 ? (
          <View className="items-center justify-center py-10">
            <Ionicons name="calendar-outline" size={64} color="#d1d5db" />
            <Text className="text-gray-400 text-lg mt-4">No sessions yet</Text>
          </View>
        ) : (
          <FlatList
            data={sessions}
            renderItem={renderSession}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        )}
      </View>
    </ScrollView>
  );
}

