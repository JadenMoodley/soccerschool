import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function TrainingPlanModal({ visible, onClose, onSave, plan }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [drills, setDrills] = useState([]);
  const [newDrill, setNewDrill] = useState('');

  useEffect(() => {
    if (plan) {
      setName(plan.name || '');
      setDescription(plan.description || '');
      setDrills(plan.drills || []);
    } else {
      resetForm();
    }
  }, [plan, visible]);

  const resetForm = () => {
    setName('');
    setDescription('');
    setDrills([]);
    setNewDrill('');
  };

  const handleAddDrill = () => {
    if (newDrill.trim()) {
      setDrills([...drills, newDrill.trim()]);
      setNewDrill('');
    }
  };

  const handleRemoveDrill = (index) => {
    setDrills(drills.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!name.trim()) {
      alert('Please enter a plan name');
      return;
    }

    onSave({
      name: name.trim(),
      description: description.trim(),
      drills,
    });
    resetForm();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white rounded-t-3xl max-h-[90%]">
          <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
            <Text className="text-xl font-bold text-gray-800">
              {plan ? 'Edit Training Plan' : 'Add Training Plan'}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={28} color="#374151" />
            </TouchableOpacity>
          </View>

          <ScrollView className="p-4">
            <Text className="text-gray-700 font-semibold mb-2">Plan Name *</Text>
            <TextInput
              className="bg-gray-100 rounded-xl px-4 py-3 mb-4 border border-gray-300"
              value={name}
              onChangeText={setName}
              placeholder="e.g., Ball Work"
            />

            <Text className="text-gray-700 font-semibold mb-2">Description</Text>
            <TextInput
              className="bg-gray-100 rounded-xl px-4 py-3 mb-4 border border-gray-300"
              value={description}
              onChangeText={setDescription}
              placeholder="Brief description of the plan"
              multiline
              numberOfLines={2}
            />

            <Text className="text-gray-700 font-semibold mb-2">Drills</Text>
            <View className="flex-row mb-2">
              <TextInput
                className="flex-1 bg-gray-100 rounded-xl px-4 py-3 mr-2 border border-gray-300"
                value={newDrill}
                onChangeText={setNewDrill}
                placeholder="Add drill..."
                onSubmitEditing={handleAddDrill}
              />
              <TouchableOpacity
                className="bg-green-600 rounded-xl px-4 py-3"
                onPress={handleAddDrill}
              >
                <Ionicons name="add" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
            {drills.map((drill, index) => (
              <View key={index} className="flex-row items-center bg-gray-100 rounded-xl px-4 py-2 mb-2">
                <Text className="flex-1 text-gray-700">{drill}</Text>
                <TouchableOpacity onPress={() => handleRemoveDrill(index)}>
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

