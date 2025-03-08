import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert, ScrollView } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { createPoll } from '../store/slices/pollSlice';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import Lottie from 'lottie-react-native';
import animation from '../assets/animations/success.json';

const pollSchema = z.object({
  question: z.string().min(5, "Question must be at least 5 characters"),
  options: z.array(z.string().min(1, "Option can't be empty")).min(2)
});

export default function CreatePoll() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { status } = useSelector((state: RootState) => state.poll);
  
  const { control, handleSubmit, formState: { errors }, setValue, watch } = useForm({
    resolver: zodResolver(pollSchema),
    defaultValues: {
      question: '',
      options: ['', '']
    }
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const options = watch('options');

  const handleAddOption = () => {
    setValue('options', [...options, '']);
  };

  const handleRemoveOption = (index: number) => {
    const newOptions = options.filter((_, i) => i !== index);
    setValue('options', newOptions);
  };

  const onSubmit = async (data: { question: string; options: string[] }) => {
    if (!user) {
      setErrorMessage('You must be logged in to create a poll');
      return;
    }

    try {
      await dispatch(createPoll({
        question: data.question,
        options: data.options,
        userId: user.uid
      })).unwrap();

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
      setValue('question', '');
      setValue('options', ['', '']);
      setErrorMessage(null); // Clear error message on successful submission
    } catch (error) {
      console.error('Poll creation error:', error);
      setErrorMessage('Failed to create poll');
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-gray-50 p-6">
        <ScrollView className="flex-1 p-4">
          <Text className="text-2xl font-bold text-black mb-6">Create a Poll</Text>
          
          {errorMessage && (
            <Text className="text-red-500 mb-4">{errorMessage}</Text>
          )}

          <Controller
            control={control}
            name="question"
            render={({ field }) => (
              <View className="mb-6">
                <TextInput
                  placeholder="Enter your poll question"
                  className="bg-white p-4 rounded-xl text-md border border-gray-300 shadow-md"
                  onChangeText={field.onChange}
                  value={field.value}
                />
                {errors.question && (
                  <Text className="text-red-500 mt-2 ml-2">{errors.question.message}</Text>
                )}
              </View>
            )}
          />

          <Text className="text-lg font-semibold mb-4 text-gray-700">Options:</Text>
          {options.map((_, index) => (
            <View key={index} className="flex-row items-center mb-3">
              <Controller
                control={control}
                name={`options.${index}`}
                render={({ field }) => (
                  <View className="flex-1 mr-2">
                    <TextInput
                      placeholder={`Option ${index + 1}`}
                      className="bg-white p-3 rounded-lg border text-sm border-gray-300 shadow-md"
                      onChangeText={field.onChange}
                      value={field.value}
                    />
                    {errors.options?.[index] && (
                      <Text className="text-red-500 mt-1 ml-2 text-sm">
                        {errors.options[index].message}
                      </Text>
                    )}
                  </View>
                )}
              />
              {options.length > 2 && (
                <TouchableOpacity
                  onPress={() => handleRemoveOption(index)}
                  className="p-2 bg-red-500 rounded-lg shadow-lg"
                >
                  <MaterialIcons name="delete" size={20} color="white" />
                </TouchableOpacity>
              )}
            </View>
          ))}

          <TouchableOpacity
            onPress={handleAddOption}
            className="flex-row items-center justify-center bg-purple-400 mb-3 py-2 mt-3 rounded-lg shadow-md"
          >
            <MaterialIcons name="add-circle" size={20} color="white" />
            <Text className="text-white ml-2 font-medium">Add Option</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            disabled={status === 'loading'}
            className="bg-purple-600 p-4 rounded-xl flex-row justify-center items-center shadow-md"
          >
            <Text className="text-white text-lg font-semibold">
              {status === 'loading' ? 'Creating...' : 'Create Poll'}
            </Text>
          </TouchableOpacity>

          {showSuccess && (
            <View className="absolute inset-0 justify-center items-center bg-black bg-opacity-50">
              <Lottie
                source={animation}
                autoPlay
                loop={false}
                style={{ width: 200, height: 200 }}
              />
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}