import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getStudents, saveStudents } from '../utils/storage';
import * as ImagePicker from 'expo-image-picker';
import StudentModal from '../components/StudentModal';

export default function StudentsScreen({ navigation }) {
  const [students, setStudents] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    const data = await getStudents();
    setStudents(data);
  };

  const handleAddStudent = () => {
    setSelectedStudent(null);
    setModalVisible(true);
  };

  const handleEditStudent = (student) => {
    setSelectedStudent(student);
    setModalVisible(true);
  };

  const handleDeleteStudent = (id) => {
    Alert.alert(
      'Delete Student',
      'Are you sure you want to delete this student?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const updated = students.filter(s => s.id !== id);
            await saveStudents(updated);
            setStudents(updated);
          },
        },
      ]
    );
  };

  const handleSaveStudent = async (studentData) => {
    let updated;
    if (selectedStudent) {
      updated = students.map(s => s.id === selectedStudent.id ? { ...studentData, id: selectedStudent.id } : s);
    } else {
      updated = [...students, { ...studentData, id: Date.now().toString() }];
    }
    await saveStudents(updated);
    setStudents(updated);
    setModalVisible(false);
    setSelectedStudent(null);
  };

  const renderStudent = ({ item }) => (
    <TouchableOpacity
      className="bg-white rounded-xl p-4 mb-3 mx-4 shadow-sm border border-gray-200"
      onPress={() => navigation.navigate('StudentDetail', { student: item })}
      onLongPress={() => handleEditStudent(item)}
    >
      <View className="flex-row items-center">
        {item.picture ? (
          <Image source={{ uri: item.picture }} className="w-16 h-16 rounded-full mr-4" />
        ) : (
          <View className="w-16 h-16 rounded-full bg-gray-300 mr-4 items-center justify-center">
            <Ionicons name="person" size={32} color="#9ca3af" />
          </View>
        )}
        <View className="flex-1">
          <Text className="text-lg font-bold text-gray-800">{item.name}</Text>
          <Text className="text-sm text-gray-500">Age: {item.age || 'N/A'}</Text>
          {item.paymentStatus && (
            <View className="mt-1">
              <Text className={`text-xs px-2 py-1 rounded-full ${item.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {item.paymentStatus}
              </Text>
            </View>
          )}
        </View>
        <TouchableOpacity
          onPress={() => handleDeleteStudent(item.id)}
          className="p-2"
        >
          <Ionicons name="trash-outline" size={24} color="#ef4444" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-gray-50">
      <FlatList
        data={students}
        renderItem={renderStudent}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingVertical: 16 }}
        ListEmptyComponent={
          <View className="items-center justify-center py-20">
            <Ionicons name="people-outline" size={64} color="#d1d5db" />
            <Text className="text-gray-400 text-lg mt-4">No students yet</Text>
            <Text className="text-gray-400 text-sm mt-2">Tap + to add your first student</Text>
          </View>
        }
      />
      <TouchableOpacity
        className="absolute bottom-6 right-6 w-16 h-16 bg-green-600 rounded-full items-center justify-center shadow-lg"
        onPress={handleAddStudent}
      >
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>
      <StudentModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setSelectedStudent(null);
        }}
        onSave={handleSaveStudent}
        student={selectedStudent}
      />
    </View>
  );
}

