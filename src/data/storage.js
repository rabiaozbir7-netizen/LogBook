import AsyncStorage from '@react-native-async-storage/async-storage';

// Keys
const KEYS = {
  MOODS: 'hive_moods_v1',
  ACTIVITIES: 'hive_activities_v1',
  STATS: 'hive_stats_v1',
  NOTES: 'hive_notes_v1',
  RECORDINGS: 'hive_recordings_v1',
};

// Simulated Hive / Document DB operations
export const Database = {
  // Load collection
  get: async (key) => {
    try {
      const data = await AsyncStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("DB Get Error:", e);
      return [];
    }
  },

  // Save collection
  set: async (key, value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (e) {
      console.error("DB Set Error:", e);
    }
  },

  // Append single document to a collection
  add: async (key, item) => {
    try {
      const current = await Database.get(key);
      item.id = Date.now().toString();
      item.timestamp = new Date().toISOString();
      const next = [item, ...current];
      await Database.set(key, next);
      return item;
    } catch (e) {
      console.error("DB Add Error:", e);
    }
  },

  // Clear all
  clear: async () => {
    try {
      await AsyncStorage.clear();
    } catch(e) {
      console.error("DB Clear Error:", e);
    }
  }
};

export { KEYS };
