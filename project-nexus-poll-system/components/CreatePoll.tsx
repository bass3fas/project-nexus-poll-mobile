import React from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert } from 'react-native';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import '../global.css';

const pollSchema = z.object({
  question: z.string().min(5, "Question must be at least 5 characters"),
  options: z.array(z.string().min(1, "Option can't be empty")).min(2)
});

export default function CreatePoll() {
  const { control, handleSubmit, formState: { errors }, setValue } = useForm({
    resolver: zodResolver(pollSchema),
    defaultValues: {
      question: '',
      options: ['', '']
    }
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddOption = () => {
    setValue('options', [...control._formValues.options, '']);
  };

  const handleRemoveOption = (index: number) => {
    const newOptions = control._formValues.options.filter((_, i) => i !== index);
    setValue('options', newOptions);
  };

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      await addDoc(collection(db, 'polls'), {
        question: data.question,
        options: data.options.map((text, index) => ({
          id: `opt${index}`,
          text,
          votes: 0
        })),
        createdAt: new Date(),
        totalVotes: 0
      });
      Alert.alert('Success', 'Poll created successfully!');
      setValue('question', '');
      setValue('options', ['', '']);
    } catch (error) {
      Alert.alert('Error', 'Failed to create poll');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 p-4">
      <Controller
        control={control}
        name="question"
        render={({ field }) => (
          <View className="mb-6">
            <TextInput
              placeholder="Enter your poll question"
              className="bg-white p-4 rounded-xl text-lg border border-gray-200"
              onChangeText={field.onChange}
              value={field.value}
            />
            {errors.question && (
              <Text className="text-red-500 mt-2 ml-2">{errors.question.message}</Text>
            )}
          </View>
        )}
      />

      <View className="mb-4">
        <Text className="text-lg font-semibold mb-4 text-gray-700">Options:</Text>
        {control._formValues.options.map((_, index) => (
          <View key={index} className="flex-row items-center mb-3">
            <Controller
              control={control}
              name={`options.${index}`}
              render={({ field }) => (
                <View className="flex-1 mr-2">
                  <TextInput
                    placeholder={`Option ${index + 1}`}
                    className="bg-white p-3 rounded-lg border border-gray-200"
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
            {control._formValues.options.length > 2 && (
              <TouchableOpacity
                onPress={() => handleRemoveOption(index)}
                className="p-2 bg-red-100 rounded-lg"
              >
                <MaterialIcons name="delete" size={20} color="#dc2626" />
              </TouchableOpacity>
            )}
          </View>
        ))}
        {errors.options?.message && (
          <Text className="text-red-500 mt-2 ml-2">{errors.options.message}</Text>
        )}
      </View>

      <TouchableOpacity
        onPress={handleAddOption}
        className="mb-6 flex-row items-center justify-center bg-purple-100 p-3 rounded-lg"
      >
        <MaterialIcons name="add-circle" size={20} color="#9333ea" />
        <Text className="text-purple-600 ml-2 font-medium">Add Option</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleSubmit(onSubmit)}
        disabled={isSubmitting}
        className="bg-purple-600 p-4 rounded-xl flex-row justify-center items-center"
      >
        <Text className="text-white text-lg font-semibold">
          {isSubmitting ? 'Creating...' : 'Create Poll'}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}