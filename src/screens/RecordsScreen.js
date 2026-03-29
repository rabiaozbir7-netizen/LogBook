import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useColorScheme, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Audio } from 'expo-av';
import { Play, Square, Trash2, Mic, AlignLeft } from 'lucide-react-native';
import Colors from '../theme/colors';
import { Database, KEYS } from '../data/storage';
import { MOODS } from '../data/modules';

export default function RecordsScreen() {
  const colorScheme = useColorScheme() || 'light';
  const colors = Colors[colorScheme];

  const [items, setItems] = useState([]);
  const [playingId, setPlayingId] = useState(null);
  const [sound, setSound] = useState(null);

  const loadData = async () => {
    const rawNotes = await Database.get(KEYS.NOTES);
    const rawRecordings = await Database.get(KEYS.RECORDINGS);

    const notesWithTypes = rawNotes.map(n => ({ ...n, type: 'note' }));
    const recordingsWithTypes = rawRecordings.map(r => ({ ...r, type: 'audio' }));

    const combined = [...notesWithTypes, ...recordingsWithTypes].sort((a, b) => b.id - a.id);
    setItems(combined);
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
      return () => {
        if (sound) {
           sound.unloadAsync();
        }
      };
    }, [sound])
  );

  const getMoodColors = (tag) => {
    const mood = MOODS.find(m => m.tag === tag);
    return mood ? { bg: mood.color, accent: mood.accent } : { bg: colors.card, accent: colors.primary };
  };

  // --- AUDIO ---
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

  // --- DELETE ---
  const deleteItem = (id, type) => {
    Alert.alert(
      "Kayıt Silinecek",
      "Bu kaydı silmek istiyor musun?",
      [
        { text: "Hayır", style: "cancel" },
        { 
          text: "Evet", 
          onPress: async () => {
            if (type === 'audio') {
              const rawRecordings = await Database.get(KEYS.RECORDINGS);
              const updated = rawRecordings.filter(r => r.id !== id);
              await Database.set(KEYS.RECORDINGS, updated);
              if (playingId === id) stopSound();
            } else if (type === 'note') {
              const rawNotes = await Database.get(KEYS.NOTES);
              const updated = rawNotes.filter(n => n.id !== id);
              await Database.set(KEYS.NOTES, updated);
            }
            loadData(); // Refresh list after deletion
          } 
        }
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={[styles.header, { color: colors.text }]}>Tüm Kayıtların</Text>

        {items.length === 0 && (
          <Text style={{ textAlign: 'center', opacity: 0.5, marginTop: 40, color: colors.text }}>Henüz kaydedilmiş bir anı yok.</Text>
        )}

        {items.map(item => {
          const moodStyle = getMoodColors(item.mood);
          
          return (
            <View key={item.id} style={[styles.card, { backgroundColor: moodStyle.bg, borderColor: moodStyle.accent }]}>
              <View style={styles.cardHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  {item.type === 'audio' ? <Mic color={moodStyle.accent} size={18} /> : <AlignLeft color={moodStyle.accent} size={18} />}
                  <Text style={[styles.dateText, { color: moodStyle.accent, marginLeft: 8 }]}>{item.date} {item.time}</Text>
                </View>
                <TouchableOpacity onPress={() => deleteItem(item.id, item.type)} style={styles.deleteBtn}>
                  <Trash2 color="#ef4444" size={18} />
                </TouchableOpacity>
              </View>

              {item.type === 'audio' ? (
                <View style={styles.audioRow}>
                  <Text style={[styles.audioText, { color: colors.text }]}>Ses Kaydı</Text>
                  <TouchableOpacity 
                    onPress={() => {
                        if (playingId === item.id) stopSound();
                        else playSound(item.uri, item.id);
                    }}
                    style={[styles.playBtn, { backgroundColor: moodStyle.accent }]}
                  >
                    {playingId === item.id ? <Square color="#fff" size={20} /> : <Play color="#fff" size={20} />}
                  </TouchableOpacity>
                </View>
              ) : (
                <Text style={[styles.noteText, { color: colors.text }]}>{item.text}</Text>
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 20, paddingBottom: 40 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  card: {
    padding: 16,
    borderRadius: 16,
    borderLeftWidth: 4,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateText: { fontSize: 13, fontWeight: 'bold' },
  deleteBtn: { padding: 4 },
  audioRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  audioText: { fontSize: 16, fontWeight: '600' },
  playBtn: {
    width: 44, height: 44, borderRadius: 22,
    justifyContent: 'center', alignItems: 'center',
  },
  noteText: { fontSize: 15, lineHeight: 22 },
});
