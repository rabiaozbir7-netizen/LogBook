import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, useColorScheme, Alert } from 'react-native';
import { Clock, Play, CheckCircle } from 'lucide-react-native';
import Colors from '../theme/colors';
import { Database, KEYS } from '../data/storage';

export default function ModuleScreen({ route, navigation }) {
  const { module } = route.params;
  const colorScheme = useColorScheme() || 'light';
  const colors = Colors[colorScheme];

  const [currentStep, setCurrentStep] = useState(0);

  const markCompleted = async () => {
    await Database.add(KEYS.ACTIVITIES, {
      moduleId: module.id,
      title: module.title,
      duration: module.duration,
      completedAt: new Date().toISOString()
    });
    Alert.alert('Tebrikler!', 'Modülü başarıyla tamamladınız.', [
      { text: 'Tamam', onPress: () => navigation.goBack() }
    ]);
  };

  const skipModule = () => {
    navigation.goBack();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.title, { color: colors.text }]}>{module.title}</Text>
          <View style={styles.metaInfo}>
            <Clock color={colors.primary} size={18} />
            <Text style={[styles.metaText, { color: colors.primary }]}>{module.duration}</Text>
          </View>
          <Text style={[styles.desc, { color: colors.text, opacity: 0.7 }]}>{module.description}</Text>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Adım Adım Talimatlar</Text>
        
        <View style={[styles.stepsContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {module.steps.map((step, index) => {
            const isActive = index === currentStep;
            const isPast = index < currentStep;
            return (
              <TouchableOpacity 
                key={index} 
                activeOpacity={0.8}
                onPress={() => setCurrentStep(index)}
                style={[
                  styles.stepRow,
                  isActive && { backgroundColor: colors.primary + '15' },
                  isPast && { opacity: 0.5 }
                ]}
              >
                <View style={[
                  styles.stepCircle, 
                  { backgroundColor: isPast || isActive ? colors.primary : colors.background }
                ]}>
                  {isPast ? (
                    <CheckCircle color="#fff" size={16} />
                  ) : (
                    <Text style={[styles.stepNum, { color: isActive ? '#fff' : colors.text }]}>
                      {index + 1}
                    </Text>
                  )}
                </View>
                <Text style={[styles.stepText, { color: colors.text, fontWeight: isActive ? '700' : '500' }]}>
                  {step}
                </Text>
              </TouchableOpacity>
            )
          })}
        </View>

      </ScrollView>
      
      {/* Footer Actions */}
      <View style={[styles.footer, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
        <TouchableOpacity style={[styles.btnSkip, { borderColor: colors.border }]} onPress={skipModule}>
          <Text style={[styles.btnSkipText, { color: colors.text }]}>Atla</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.btnDone, { backgroundColor: colors.primary }]} onPress={markCompleted}>
          <Text style={styles.btnDoneText}>Tamamla</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: { padding: 20, paddingBottom: 100 },
  card: { padding: 24, borderRadius: 20, borderWidth: 1, marginBottom: 24, alignItems: 'center' },
  title: { fontSize: 24, fontWeight: '800', marginBottom: 12, textAlign: 'center' },
  metaInfo: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#eef2ff', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, marginBottom: 16 },
  metaText: { fontSize: 14, fontWeight: '700', marginLeft: 6 },
  desc: { fontSize: 16, textAlign: 'center', lineHeight: 24 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  stepsContainer: { borderRadius: 20, borderWidth: 1, overflow: 'hidden' },
  stepRow: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)' },
  stepCircle: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  stepNum: { fontSize: 14, fontWeight: 'bold' },
  stepText: { fontSize: 16, flex: 1, lineHeight: 22 },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', padding: 20, paddingBottom: 40, borderTopWidth: 1, justifyContent: 'space-between' },
  btnSkip: { flex: 1, paddingVertical: 16, borderRadius: 16, borderWidth: 1, alignItems: 'center', marginRight: 12 },
  btnSkipText: { fontSize: 16, fontWeight: '600' },
  btnDone: { flex: 2, paddingVertical: 16, borderRadius: 16, alignItems: 'center' },
  btnDoneText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});
