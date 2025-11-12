import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SessionModal({ visible, onClose, onSave, session, students, trainingPlans }) {
  const [studentId, setStudentId] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [trainingPlan, setTrainingPlan] = useState('');
  const [rating, setRating] = useState(0);
  const [notes, setNotes] = useState('');
  const [thingsToWorkOn, setThingsToWorkOn] = useState([]);
  const [newThingToWorkOn, setNewThingToWorkOn] = useState('');

  useEffect(() => {
    if (session) {
      setStudentId(session.studentId || '');
      setDate(session.date ? new Date(session.date) : new Date());
      setTrainingPlan(session.trainingPlan || '');
      setRating(session.rating || 0);
      setNotes(session.notes || '');
      setThingsToWorkOn(session.thingsToWorkOn || []);
    } else {
      resetForm();
    }
  }, [session, visible]);

  const resetForm = () => {
    setStudentId('');
    setDate(new Date());
    setTrainingPlan('');
    setRating(0);
    setNotes('');
    setThingsToWorkOn([]);
    setNewThingToWorkOn('');
  };

  const handleAddThingToWorkOn = () => {
    if (newThingToWorkOn.trim()) {
      setThingsToWorkOn([...thingsToWorkOn, newThingToWorkOn.trim()]);
      setNewThingToWorkOn('');
    }
  };

  const handleRemoveThingToWorkOn = (index) => {
    setThingsToWorkOn(thingsToWorkOn.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!studentId) {
      Alert.alert('Error', 'Please select a student');
      return;
    }

    onSave({
      studentId,
      date: date.toISOString(),
      trainingPlan,
      rating,
      notes: notes.trim(),
      thingsToWorkOn,
    });
    resetForm();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white rounded-t-3xl max-h-[90%]">
          <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
            <Text className="text-xl font-bold text-gray-800">
              {session ? 'Edit Session' : 'Add Session'}
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

            <Text className="text-gray-700 font-semibold mb-2">Date *</Text>
            <TouchableOpacity
              className="bg-gray-100 rounded-xl px-4 py-3 mb-4 border border-gray-300"
              onPress={() => setShowDatePicker(true)}
            >
              <Text className="text-gray-800">
                {date.toLocaleDateString()}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <View className="bg-white rounded-xl p-4 mb-4 border border-gray-300">
                <View className="flex-row justify-between items-center mb-4">
                  <Text className="text-lg font-bold">Select Date</Text>
                  <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                    <Ionicons name="close" size={24} color="#374151" />
                  </TouchableOpacity>
                </View>
                <View className="flex-row justify-between mb-2">
                  <TextInput
                    className="flex-1 bg-gray-100 rounded-lg px-3 py-2 mr-2 text-center"
                    value={date.getMonth() + 1 + ''}
                    onChangeText={(text) => {
                      const month = parseInt(text) || 1;
                      if (month >= 1 && month <= 12) {
                        const newDate = new Date(date);
                        newDate.setMonth(month - 1);
                        setDate(newDate);
                      }
                    }}
                    placeholder="MM"
                    keyboardType="number-pad"
                    maxLength={2}
                  />
                  <TextInput
                    className="flex-1 bg-gray-100 rounded-lg px-3 py-2 mr-2 text-center"
                    value={date.getDate() + ''}
                    onChangeText={(text) => {
                      const day = parseInt(text) || 1;
                      if (day >= 1 && day <= 31) {
                        const newDate = new Date(date);
                        newDate.setDate(day);
                        setDate(newDate);
                      }
                    }}
                    placeholder="DD"
                    keyboardType="number-pad"
                    maxLength={2}
                  />
                  <TextInput
                    className="flex-1 bg-gray-100 rounded-lg px-3 py-2 text-center"
                    value={date.getFullYear() + ''}
                    onChangeText={(text) => {
                      const year = parseInt(text) || new Date().getFullYear();
                      if (year >= 2020 && year <= 2100) {
                        const newDate = new Date(date);
                        newDate.setFullYear(year);
                        setDate(newDate);
                      }
                    }}
                    placeholder="YYYY"
                    keyboardType="number-pad"
                    maxLength={4}
                  />
                </View>
                <TouchableOpacity
                  className="bg-green-600 rounded-lg py-2 mt-2"
                  onPress={() => setShowDatePicker(false)}
                >
                  <Text className="text-white text-center font-semibold">Done</Text>
                </TouchableOpacity>
              </View>
            )}

            <Text className="text-gray-700 font-semibold mb-2">Training Plan</Text>
            <View className="bg-gray-100 rounded-xl mb-4 border border-gray-300">
              {trainingPlans.length === 0 ? (
                <Text className="px-4 py-3 text-gray-400">No training plans available</Text>
              ) : (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-2 py-2">
                  {trainingPlans.map((plan, index) => (
                    <TouchableOpacity
                      key={index}
                      className={`px-4 py-2 rounded-lg mr-2 ${
                        trainingPlan === plan.name ? 'bg-green-600' : 'bg-white'
                      }`}
                      onPress={() => setTrainingPlan(plan.name)}
                    >
                      <Text
                        className={`font-semibold ${
                          trainingPlan === plan.name ? 'text-white' : 'text-gray-700'
                        }`}
                      >
                        {plan.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </View>

            <Text className="text-gray-700 font-semibold mb-2">Rating</Text>
            <View className="flex-row justify-center mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  onPress={() => setRating(star)}
                  className="mx-1"
                >
                  <Ionicons
                    name={star <= rating ? 'star' : 'star-outline'}
                    size={32}
                    color="#fbbf24"
                  />
                </TouchableOpacity>
              ))}
            </View>

            <Text className="text-gray-700 font-semibold mb-2">Notes</Text>
            <TextInput
              className="bg-gray-100 rounded-xl px-4 py-3 mb-4 border border-gray-300"
              value={notes}
              onChangeText={setNotes}
              placeholder="Add notes about the session..."
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />

            <Text className="text-gray-700 font-semibold mb-2">Things to Work On</Text>
            <View className="flex-row mb-2">
              <TextInput
                className="flex-1 bg-gray-100 rounded-xl px-4 py-3 mr-2 border border-gray-300"
                value={newThingToWorkOn}
                onChangeText={setNewThingToWorkOn}
                placeholder="Add item..."
                onSubmitEditing={handleAddThingToWorkOn}
              />
              <TouchableOpacity
                className="bg-green-600 rounded-xl px-4 py-3"
                onPress={handleAddThingToWorkOn}
              >
                <Ionicons name="add" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
            {thingsToWorkOn.map((item, index) => (
              <View key={index} className="flex-row items-center bg-gray-100 rounded-xl px-4 py-2 mb-2">
                <Text className="flex-1 text-gray-700">{item}</Text>
                <TouchableOpacity onPress={() => handleRemoveThingToWorkOn(index)}>
                  <Ionicons name="close-circle" size={24} color="#ef4444" />
                </TouchableOpacity>
              </View>
            ))}

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

