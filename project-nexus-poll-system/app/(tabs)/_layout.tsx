import React, { useState, useEffect } from 'react';
import { Tabs, useNavigation } from "expo-router";
import { MaterialIcons, FontAwesome, Feather } from "@expo/vector-icons";
import { TouchableOpacity } from 'react-native';
import LoadingScreen from '../../components/LoadingScreen';

export default function TabLayout() {
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    // Simulate a loading process
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 4000); // Adjust the timeout duration as needed

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerLeft: () => (
          <TouchableOpacity onPress={() => navigation.navigate('index' as never)}>
            <MaterialIcons name="arrow-back" size={24} color="black" style={{ marginLeft: 16 }} />
          </TouchableOpacity>
        ),
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: '#64748b',
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
          backgroundColor: '#f8fafc'
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '500'
        }
      }}
    >
      <Tabs.Screen
        name="create"
        options={{
          title: 'Create',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="post-add" size={24} color={color} />
          )
        }}
      />
      <Tabs.Screen
        name="vote"
        options={{
          title: 'Vote',
          tabBarIcon: ({ color }) => (
            <FontAwesome name="check-square-o" size={24} color={color} />
          )
        }}
      />
      <Tabs.Screen
        name="results"
        options={{
          title: 'Results',
          tabBarIcon: ({ color }) => (
            <Feather name="bar-chart" size={24} color={color} />
          )
        }}
      />
    </Tabs>
  );
}