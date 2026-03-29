import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  StyleSheet, Text, View, ScrollView, TouchableOpacity,
  useColorScheme, Alert, Animated, TextInput
} from 'react-native';
import { Audio } from 'expo-av';
import { Mic, MicOff, Play, Square, Trash2, Check } from 'lucide-react-native';

import { useRoute, useFocusEffect } from '@react-navigation/native';
import Colors from '../theme/colors';
import { MODULES, MOODS } from '../data/modules';
import { Database, KEYS } from '../data/storage';

export default function HomeScreen() {
  const route = useRoute();
  const colorScheme = useColorScheme() || 'light';
  const colors = Colors[colorScheme];

  const passedMoodLabel = route.params?.mood;
  const initialMood = MOODS.find(m => m.label === passedMoodLabel) || MOODS.find(m => m.label === 'Normal') || MOODS[1];
  
  const [currentMood, setCurrentMood] = useState(initialMood);
  const [suggestedModules, setSuggestedModules] = useState([]);

  // Audio States
  const [recording, setRecording] = useState(null);
  const [recordings, setRecordings] = useState([]);
  const [playingId, setPlayingId] = useState(null);
  const [sound, setSound] = useState(null);

  // Background Animation
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Geçmişten Gelen Destek State
  const [randomHappyRecording, setRandomHappyRecording] = useState(null);

  // Note States
  const [notes, setNotes] = useState([]);
  const [noteText, setNoteText] = useState('');
  const saveSuccessAnim = useRef(new Animated.Value(0)).current;

  const getDynamicBackground = () => currentMood.color || colors.background;

  // Her sekme açılışında verileri DB'den tazeleyelim ki diğer sayfadaki silmeler buraya da yansısın
  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      const loadInit = async () => {
         const storedNotes = await Database.get(KEYS.NOTES);
         const storedRecordings = await Database.get(KEYS.RECORDINGS);
         if (isActive) {
           setNotes(storedNotes);
           setRecordings(storedRecordings);
         }
      };
      loadInit();
      return () => { isActive = false; };
    }, [])
  );

  useEffect(() => {
    if (route.params?.mood) {
      const newMood = MOODS.find(m => m.label === route.params.mood) || MOODS[1];
      setCurrentMood(newMood);
    }
  }, [route.params?.mood]);

  useEffect(() => {
    // Fade animation trigger
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    updateSuggestions(currentMood);
  }, [currentMood]);

  // Geçmişten Gelen Destek - Rastgele Değil, En Güncel Onaylı Kayıt
  useEffect(() => {
    if (['stresli', 'yorgun', 'kötü'].includes(currentMood.tag)) {
      const supportItems = [
         ...recordings.filter(r => r.isSupport),
         ...notes.filter(n => n.isSupport)
      ].sort((a, b) => b.id - a.id); // Descending order of id (which is timestamp)

      if (supportItems.length > 0) {
        setRandomHappyRecording(supportItems[0]); // En güncel
      } else {
        setRandomHappyRecording(null);
      }
    } else {
      setRandomHappyRecording(null);
    }
  }, [currentMood, recordings, notes]);

  const handleSupportPrompt = async (item, itemType) => {
    if (['mutlu', 'enerjik'].includes(currentMood.tag)) {
       Alert.alert(
         "Dost Hafızası",
         "Bu mutlu anıyı zor zamanların için 'Dost Hafızası'na ekleyelim mi?",
         [
           { text: "Hayır", style: "cancel" },
           { 
             text: "Evet", 
             onPress: async () => {
                const updatedItem = { ...item, isSupport: true };
                if (itemType === 'audio') {
                   setRecordings(prev => {
                      const updatedList = prev.map(r => r.id === item.id ? updatedItem : r);
                      Database.set(KEYS.RECORDINGS, updatedList);
                      return updatedList;
                   });
                } else if (itemType === 'note') {
                   setNotes(prev => {
                      const updatedList = prev.map(n => n.id === item.id ? updatedItem : n);
                      Database.set(KEYS.NOTES, updatedList);
                      return updatedList;
                   });
                }
             } 
           }
         ]
       );
    }
  };

  const updateSuggestions = (mood) => {
    const matched = MODULES.filter(m => m.tags.includes(mood.tag));
    setSuggestedModules(matched.length > 0 ? matched : MODULES.slice(0, 2));
  };

  // --- SES KAYDI MANTIĞI ---
  async function startRecording() {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
    } catch (err) {
      console.error('Kayıt başlatılamadı', err);
    }
  }

  async function stopRecording() {
    if (!recording) return;
    setRecording(null);
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
    
    const uri = recording.getURI();
    const date = new Date();
    const dateStr = date.toLocaleDateString('tr-TR');
    const timeStr = date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

    const newAudio = {
      id: Date.now().toString(),
      uri: uri,
      date: dateStr,
      time: timeStr,
      mood: currentMood.tag,
      isSupport: false
    };

    setRecordings(prev => {
      const updatedList = [newAudio, ...prev];
      Database.set(KEYS.RECORDINGS, updatedList);
      return updatedList;
    });

    setTimeout(() => {
      handleSupportPrompt(newAudio, 'audio');
    }, 500);
  }

  const saveNote = async () => {
    if (!noteText.trim()) return;

    const date = new Date();
    const dateStr = date.toLocaleDateString('tr-TR');
    const timeStr = date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

    const newNote = {
      id: Date.now().toString(),
      text: noteText.trim(),
      date: dateStr,
      time: timeStr,
      mood: currentMood.tag,
      isSupport: false,
    };

    setNotes(prev => {
      const updatedNotes = [newNote, ...prev];
      Database.set(KEYS.NOTES, updatedNotes);
      return updatedNotes;
    });
    setNoteText('');

    // Animasyon
    Animated.sequence([
      Animated.timing(saveSuccessAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.delay(1000),
      Animated.timing(saveSuccessAnim, { toValue: 0, duration: 300, useNativeDriver: true })
    ]).start();

    setTimeout(() => {
      handleSupportPrompt(newNote, 'note');
    }, 500);
  };

  // Not silme fonksiyonu artık RecordsScreen'de kullanıldığı için buradan kaldırıldı

  async function playSound(uri, id) {
    try {
      if (sound) {
        await sound.unloadAsync();
      }
      const { sound: newSound } = await Audio.Sound.createAsync({ uri });
      setSound(newSound);
      setPlayingId(id);
      await newSound.playAsync();
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setPlayingId(null);
          newSound.unloadAsync();
          setSound(null);
        }
      });
    } catch(e) {
      console.log(e);
    }
  }

  async function stopSound() {
    if (sound) {
      await sound.stopAsync();
      setPlayingId(null);
    }
  }

  // Ses silme fonksiyonu artık RecordsScreen'de kullanıldığı için buradan kaldırıldı

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: getDynamicBackground(), opacity: fadeAnim }]} />
      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* Geçmişten Gelen Destek (Gizli durum sağlanıyor) */}
        {['stresli', 'yorgun', 'kötü'].includes(currentMood.tag) && randomHappyRecording && (
          <View style={[styles.supportCard, { backgroundColor: colors.card, borderColor: currentMood.accent }]}>
             <Text style={[styles.supportTitle, { color: currentMood.accent }]}>Geçmişten Gelen Destek</Text>
             <Text style={[styles.supportText, { color: colors.text }]}>
                "Bak Rabia, geçmişte '{randomHappyRecording.mood}' hissettiğin bir gün bu notu bırakmıştın..."
             </Text>
             {randomHappyRecording.uri ? (
                <TouchableOpacity 
                   onPress={() => {
                      if(playingId === randomHappyRecording.id) stopSound();
                      else playSound(randomHappyRecording.uri, randomHappyRecording.id);
                   }}
                   style={[styles.playSupportBtn, { backgroundColor: currentMood.accent }]}
                >
                   {playingId === randomHappyRecording.id ? <Square color="#fff" size={20} /> : <Play color="#fff" size={20} />}
                   <Text style={styles.playSupportText}>Mutlu Anıyı Dinle</Text>
                </TouchableOpacity>
             ) : (
                <View style={[styles.quoteBox, { backgroundColor: colors.background }]}>
                  <Text style={[styles.supportQuote, { color: colors.text }]}>"{randomHappyRecording.text}"</Text>
                  <Text style={[styles.supportQuoteDate, { color: colors.text }]}>{randomHappyRecording.date} {randomHappyRecording.time}</Text>
                </View>
             )}
          </View>
        )}

        {/* Kendime Notlar Input */}
        <View style={[styles.adviceCard, { backgroundColor: colors.card, borderLeftColor: currentMood.accent }]}>
          <Text style={[styles.adviceTitle, { color: currentMood.accent }]}>Kendime Notlar</Text>
          <Text style={styles.cardSubtitle}>Bugün neler hissettin? Buraya dökülebilirsin.</Text>
          <View style={styles.noteInputRow}>
            <TextInput 
              style={[styles.noteInput, { color: colors.text, borderColor: colors.border }]} 
              placeholder="Buraya yazabilirsin..."
              placeholderTextColor={colors.tabIconDefault}
              multiline
              value={noteText}
              onChangeText={setNoteText}
            />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
            <TouchableOpacity onPress={saveNote} style={[styles.recordButton, { flex: 1, backgroundColor: currentMood.accent, height: 45 }]}>
               <Text style={styles.recordButtonText}>Notu Kaydet</Text>
            </TouchableOpacity>
            <Animated.View style={{ opacity: saveSuccessAnim, marginLeft: 15, transform: [{ scale: saveSuccessAnim }] }}>
               <Check color={"#4CAF50"} size={24} />
            </Animated.View>
          </View>
        </View>

        {/* Mod Tavsiyesi */}
        <View style={[styles.adviceCard, { backgroundColor: colors.card, borderLeftColor: currentMood.accent }]}>
          <Text style={[styles.adviceTitle, { color: currentMood.accent }]}>Senin İçin Tavsiyem:</Text>
          <Text style={[styles.adviceText, { color: colors.text }]}>{currentMood.advice}</Text>
        </View>

        {/* Ses Kaydı Input */}
        <View style={[styles.inputCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Gününü Anlat</Text>
          <Text style={styles.cardSubtitle}>
            Günün nasıl geçti? Detayları sesli olarak kaydedebilirsin. 
          </Text>

          <TouchableOpacity
            onPress={recording ? stopRecording : startRecording}
            style={[
              styles.recordButton, 
              { backgroundColor: recording ? '#ef4444' : colors.primary }
            ]}
          >
            {recording ? (
              <>
                <Square color="#fff" size={20} />
                <Text style={styles.recordButtonText}>Kaydı Durdur</Text>
              </>
            ) : (
              <>
                <Mic color="#fff" size={20} />
                <Text style={styles.recordButtonText}>Ses Kaydet</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Öneriler (Modüller) */}
        <View style={styles.modulesSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Önerilen Egzersizler</Text>
          {suggestedModules.map((item, index) => (
            <View key={index} style={[styles.moduleCard, { backgroundColor: colors.card }]}>
              <View style={{ flex: 1 }}>
                <Text style={{ color: colors.text, fontWeight: 'bold' }}>{item.title}</Text>
                <Text style={{ color: colors.text, opacity: 0.7, fontSize: 12 }}>{item.description}</Text>
              </View>
              <Check color="#4CAF50" size={20} />
            </View>
          ))}
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20 },
  headerRow: { marginBottom: 15 },
  timeText: { fontSize: 24, fontWeight: 'bold' },
  
  moodSelectorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  moodBtn: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'transparent',
    flex: 1,
    marginHorizontal: 4,
    backgroundColor: 'rgba(0,0,0,0.02)', // Hafif arkaplan
  },
  moodBtnEmoji: { fontSize: 26, marginBottom: 5 },
  moodBtnLabel: { fontSize: 13, fontWeight: 'bold' },

  adviceCard: {
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
  },
  adviceTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  adviceText: { fontSize: 14, opacity: 0.9, lineHeight: 22 },

  inputCard: { padding: 20, borderRadius: 20, marginBottom: 20, elevation: 3 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  cardSubtitle: { fontSize: 13, color: '#666', marginBottom: 15 },
  recordButton: {
    flexDirection: 'row', height: 50, borderRadius: 15,
    justifyContent: 'center', alignItems: 'center', gap: 10
  },
  recordButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },

  recordingsSection: { marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  recordingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
    elevation: 1,
  },
  recordingInfo: { flexDirection: 'column' },
  recordingDate: { fontSize: 14, fontWeight: 'bold' },
  recordingTime: { fontSize: 12, opacity: 0.6 },
  recordingActions: { flexDirection: 'row', gap: 10 },
  iconBtn: { padding: 10, borderRadius: 12 },

  modulesSection: { marginTop: 10 },
  moduleCard: { padding: 15, borderRadius: 15, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },

  supportCard: {
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    borderWidth: 1,
    elevation: 4,
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10,
  },
  supportTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  supportText: { fontSize: 15, fontStyle: 'italic', marginBottom: 15, lineHeight: 22 },
  playSupportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 10,
    marginTop: 5,
  },
  playSupportText: { color: '#fff', fontWeight: 'bold', fontSize: 16, marginLeft: 10 },
  quoteBox: { padding: 15, backgroundColor: 'rgba(0,0,0,0.03)', borderRadius: 10 },
  supportQuote: { fontSize: 14, fontStyle: 'italic', textAlign: 'center' },
  supportQuoteDate: { fontSize: 11, textAlign: 'center', marginTop: 10, opacity: 0.6 },
  
  noteInputRow: {
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderRadius: 12,
    borderWidth: 1,
    padding: 10,
    minHeight: 100,
  },
  noteInput: {
    flex: 1,
    textAlignVertical: 'top',
    fontSize: 16,
    padding: 0,
  }
});
