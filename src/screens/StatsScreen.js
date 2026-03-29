import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView, useColorScheme, FlatList } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Target, Activity, CheckCircle, Smile } from 'lucide-react-native';
import { Database, KEYS } from '../data/storage';
import { MOODS } from '../data/modules';
import Colors from '../theme/colors';

export default function StatsScreen() {
  const colorScheme = useColorScheme() || 'light';
  const colors = Colors[colorScheme];

  const [activities, setActivities] = useState([]);
  const [moods, setMoods] = useState([]);
  const [successRate, setSuccessRate] = useState(0);

  const loadData = async () => {
    const storedActivities = await Database.get(KEYS.ACTIVITIES);
    const storedMoods = await Database.get(KEYS.MOODS);
    
    // Reverse arrays to show newest first
    setActivities(storedActivities.slice().reverse());
    setMoods(storedMoods.slice().reverse());

    // Calculate daily success based on e.g., 3 modules a day target
    const today = new Date().toDateString();
    const todayActivities = storedActivities.filter(a => {
      if (!a.completedAt) return false;
      return new Date(a.completedAt).toDateString() === today;
    });

    // Assume target is 3 modules max per day. If they did 3, 100%. 1 => 33%
    const rate = Math.min(Math.round((todayActivities.length / 3) * 100), 100);
    setSuccessRate(rate);
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const getMoodLevel = (label) => {
    switch (label) {
      case 'Mutlu':
      case 'Enerjik': return 3;
      case 'Sakin':
      case 'Yorgun': return 2;
      case 'Stresli':
      case 'Kötü': return 1;
      default: return 2;
    }
  };

  const getMoodColor = (label) => {
    const found = MOODS.find(m => m.label === label);
    return found ? found.accent : colors.primary;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        
        {/* Success Rate Card */}
        <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.cardHeaderRow}>
            <View style={[styles.iconBox, { backgroundColor: colors.primary + '20' }]}>
              <Target color={colors.primary} size={24} />
            </View>
            <View style={styles.cardHeaderTexts}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>Günlük Başarı</Text>
              <Text style={[styles.cardSubtitle, { color: colors.text, opacity: 0.6 }]}>Hedef: 3 Modül / Gün</Text>
            </View>
          </View>
          <View style={styles.progressContainer}>
            <View style={[styles.progressBarBg, { backgroundColor: colors.background }]}>
              <View style={[styles.progressBarFill, { backgroundColor: colors.primary, width: `${successRate}%` }]} />
            </View>
            <Text style={[styles.progressText, { color: colors.primary }]}>%{successRate}</Text>
          </View>
        </View>

        {/* Mood Trend */}
        <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.cardHeaderRow}>
            <View style={[styles.iconBox, { backgroundColor: colors.primary + '20' }]}>
              <Smile color={colors.primary} size={24} />
            </View>
            <View style={styles.cardHeaderTexts}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>Mood Trendi (Son 5 Kayıt)</Text>
              <Text style={[styles.cardSubtitle, { color: colors.text, opacity: 0.6 }]}>Ruh halindeki değişimler</Text>
            </View>
          </View>

          <View style={styles.chartContainer}>
            {moods.slice(0, 5).reverse().map((m, i) => {
              const level = getMoodLevel(m.label);
              const height = level * 30; // 30, 60, 90
              const barColor = getMoodColor(m.label);

              return (
                <View key={i} style={styles.barItem}>
                  <View style={[
                    styles.bar, 
                    { height: height, backgroundColor: barColor }
                  ]} />
                  <Text style={styles.emojiText}>{m.emoji}</Text>
                </View>
              );
            })}
            {moods.length === 0 && (
              <Text style={styles.emptyText}>Henüz mood kaydı yok.</Text>
            )}
          </View>
        </View>


        {/* Last Activities List */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Yapılan Aktiviteler</Text>
        {activities.length > 0 ? (
          <View style={styles.activitiesContainer}>
            {activities.map((item, index) => (
              <View key={index} style={[styles.activityRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={[styles.actIcon, { backgroundColor: colors.success + '20' }]}>
                  <CheckCircle color={colors.success} size={20} />
                </View>
                <View style={styles.actTexts}>
                  <Text style={[styles.actTitle, { color: colors.text }]}>{item.title}</Text>
                  <Text style={[styles.actDate, { color: colors.text, opacity: 0.5 }]}>
                    {new Date(item.completedAt).toLocaleDateString()} - {new Date(item.completedAt).toLocaleTimeString([], { hour:'2-digit', minute:'2-digit'})}
                  </Text>
                </View>
                <Text style={[styles.actDuration, { color: colors.primary }]}>{item.duration}</Text>
              </View>
            ))}
          </View>
        ) : (
          <View style={[styles.emptyCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Activity color={colors.tabIconDefault} size={40} style={{ marginBottom: 12 }} />
            <Text style={{ color: colors.text, opacity: 0.5, fontSize: 16 }}>Henüz tamamlanan aktivite yok.</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: { padding: 20 },
  statCard: { padding: 20, borderRadius: 20, borderWidth: 1, marginBottom: 24, shadowColor: '#000', shadowOpacity: 0.03, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4, elevation: 2 },
  cardHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  iconBox: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  cardHeaderTexts: { flex: 1 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  cardSubtitle: { fontSize: 14 },
  progressContainer: { flexDirection: 'row', alignItems: 'center' },
  progressBarBg: { flex: 1, height: 12, borderRadius: 6, marginRight: 16, overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 6 },
  progressText: { fontSize: 16, fontWeight: '800' },
  chartContainer: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-around', height: 100, marginTop: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.1)', paddingBottom: 10 },
  barItem: { alignItems: 'center' },
  bar: { width: 24, borderRadius: 6, borderBottomLeftRadius: 0, borderBottomRightRadius: 0, marginBottom: 8 },
  emojiText: { fontSize: 18 },
  emptyText: { alignSelf: 'center', opacity: 0.5 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  activitiesContainer: { marginBottom: 30 },
  activityRow: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 16, borderWidth: 1, marginBottom: 12 },
  actIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  actTexts: { flex: 1 },
  actTitle: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  actDate: { fontSize: 12 },
  actDuration: { fontSize: 14, fontWeight: '800' },
  emptyCard: { alignItems: 'center', justifyContent: 'center', padding: 32, borderRadius: 20, borderWidth: 1 }
});
