import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { getPin } from '../utils/storage';

export default function PinScreen({ navigation }) {
  const [pin, setPin] = useState('');
  const [storedPin, setStoredPin] = useState('2005');
  const [error, setError] = useState('');

  useEffect(() => {
    loadPin();
  }, []);

  const loadPin = async () => {
    const pin = await getPin();
    setStoredPin(pin);
  };

  const handlePinSubmit = () => {
    if (pin === storedPin) {
      setError('');
      navigation.replace('Main');
    } else {
      setError('Incorrect PIN');
      setPin('');
    }
  };

  return (
    <View className="flex-1 bg-green-50 justify-center items-center px-6">
      <View className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-lg">
        <Text className="text-3xl font-bold text-green-700 text-center mb-2">Soccer School</Text>
        <Text className="text-gray-600 text-center mb-8">Enter PIN to continue</Text>
        
        <TextInput
          className="bg-gray-100 rounded-xl px-4 py-4 text-2xl text-center font-bold tracking-widest mb-4 border-2 border-gray-200"
          value={pin}
          onChangeText={setPin}
          placeholder="Enter PIN"
          keyboardType="number-pad"
          secureTextEntry
          maxLength={4}
          autoFocus
        />
        
        {error ? (
          <Text className="text-red-500 text-center mb-4">{error}</Text>
        ) : null}
        
        <TouchableOpacity
          className="bg-green-600 rounded-xl py-4 mt-4"
          onPress={handlePinSubmit}
        >
          <Text className="text-white text-center font-bold text-lg">Enter</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

