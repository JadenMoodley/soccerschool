import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getFinances, saveFinances, getStudents } from '../utils/storage';
import FinanceModal from '../components/FinanceModal';

export default function FinanceScreen() {
  const [finances, setFinances] = useState([]);
  const [students, setStudents] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFinance, setSelectedFinance] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [financesData, studentsData] = await Promise.all([
      getFinances(),
      getStudents(),
    ]);
    setFinances(financesData);
    setStudents(studentsData);
  };

  const handleAddFinance = () => {
    setSelectedFinance(null);
    setModalVisible(true);
  };

  const handleEditFinance = (finance) => {
    setSelectedFinance(finance);
    setModalVisible(true);
  };

  const calculateTotals = () => {
    let totalHoursPaid = 0;
    let totalHoursUsed = 0;
    let totalRevenue = 0;
    let totalCost = 0;

    finances.forEach((finance) => {
      totalHoursPaid += finance.hoursPaid || 0;
      totalHoursUsed += finance.hoursUsed || 0;
      totalRevenue += (finance.hoursPaid || 0) * (finance.hourlyRate || 0);
      totalCost += (finance.hoursUsed || 0) * (finance.hourlyCost || 0);
    });

    const profit = totalRevenue - totalCost;
    const remainingHours = totalHoursPaid - totalHoursUsed;

    return {
      totalHoursPaid,
      totalHoursUsed,
      totalRevenue,
      totalCost,
      profit,
      remainingHours,
    };
  };

  const getStudentName = (studentId) => {
    const student = students.find(s => s.id === studentId);
    return student ? student.name : 'Unknown';
  };

  const handleSaveFinance = async (financeData) => {
    let updated;
    if (selectedFinance) {
      updated = finances.map(f => f.id === selectedFinance.id ? { ...financeData, id: selectedFinance.id } : f);
    } else {
      updated = [...finances, { ...financeData, id: Date.now().toString() }];
    }
    await saveFinances(updated);
    setFinances(updated);
    setModalVisible(false);
    setSelectedFinance(null);
    loadData();
  };

  const totals = calculateTotals();

  const renderFinance = ({ item }) => {
    const studentName = getStudentName(item.studentId);
    const revenue = (item.hoursPaid || 0) * (item.hourlyRate || 0);
    const cost = (item.hoursUsed || 0) * (item.hourlyCost || 0);
    const profit = revenue - cost;
    const remainingHours = (item.hoursPaid || 0) - (item.hoursUsed || 0);

    return (
      <TouchableOpacity
        className="bg-white rounded-xl p-4 mb-3 mx-4 shadow-sm border border-gray-200"
        onPress={() => handleEditFinance(item)}
      >
        <Text className="text-lg font-bold text-gray-800 mb-2">{studentName}</Text>
        
        <View className="flex-row justify-between mb-2">
          <View className="flex-1">
            <Text className="text-sm text-gray-500">Hours Paid</Text>
            <Text className="text-base font-semibold text-gray-800">{item.hoursPaid || 0} hrs</Text>
          </View>
          <View className="flex-1">
            <Text className="text-sm text-gray-500">Hours Used</Text>
            <Text className="text-base font-semibold text-gray-800">{item.hoursUsed || 0} hrs</Text>
          </View>
          <View className="flex-1">
            <Text className="text-sm text-gray-500">Remaining</Text>
            <Text className={`text-base font-semibold ${remainingHours >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {remainingHours} hrs
            </Text>
          </View>
        </View>

        <View className="mt-3 pt-3 border-t border-gray-200">
          <View className="flex-row justify-between">
            <View>
              <Text className="text-xs text-gray-500">Hourly Rate</Text>
              <Text className="text-sm font-semibold text-gray-800">${item.hourlyRate || 0}/hr</Text>
            </View>
            <View>
              <Text className="text-xs text-gray-500">Revenue</Text>
              <Text className="text-sm font-semibold text-green-600">${revenue.toFixed(2)}</Text>
            </View>
            <View>
              <Text className="text-xs text-gray-500">Profit</Text>
              <Text className={`text-sm font-semibold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${profit.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView>
        <View className="bg-green-600 mx-4 mt-4 rounded-xl p-4 shadow-sm">
          <Text className="text-white text-lg font-bold mb-4">Summary</Text>
          <View className="flex-row flex-wrap justify-between">
            <View className="w-[48%] bg-white/20 rounded-lg p-3 mb-2">
              <Text className="text-white/80 text-xs">Total Hours Paid</Text>
              <Text className="text-white text-xl font-bold">{totals.totalHoursPaid} hrs</Text>
            </View>
            <View className="w-[48%] bg-white/20 rounded-lg p-3 mb-2">
              <Text className="text-white/80 text-xs">Total Hours Used</Text>
              <Text className="text-white text-xl font-bold">{totals.totalHoursUsed} hrs</Text>
            </View>
            <View className="w-[48%] bg-white/20 rounded-lg p-3">
              <Text className="text-white/80 text-xs">Total Revenue</Text>
              <Text className="text-white text-xl font-bold">${totals.totalRevenue.toFixed(2)}</Text>
            </View>
            <View className="w-[48%] bg-white/20 rounded-lg p-3">
              <Text className="text-white/80 text-xs">Total Profit</Text>
              <Text className={`text-white text-xl font-bold ${totals.profit >= 0 ? '' : 'text-red-200'}`}>
                ${totals.profit.toFixed(2)}
              </Text>
            </View>
          </View>
          <View className="mt-3 pt-3 border-t border-white/20">
            <Text className="text-white/80 text-xs">Remaining Hours</Text>
            <Text className={`text-white text-2xl font-bold ${totals.remainingHours >= 0 ? '' : 'text-red-200'}`}>
              {totals.remainingHours} hrs
            </Text>
          </View>
        </View>

        <Text className="text-lg font-bold text-gray-800 px-4 mt-4 mb-2">Student Finances</Text>
        <FlatList
          data={finances}
          renderItem={renderFinance}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          ListEmptyComponent={
            <View className="items-center justify-center py-10 mx-4">
              <Ionicons name="cash-outline" size={64} color="#d1d5db" />
              <Text className="text-gray-400 text-lg mt-4">No finance records yet</Text>
              <Text className="text-gray-400 text-sm mt-2">Tap + to add your first record</Text>
            </View>
          }
        />
      </ScrollView>
      <TouchableOpacity
        className="absolute bottom-6 right-6 w-16 h-16 bg-green-600 rounded-full items-center justify-center shadow-lg"
        onPress={handleAddFinance}
      >
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>
      <FinanceModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setSelectedFinance(null);
        }}
        onSave={handleSaveFinance}
        finance={selectedFinance}
        students={students}
      />
    </View>
  );
}

