import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getTrainingPlans, saveTrainingPlans } from '../utils/storage';
import TrainingPlanModal from '../components/TrainingPlanModal';

export default function TrainingPlansScreen() {
  const [trainingPlans, setTrainingPlans] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    loadTrainingPlans();
  }, []);

  const loadTrainingPlans = async () => {
    const data = await getTrainingPlans();
    if (data.length === 0) {
      // Initialize with default training plans
      const defaultPlans = [
        {
          id: '1',
          name: 'Ball Work',
          drills: ['Dribbling Drills', 'Ball Control', 'First Touch', 'Passing Accuracy'],
          description: 'Fundamental ball handling skills',
        },
        {
          id: '2',
          name: 'Shooting',
          drills: ['Finishing', 'Power Shots', 'Placement', 'Volleys'],
          description: 'Goal scoring techniques',
        },
        {
          id: '3',
          name: 'Defending',
          drills: ['Tackling', 'Positioning', 'Interceptions', 'Clearances'],
          description: 'Defensive skills and tactics',
        },
        {
          id: '4',
          name: 'Fitness',
          drills: ['Sprints', 'Endurance', 'Agility', 'Strength'],
          description: 'Physical conditioning',
        },
      ];
      await saveTrainingPlans(defaultPlans);
      setTrainingPlans(defaultPlans);
    } else {
      setTrainingPlans(data);
    }
  };

  const handleAddPlan = () => {
    setSelectedPlan(null);
    setModalVisible(true);
  };

  const handleEditPlan = (plan) => {
    setSelectedPlan(plan);
    setModalVisible(true);
  };

  const handleDeletePlan = (id) => {
    Alert.alert(
      'Delete Training Plan',
      'Are you sure you want to delete this training plan?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const updated = trainingPlans.filter(p => p.id !== id);
            await saveTrainingPlans(updated);
            setTrainingPlans(updated);
          },
        },
      ]
    );
  };

  const handleSavePlan = async (planData) => {
    let updated;
    if (selectedPlan) {
      updated = trainingPlans.map(p => p.id === selectedPlan.id ? { ...planData, id: selectedPlan.id } : p);
    } else {
      updated = [...trainingPlans, { ...planData, id: Date.now().toString() }];
    }
    await saveTrainingPlans(updated);
    setTrainingPlans(updated);
    setModalVisible(false);
    setSelectedPlan(null);
  };

  const renderPlan = ({ item }) => (
    <TouchableOpacity
      className="bg-white rounded-xl p-4 mb-3 mx-4 shadow-sm border border-gray-200"
      onPress={() => handleEditPlan(item)}
    >
      <View className="flex-row justify-between items-start mb-2">
        <View className="flex-1">
          <Text className="text-lg font-bold text-gray-800">{item.name}</Text>
          {item.description && (
            <Text className="text-sm text-gray-500 mt-1">{item.description}</Text>
          )}
        </View>
        <TouchableOpacity
          onPress={() => handleDeletePlan(item.id)}
          className="p-2"
        >
          <Ionicons name="trash-outline" size={20} color="#ef4444" />
        </TouchableOpacity>
      </View>
      
      {item.drills && item.drills.length > 0 && (
        <View className="mt-3">
          <Text className="text-xs text-gray-500 mb-2">Drills:</Text>
          <View className="flex-row flex-wrap">
            {item.drills.map((drill, index) => (
              <View key={index} className="bg-green-100 px-3 py-1 rounded-full mr-2 mb-2">
                <Text className="text-green-700 text-xs">{drill}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-gray-50">
      <FlatList
        data={trainingPlans}
        renderItem={renderPlan}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingVertical: 16 }}
        ListEmptyComponent={
          <View className="items-center justify-center py-20">
            <Ionicons name="football-outline" size={64} color="#d1d5db" />
            <Text className="text-gray-400 text-lg mt-4">No training plans yet</Text>
            <Text className="text-gray-400 text-sm mt-2">Tap + to add your first plan</Text>
          </View>
        }
      />
      <TouchableOpacity
        className="absolute bottom-6 right-6 w-16 h-16 bg-green-600 rounded-full items-center justify-center shadow-lg"
        onPress={handleAddPlan}
      >
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>
      <TrainingPlanModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setSelectedPlan(null);
        }}
        onSave={handleSavePlan}
        plan={selectedPlan}
      />
    </View>
  );
}

