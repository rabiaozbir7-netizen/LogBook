import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { Sparkles } from 'lucide-react-native';
import Colors from '../theme/colors';

const MOODS = [
  { id: 'happy', label: 'Mutlu', emoji: '😊' },
  { id: 'energetic', label: 'Enerjik', emoji: '⚡' },
  { id: 'calm', label: 'Sakin', emoji: '😌' },
  { id: 'tired', label: 'Yorgun', emoji: '😫' },
  { id: 'stressed', label: 'Stresli', emoji: '🤯' },
  { id: 'sad', label: 'Kötü', emoji: '😔' },
];

export default function WelcomeScreen({ navigation }) {
  const colorScheme = useColorScheme() || 'light';
  const colors = Colors[colorScheme];
  const [selectedMood, setSelectedMood] = useState(null);

  const handleStart = () => {
    // We navigate to Tabs when User selects a mood and clicks the button.
    const selectedMoodObj = MOODS.find(m => m.id === selectedMood);
    navigation.replace('Tabs', {
      screen: 'HomeTab',
      params: { mood: selectedMoodObj?.label }
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Sparkles color={colors.primary} size={50} style={styles.icon} />
        <Text style={[styles.title, { color: colors.text }]}>Hoş Geldin!</Text>
        
        <Text style={[styles.question, { color: colors.text }]}>Bugün modun nasıl?</Text>

        <View style={styles.moodGrid}>
          {MOODS.map((mood) => {
            const isSelected = selectedMood === mood.id;
            return (
              <TouchableOpacity
                key={mood.id}
                style={[
                  styles.moodItem,
                  { backgroundColor: colors.card, borderColor: colors.border },
                  isSelected && { borderColor: colors.primary, backgroundColor: colorScheme === 'dark' ? '#2A2D3A' : '#E8F0FE' },
                ]}
                onPress={() => setSelectedMood(mood.id)}
              >
                <Text style={styles.emoji}>{mood.emoji}</Text>
                <Text style={[styles.moodLabel, { color: colors.text }]}>{mood.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={[styles.subtitle, { color: colors.text }]}>
          {selectedMood 
            ? "Harika, buna göre özellikler hazırlıyoruz!" 
            : "Sana özel bir deneyim sunabilmemiz için nasıl hissettiğini seç."}
        </Text>
      </View>
      
      <TouchableOpacity 
        style={[
          styles.button, 
          { backgroundColor: selectedMood ? colors.primary : colors.card, borderColor: colors.border, borderWidth: selectedMood ? 0 : 1 }
        ]}
        onPress={handleStart}
        disabled={!selectedMood}
      >
        <Text style={[
           styles.buttonText, 
           { color: selectedMood ? '#fff' : colors.text, opacity: selectedMood ? 1 : 0.5 }
        ]}>Uygulamaya Başla</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  question: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 30,
    marginHorizontal: -6,
  },
  moodItem: {
    width: '28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 16,
    padding: 8,
    margin: 6,
  },
  emoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  moodLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.7,
    lineHeight: 20,
    paddingHorizontal: 10,
  },
  button: {
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
