import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function FinanceModal({ visible, onClose, onSave, finance, students }) {
  const [studentId, setStudentId] = useState('');
  const [hoursPaid, setHoursPaid] = useState('');
  const [hoursUsed, setHoursUsed] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [hourlyCost, setHourlyCost] = useState('');

  useEffect(() => {
    if (finance) {
      setStudentId(finance.studentId || '');
      setHoursPaid(finance.hoursPaid?.toString() || '');
      setHoursUsed(finance.hoursUsed?.toString() || '');
      setHourlyRate(finance.hourlyRate?.toString() || '');
      setHourlyCost(finance.hourlyCost?.toString() || '');
    } else {
      resetForm();
    }
  }, [finance, visible]);

  const resetForm = () => {
    setStudentId('');
    setHoursPaid('');
    setHoursUsed('');
    setHourlyRate('');
    setHourlyCost('');
  };

  const handleSave = () => {
    if (!studentId) {
      Alert.alert('Error', 'Please select a student');
      return;
    }

    onSave({
      studentId,
      hoursPaid: hoursPaid ? parseFloat(hoursPaid) : 0,
      hoursUsed: hoursUsed ? parseFloat(hoursUsed) : 0,
      hourlyRate: hourlyRate ? parseFloat(hourlyRate) : 0,
      hourlyCost: hourlyCost ? parseFloat(hourlyCost) : 0,
    });
    resetForm();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white rounded-t-3xl max-h-[90%]">
          <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
            <Text className="text-xl font-bold text-gray-800">
              {finance ? 'Edit Finance' : 'Add Finance'}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={28} color="#374151" />
            </TouchableOpacity>
          </View>

          <ScrollView className="p-4">
            <Text className="text-gray-700 font-semibold mb-2">Student *</Text>
            <View className="bg-gray-100 rounded-xl mb-4 border border-gray-300">
              {students.length === 0 ? (
                <Text className="px-4 py-3 text-gray-400">No students available</Text>
              ) : (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-2 py-2">
                  {students.map((student) => (
                    <TouchableOpacity
                      key={student.id}
                      className={`px-4 py-2 rounded-lg mr-2 ${
                        studentId === student.id ? 'bg-green-600' : 'bg-white'
                      }`}
                      onPress={() => setStudentId(student.id)}
                    >
                      <Text
                        className={`font-semibold ${
                          studentId === student.id ? 'text-white' : 'text-gray-700'
                        }`}
                      >
                        {student.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </View>

            <Text className="text-gray-700 font-semibold mb-2">Hours Paid</Text>
            <TextInput
              className="bg-gray-100 rounded-xl px-4 py-3 mb-4 border border-gray-300"
              value={hoursPaid}
              onChangeText={setHoursPaid}
              placeholder="e.g., 250"
              keyboardType="decimal-pad"
            />

            <Text className="text-gray-700 font-semibold mb-2">Hours Used</Text>
            <TextInput
              className="bg-gray-100 rounded-xl px-4 py-3 mb-4 border border-gray-300"
              value={hoursUsed}
              onChangeText={setHoursUsed}
              placeholder="e.g., 6"
              keyboardType="decimal-pad"
            />

            <Text className="text-gray-700 font-semibold mb-2">Hourly Rate ($)</Text>
            <TextInput
              className="bg-gray-100 rounded-xl px-4 py-3 mb-4 border border-gray-300"
              value={hourlyRate}
              onChangeText={setHourlyRate}
              placeholder="e.g., 50"
              keyboardType="decimal-pad"
            />

            <Text className="text-gray-700 font-semibold mb-2">Hourly Cost ($)</Text>
            <TextInput
              className="bg-gray-100 rounded-xl px-4 py-3 mb-4 border border-gray-300"
              value={hourlyCost}
              onChangeText={setHourlyCost}
              placeholder="e.g., 20"
              keyboardType="decimal-pad"
            />

            <TouchableOpacity
              className="bg-green-600 rounded-xl py-4 mt-4"
              onPress={handleSave}
            >
              <Text className="text-white text-center font-bold text-lg">Save</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

