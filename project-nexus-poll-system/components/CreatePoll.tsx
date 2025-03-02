import { View, TextInput, Button } from 'react-native';
import { useState } from 'react';

export default function CreatePoll() {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);

  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  return (
    <View className="p-4">
      <TextInput
        placeholder="Enter your question"
        className="border p-4 rounded-lg mb-4"
        value={question}
        onChangeText={setQuestion}
      />
      
      {options.map((option, index) => (
        <TextInput
          key={index}
          placeholder={`Option ${index + 1}`}
          className="border p-2 mb-2 rounded-lg"
          value={option}
          onChangeText={(text) => {
            const newOptions = [...options];
            newOptions[index] = text;
            setOptions(newOptions);
          }}
        />
      ))}
      
      <Button
        title="Add Option"
        onPress={handleAddOption}
        color="#64748b"
      />
      
      <Button
        title="Create Poll"
        onPress={() => {/* Add Firebase integration */}}
        color="#3b82f6"
        className="mt-4"
      />
    </View>
  );
}