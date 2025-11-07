import { Link } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import games from '../../data/games.json';

// simple "chip" UI
function Chip({
  label,
  selected,
  onPress,
}: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: selected ? '#111' : '#ccc',
        backgroundColor: selected ? '#eee' : '#fff',
        marginRight: 8,
        marginBottom: 8,
      }}
    >
      <Text style={{ fontSize: 12 }}>{label}</Text>
    </Pressable>
  );
}

export default function Index() {
  // OPTIONS
  const SUPPLIES = [
    'none',
    'balloon',
    'paper',
    'pencil',
    'dice',
    'deck-of-cards',
    'ball',
    'masking-tape',
    'string',
  ];
  const AGES = ['3-5', '6-8', '9-12', '13+'];

  // FILTER STATE
  const [selectedSupplies, setSelectedSupplies] = useState<string[]>([]);
  const [selectedAges, setSelectedAges] = useState<string[]>([...AGES]); // preselect all
  const [players, setPlayers] = useState<number>(2);

  const toggle = (arr: string[], setArr: (v: string[]) => void, v: string) => {
    setArr(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
  };

  // FILTER LOGIC
  const results = useMemo(() => {
    const hasSupply = (gSupplies: string[]) => {
      if (gSupplies.includes('none'))
        return selectedSupplies.length === 0 || selectedSupplies.includes('none');
      if (selectedSupplies.length === 0) return false;
      return gSupplies.every((s) => selectedSupplies.includes(s));
    };
    const ageMatch = (gAges: string[]) => gAges.some((a) => selectedAges.includes(a));
    const playersMatch = (min: number, max: number) => players >= min && players <= max;

    return games
      .filter(
        (g) => hasSupply(g.supplies) && ageMatch(g.ages) && playersMatch(g.minPlayers, g.maxPlayers),
      )
      .slice(0, 5);
  }, [selectedSupplies, selectedAges, players]);

  const reset = () => {
    setSelectedSupplies([]);
    setSelectedAges([...AGES]);
    setPlayers(2);
  };

  return (
    <View style={{ flex: 1, paddingTop: 48, paddingHorizontal: 16 }}>
      {/* SUPPLIES */}
      <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 6 }}>Supplies you have</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 }}>
        {SUPPLIES.map((s) => (
          <Chip
            key={s}
            label={s}
            selected={selectedSupplies.includes(s)}
            onPress={() => toggle(selectedSupplies, setSelectedSupplies, s)}
          />
        ))}
      </View>

      {/* AGES */}
      <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 6 }}>Ages</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 }}>
        {AGES.map((a) => (
          <Chip
            key={a}
            label={a}
            selected={selectedAges.includes(a)}
            onPress={() => toggle(selectedAges, setSelectedAges, a)}
          />
        ))}
      </View>

      {/* PLAYERS */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
        <Text style={{ fontSize: 16, fontWeight: '600', marginRight: 12 }}>Players</Text>
        <Pressable
          onPress={() => setPlayers((p) => Math.max(1, p - 1))}
          style={{
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 6,
          }}
        >
          <Text>-</Text>
        </Pressable>
        <Text style={{ width: 40, textAlign: 'center', fontSize: 16 }}>{players}</Text>
        <Pressable
          onPress={() => setPlayers((p) => Math.min(12, p + 1))}
          style={{
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 6,
          }}
        >
          <Text>+</Text>
        </Pressable>

        <Pressable
          onPress={reset}
          style={{
            marginLeft: 'auto',
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 6,
          }}
        >
          <Text>Reset</Text>
        </Pressable>
      </View>

      {/* RESULTS */}
      <Text style={{ fontSize: 14, marginBottom: 6 }}>
        Showing up to 5 suggestions ({results.length} found)
      </Text>

      <FlatList
        data={results}
        keyExtractor={(g) => g.id}
        ListEmptyComponent={
          <Text style={{ opacity: 0.7, marginTop: 16 }}>
            No matches yet. Select supplies, ages, and player count.
          </Text>
        }
        renderItem={({ item }) => (
  <Link
    href={{ pathname: '/(tabs)/game/[id]', params: { id: item.id } }}
    asChild
  >
    <Pressable style={{ paddingVertical: 10, borderBottomWidth: 1, borderColor: '#eee' }}>
      <Text style={{ fontSize: 16, fontWeight: '600' }}>{item.name}</Text>
      <Text style={{ fontSize: 12, opacity: 0.7 }}>
        Supplies: {item.supplies.join(', ')} · Players: {item.minPlayers}-{item.maxPlayers}
      </Text>
    </Pressable>
  </Link>
)}
      />
    </View>
  );
}
