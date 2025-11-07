// app/(tabs)/game/[id].tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import games from '../../../data/games.json';

const FAV_KEY = 'favorites:v1';

async function loadFavorites(): Promise<string[]> {
  const raw = await AsyncStorage.getItem(FAV_KEY);
  return raw ? JSON.parse(raw) : [];
}
async function saveFavorites(ids: string[]) {
  await AsyncStorage.setItem(FAV_KEY, JSON.stringify(ids));
}

export default function GameDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const game = (games as any[]).find((g) => g.id === id);

  const [favorites, setFavorites] = useState<string[]>([]);
  const isFav = favorites.includes(id || '');

  useEffect(() => {
    loadFavorites().then(setFavorites);
  }, []);

  if (!game) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 }}>
        <Text style={{ marginBottom: 12 }}>Game not found.</Text>
        <Pressable onPress={() => router.back()} style={{ padding: 10, borderWidth: 1, borderRadius: 6 }}>
          <Text>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  const toggleFav = async () => {
    const next = isFav ? favorites.filter((x) => x !== (id as string)) : [...favorites, id as string];
    setFavorites(next);
    await saveFavorites(next);
  };

return (
  <SafeAreaView style={{ flex: 1 }}>
    <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
      <Pressable
        onPress={() => router.back()}
        style={{
          alignSelf: 'flex-start',
          paddingVertical: 8,
          paddingHorizontal: 14,      // more horizontal padding
          borderWidth: 1,
          borderRadius: 10,            // slightly rounder
          marginBottom: 12,
          marginLeft: 6                // nudge away from the left edge
        }}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} // bigger tap area
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <Text style={{ fontSize: 16 }}>‹ Back</Text>
      </Pressable>

      <Text style={{ fontSize: 22, fontWeight: '700', marginBottom: 6 }}>{game.name}</Text>
      <Text style={{ opacity: 0.7, marginBottom: 12 }}>
        Supplies: {game.supplies.join(', ')} · Players: {game.minPlayers}-{game.maxPlayers}
      </Text>

      <Pressable
        onPress={toggleFav}
        style={{
          alignSelf: 'flex-start',
          paddingVertical: 6,
          paddingHorizontal: 12,
          borderWidth: 1,
          borderRadius: 8,
          marginBottom: 16,
          backgroundColor: isFav ? '#ffe8a3' : '#fff',
        }}
      >
        <Text>{isFav ? '★ Favorited' : '☆ Add to favorites'}</Text>
      </Pressable>

      <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8 }}>Instructions</Text>
      {game.instructions.map((step: string, idx: number) => (
        <View key={idx} style={{ flexDirection: 'row', marginBottom: 8 }}>
          <Text style={{ width: 24, fontWeight: '600' }}>{idx + 1}.</Text>
          <Text style={{ flex: 1 }}>{step}</Text>
        </View>
      ))}
    </ScrollView>
      </SafeAreaView>
  );
}
