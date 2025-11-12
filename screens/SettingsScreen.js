import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getPin, setPin } from '../utils/storage';
import { getStudents, getSessions } from '../utils/storage';

export default function SettingsScreen({ navigation }) {
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [showChangePin, setShowChangePin] = useState(false);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalSessions: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const [students, sessions] = await Promise.all([
      getStudents(),
      getSessions(),
    ]);
    setStats({
      totalStudents: students.length,
      totalSessions: sessions.length,
    });
  };

  const handleChangePin = async () => {
    if (!currentPin || !newPin || !confirmPin) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const storedPin = await getPin();
    if (currentPin !== storedPin) {
      Alert.alert('Error', 'Current PIN is incorrect');
      setCurrentPin('');
      return;
    }

    if (newPin.length !== 4) {
      Alert.alert('Error', 'PIN must be 4 digits');
      return;
    }

    if (newPin !== confirmPin) {
      Alert.alert('Error', 'New PINs do not match');
      setNewPin('');
      setConfirmPin('');
      return;
    }

    await setPin(newPin);
    Alert.alert('Success', 'PIN changed successfully');
    setShowChangePin(false);
    setCurrentPin('');
    setNewPin('');
    setConfirmPin('');
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => navigation.replace('Pin'),
        },
      ]
    );
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4">
        <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
          <Text className="text-lg font-bold text-gray-800 mb-4">Statistics</Text>
          <View className="flex-row justify-between">
            <View className="items-center flex-1">
              <Ionicons name="people" size={32} color="#16a34a" />
              <Text className="text-2xl font-bold text-gray-800 mt-2">{stats.totalStudents}</Text>
              <Text className="text-sm text-gray-500">Students</Text>
            </View>
            <View className="items-center flex-1">
              <Ionicons name="calendar" size={32} color="#16a34a" />
              <Text className="text-2xl font-bold text-gray-800 mt-2">{stats.totalSessions}</Text>
              <Text className="text-sm text-gray-500">Sessions</Text>
            </View>
          </View>
        </View>

        <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
          <Text className="text-lg font-bold text-gray-800 mb-4">Security</Text>
          
          {!showChangePin ? (
            <TouchableOpacity
              className="bg-green-600 rounded-xl py-4"
              onPress={() => setShowChangePin(true)}
            >
              <Text className="text-white text-center font-bold">Change PIN</Text>
            </TouchableOpacity>
          ) : (
            <View>
              <Text className="text-gray-700 font-semibold mb-2">Current PIN</Text>
              <TextInput
                className="bg-gray-100 rounded-xl px-4 py-3 mb-4 border border-gray-300"
                value={currentPin}
                onChangeText={setCurrentPin}
                placeholder="Enter current PIN"
                keyboardType="number-pad"
                secureTextEntry
                maxLength={4}
              />

              <Text className="text-gray-700 font-semibold mb-2">New PIN</Text>
              <TextInput
                className="bg-gray-100 rounded-xl px-4 py-3 mb-4 border border-gray-300"
                value={newPin}
                onChangeText={setNewPin}
                placeholder="Enter new PIN (4 digits)"
                keyboardType="number-pad"
                secureTextEntry
                maxLength={4}
              />

              <Text className="text-gray-700 font-semibold mb-2">Confirm New PIN</Text>
              <TextInput
                className="bg-gray-100 rounded-xl px-4 py-3 mb-4 border border-gray-300"
                value={confirmPin}
                onChangeText={setConfirmPin}
                placeholder="Confirm new PIN"
                keyboardType="number-pad"
                secureTextEntry
                maxLength={4}
              />

              <View className="flex-row">
                <TouchableOpacity
                  className="flex-1 bg-gray-300 rounded-xl py-4 mr-2"
                  onPress={() => {
                    setShowChangePin(false);
                    setCurrentPin('');
                    setNewPin('');
                    setConfirmPin('');
                  }}
                >
                  <Text className="text-gray-800 text-center font-bold">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-1 bg-green-600 rounded-xl py-4 ml-2"
                  onPress={handleChangePin}
                >
                  <Text className="text-white text-center font-bold">Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        <TouchableOpacity
          className="bg-red-600 rounded-xl py-4"
          onPress={handleLogout}
        >
          <Text className="text-white text-center font-bold">Logout</Text>
        </TouchableOpacity>

        <View className="mt-8 items-center">
          <Text className="text-gray-400 text-sm">Soccer School App</Text>
          <Text className="text-gray-400 text-xs mt-1">Version 1.0.0</Text>
        </View>
      </View>
    </ScrollView>
  );
}

