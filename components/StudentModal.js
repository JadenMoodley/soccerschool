import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'react-native';

export default function StudentModal({ visible, onClose, onSave, student }) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [picture, setPicture] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('unpaid');

  useEffect(() => {
    if (student) {
      setName(student.name || '');
      setAge(student.age?.toString() || '');
      setPhone(student.phone || '');
      setEmail(student.email || '');
      setPicture(student.picture || null);
      setPaymentStatus(student.paymentStatus || 'unpaid');
    } else {
      resetForm();
    }
  }, [student, visible]);

  const resetForm = () => {
    setName('');
    setAge('');
    setPhone('');
    setEmail('');
    setPicture(null);
    setPaymentStatus('unpaid');
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera roll permissions');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setPicture(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera permissions');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setPicture(result.assets[0].uri);
    }
  };

  const showImagePicker = () => {
    Alert.alert(
      'Select Image',
      'Choose an option',
      [
        { text: 'Camera', onPress: takePhoto },
        { text: 'Gallery', onPress: pickImage },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a name');
      return;
    }

    onSave({
      name: name.trim(),
      age: age ? parseInt(age) : null,
      phone: phone.trim(),
      email: email.trim(),
      picture,
      paymentStatus,
    });
    resetForm();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white rounded-t-3xl max-h-[90%]">
          <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
            <Text className="text-xl font-bold text-gray-800">
              {student ? 'Edit Student' : 'Add Student'}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={28} color="#374151" />
            </TouchableOpacity>
          </View>

          <ScrollView className="p-4">
            <TouchableOpacity
              className="items-center mb-6"
              onPress={showImagePicker}
            >
              {picture ? (
                <Image source={{ uri: picture }} className="w-24 h-24 rounded-full" />
              ) : (
                <View className="w-24 h-24 rounded-full bg-gray-200 items-center justify-center">
                  <Ionicons name="camera" size={32} color="#9ca3af" />
                </View>
              )}
              <Text className="text-green-600 mt-2">Tap to add photo</Text>
            </TouchableOpacity>

            <Text className="text-gray-700 font-semibold mb-2">Name *</Text>
            <TextInput
              className="bg-gray-100 rounded-xl px-4 py-3 mb-4 border border-gray-300"
              value={name}
              onChangeText={setName}
              placeholder="Student name"
            />

            <Text className="text-gray-700 font-semibold mb-2">Age</Text>
            <TextInput
              className="bg-gray-100 rounded-xl px-4 py-3 mb-4 border border-gray-300"
              value={age}
              onChangeText={setAge}
              placeholder="Age"
              keyboardType="number-pad"
            />

            <Text className="text-gray-700 font-semibold mb-2">Phone</Text>
            <TextInput
              className="bg-gray-100 rounded-xl px-4 py-3 mb-4 border border-gray-300"
              value={phone}
              onChangeText={setPhone}
              placeholder="Phone number"
              keyboardType="phone-pad"
            />

            <Text className="text-gray-700 font-semibold mb-2">Email</Text>
            <TextInput
              className="bg-gray-100 rounded-xl px-4 py-3 mb-4 border border-gray-300"
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text className="text-gray-700 font-semibold mb-2">Payment Status</Text>
            <View className="flex-row mb-4">
              <TouchableOpacity
                className={`flex-1 py-3 rounded-xl mr-2 ${paymentStatus === 'paid' ? 'bg-green-600' : 'bg-gray-200'}`}
                onPress={() => setPaymentStatus('paid')}
              >
                <Text className={`text-center font-semibold ${paymentStatus === 'paid' ? 'text-white' : 'text-gray-600'}`}>
                  Paid
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`flex-1 py-3 rounded-xl ml-2 ${paymentStatus === 'unpaid' ? 'bg-yellow-500' : 'bg-gray-200'}`}
                onPress={() => setPaymentStatus('unpaid')}
              >
                <Text className={`text-center font-semibold ${paymentStatus === 'unpaid' ? 'text-white' : 'text-gray-600'}`}>
                  Unpaid
                </Text>
              </TouchableOpacity>
            </View>

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

