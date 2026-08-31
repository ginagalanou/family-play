import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppText } from "../../components/AppText";
import { BrandLogo } from "../../components/BrandLogo";
import SmoothScreen from "../../components/SmoothScreen";
import { Colors } from "../../theme/colors";
import {
  addCustomGame,
  loadCustomGames,
  updateCustomGame,
} from "../../utils/customGames";
import { normalizeInstructions, splitCSV } from "../../utils/games";
import {
  activityPreset,
  agePreset,
  isSelected,
  noisePreset,
  parseList,
  playerPreset,
  presetMatches,
  supplyPreset,
  toggleChoice,
} from "../../utils/addGameForm";

export default function AddGame() {
  const { editId } = useLocalSearchParams<{ editId?: string }>();
  const editGameId = Array.isArray(editId) ? editId[0] : editId;

  const [name, setName] = useState("");
  const [supplies, setSupplies] = useState("");
  const [supplyChoices, setSupplyChoices] = useState<string[]>([]);
  const [ageChoices, setAgeChoices] = useState<string[]>([]);
  const [playerChoices, setPlayerChoices] = useState<string[]>([]);
  const [activity, setActivity] = useState("");
  const [activityChoices, setActivityChoices] = useState<string[]>([]);
  const [noiseChoices, setNoiseChoices] = useState<string[]>([]);
  const [instructions, setInstructions] = useState("");
  const [editing, setEditing] = useState(false);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!editGameId) return;
    loadCustomGames().then((list) => {
      const found = list.find((g) => g.id === editGameId);
      if (!found) return;
      setEditing(true);
      setName(found.name);
      const existingSupplies = found.supplies ?? [];
      setSupplyChoices(
        existingSupplies.filter((s) =>
          presetMatches(supplyPreset, s)
        )
      );
      const customSupplies = existingSupplies.filter(
        (s) => !presetMatches(supplyPreset, s)
      );
      setSupplies(customSupplies.join(", "));

      const loadedAges = found.ages ?? [];
      setAgeChoices(loadedAges);
      setPlayerChoices(splitCSV(found.players));
      const loadedActivity = splitCSV(found.activity);
      setActivityChoices(
        loadedActivity.filter((value) =>
          presetMatches(activityPreset, value)
        )
      );
      setActivity(
        loadedActivity
          .filter((value) => !presetMatches(activityPreset, value))
          .join(", ")
      );
      setNoiseChoices(splitCSV(found.noise));
      setInstructions(normalizeInstructions(found.instructions).join("\n"));
    });
  }, [editGameId]);

  const resetForm = useCallback(() => {
    setName("");
    setSupplies("");
    setSupplyChoices([]);
    setAgeChoices([]);
    setPlayerChoices([]);
    setActivity("");
    setActivityChoices([]);
    setNoiseChoices([]);
    setInstructions("");
    setEditing(false);
  }, []);

  const handleSave = useCallback(async () => {
    setError(null);

    if (!name.trim() || !instructions.trim()) {
      setError("Name and instructions are required.");
      return;
    }

    setSaving(true);
    const suppliesList = [
      ...supplyChoices,
      ...parseList(supplies),
    ];
    const activityList = [
      ...activityChoices,
      ...parseList(activity),
    ];
    const payload = {
      name,
      supplies: suppliesList,
      ages: ageChoices,
      instructions,
      players: playerChoices.join(", ") || undefined,
      activity: activityList.join(", ") || undefined,
      noise: noiseChoices.join(", ") || undefined,
    };

    const targetId =
      editing && editGameId
        ? editGameId
        : `custom-${Date.now()}`;

    try {
      if (editing && editGameId) {
        await updateCustomGame(editGameId, payload);
      } else {
        await addCustomGame({ id: targetId, ...payload });
      }

      resetForm();
      setSaving(false);
      router.replace({ pathname: "/(tabs)/game/[id]", params: { id: targetId } });
    } catch {
      setSaving(false);
      setError("We couldn't save that game. Please try again.");
    }
  }, [
    name,
    supplies,
    supplyChoices,
    instructions,
    playerChoices,
    ageChoices,
    activity,
    activityChoices,
    noiseChoices,
    editing,
    editGameId,
    resetForm,
  ]);

  return (
    <SmoothScreen style={styles.screen}>
      <SafeAreaView style={styles.container} edges={["top"]}>
        <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.headerBlock}>
            <View style={styles.headingRow}>
              <BrandLogo
                size={48}
                imageSize={32}
                borderRadius={14}
                shadow={false}
                containerStyle={styles.headerLogo}
              />
              <AppText variant="title" style={styles.heading}>
                {editing ? "Edit your game" : "Add your game"}
              </AppText>
            </View>
            <AppText variant="subtitle" style={styles.subtitle}>
              {editing
                ? "Update your saved game. Changes apply only to your custom list."
                : "Save a family favorite so it shows up in Browse and filters."}
            </AppText>
          </View>

          <FormSection title="Basics">
            <FormField label="Name" required>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Tissue keep-up"
                style={styles.input}
                placeholderTextColor={Colors.mutedText}
              />
            </FormField>
          </FormSection>

          <FormSection title="Setup">
            <FormField label="Supplies">
              <View style={styles.pillRow}>
                {supplyPreset.map((option) => {
                  const selected = isSelected(supplyChoices, option);
                  return (
                    <Pressable
                      key={option}
                      onPress={() =>
                        setSupplyChoices((prev) =>
                          selected
                            ? prev.filter((s) => s.toLowerCase() !== option.toLowerCase())
                            : [...prev, option]
                        )
                      }
                      style={[styles.pill, selected && styles.pillSelected]}
                    >
                      <AppText
                        variant="label"
                        style={[styles.pillText, selected && styles.pillTextSelected]}
                      >
                        {option}
                      </AppText>
                    </Pressable>
                  );
                })}
              </View>
              <TextInput
                value={supplies}
                onChangeText={setSupplies}
                placeholder="Custom (e.g., chalk, masking tape)"
                style={[styles.input, { marginTop: 8 }]}
                placeholderTextColor={Colors.mutedText}
              />
            </FormField>

            <FormField label="Ages">
              <View style={styles.pillRow}>
                {agePreset.map((option) => {
                  const selected = ageChoices.includes(option);
                  return (
                    <Pressable
                      key={option}
                      onPress={() =>
                        setAgeChoices((prev) =>
                          prev.includes(option)
                            ? prev.filter((o) => o !== option)
                            : [...prev, option]
                        )
                      }
                      style={[styles.pill, selected && styles.pillSelected]}
                    >
                      <AppText
                        variant="label"
                        style={[styles.pillText, selected && styles.pillTextSelected]}
                      >
                        {option}
                      </AppText>
                    </Pressable>
                  );
                })}
              </View>
            </FormField>

            <FormField label="Minimum players">
              <View style={styles.pillRow}>
                {playerPreset.map((option) => {
                  const selected = isSelected(playerChoices, option);
                  return (
                    <Pressable
                      key={option}
                      onPress={() => {
                        setPlayerChoices((current) => toggleChoice(current, option));
                      }}
                      style={[styles.pill, selected && styles.pillSelected]}
                    >
                      <AppText
                        variant="label"
                        style={[styles.pillText, selected && styles.pillTextSelected]}
                      >
                        {option}
                      </AppText>
                    </Pressable>
                  );
                })}
              </View>
            </FormField>

            <FormField label="Activity level">
              <View style={styles.pillRow}>
                {activityPreset.map((option) => {
                  const selected = isSelected(activityChoices, option);
                  return (
                    <Pressable
                      key={option}
                      onPress={() => {
                        setActivityChoices((current) => toggleChoice(current, option));
                      }}
                      style={[styles.pill, selected && styles.pillSelected]}
                    >
                      <AppText
                        variant="label"
                        style={[styles.pillText, selected && styles.pillTextSelected]}
                      >
                        {option}
                      </AppText>
                    </Pressable>
                  );
                })}
              </View>
              <TextInput
                value={activity}
                onChangeText={setActivity}
                placeholder="Custom (e.g., calm indoor)"
                style={[styles.input, { marginTop: 8 }]}
                placeholderTextColor={Colors.mutedText}
              />
            </FormField>

            <FormField label="Noise level">
              <View style={styles.pillRow}>
                {noisePreset.map((option) => {
                  const selected = isSelected(noiseChoices, option);
                  return (
                    <Pressable
                      key={option}
                      onPress={() => {
                        setNoiseChoices((current) => toggleChoice(current, option));
                      }}
                      style={[styles.pill, selected && styles.pillSelected]}
                    >
                      <AppText
                        variant="label"
                        style={[styles.pillText, selected && styles.pillTextSelected]}
                      >
                        {option}
                      </AppText>
                    </Pressable>
                  );
                })}
              </View>
            </FormField>
          </FormSection>

          <FormSection title="How to play">
            <FormField label="Instructions" required>
              <TextInput
                value={instructions}
                onChangeText={setInstructions}
                placeholder={"1) \n2) \n3) "}
                style={[styles.input, styles.textarea]}
                placeholderTextColor={Colors.mutedText}
                multiline
              />
              <AppText variant="hint" style={styles.hint}>
                One step per line. We’ll split and format them for you.
              </AppText>
            </FormField>
          </FormSection>

          {error ? (
            <View style={styles.bannerError}>
              <Ionicons name="alert-circle-outline" size={16} color={Colors.text} />
              <AppText variant="label" style={styles.bannerText}>
                {error}
              </AppText>
            </View>
          ) : null}

          <Pressable
            style={[styles.saveBtn, saving ? styles.saveBtnDisabled : null]}
            onPress={handleSave}
            disabled={saving}
          >
            <AppText variant="label" style={styles.saveBtnText}>
              {saving ? "Saving..." : "Save to list"}
            </AppText>
          </Pressable>

          {editing ? (
            <Pressable
              style={styles.cancelBtn}
              onPress={() => router.back()}
              disabled={saving}
              hitSlop={8}
            >
              <AppText variant="label" style={styles.cancelBtnText}>
                Go back without saving
              </AppText>
            </Pressable>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  </SmoothScreen>
  );
}

function FormField({
  label,
  children,
  required,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.field}>
      <AppText variant="label" style={styles.label}>
        {label}
        {required ? " (Required)" : ""}
      </AppText>
      {children}
    </View>
  );
}

function FormSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.formSection}>
      <AppText variant="label" style={styles.sectionTitle}>
        {title}
      </AppText>
      <View style={styles.sectionBody}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.pageBackground,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.pageBackground,
  },
  content: {
    padding: 16,
    gap: 14,
  },
  headerBlock: {
    backgroundColor: Colors.primaryTeal,
    borderRadius: 18,
    padding: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: Colors.overlayTealBorder,
  },
  headingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerLogo: {
    backgroundColor: Colors.mint,
    borderColor: Colors.overlayTealBorder,
  },
  heading: {
    textAlign: "left",
    fontSize: 24,
    fontWeight: "700",
    color: Colors.white,
  },
  subtitle: {
    color: Colors.mint,
    lineHeight: 20,
  },
  field: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  formSection: {
    gap: 8,
  },
  sectionTitle: {
    color: Colors.deepTeal,
    fontSize: 15,
    fontWeight: "800",
    paddingHorizontal: 2,
  },
  sectionBody: {
    gap: 10,
  },
  label: {
    color: Colors.deepTeal,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: Colors.text,
    backgroundColor: Colors.white,
  },
  textarea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  hint: {
    color: Colors.mutedText,
    marginTop: 6,
  },
  pillRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  pillSelected: {
    backgroundColor: Colors.softTealTint,
    borderColor: Colors.deepTeal,
  },
  pillText: {
    color: Colors.deepTeal,
  },
  pillTextSelected: {
    color: Colors.deepTeal,
    fontWeight: "700",
  },
  saveBtn: {
    backgroundColor: Colors.warmAccent,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: 8,
  },
  saveBtnDisabled: {
    opacity: 0.7,
  },
  saveBtnText: {
    color: Colors.text,
    fontWeight: "700",
    fontSize: 16,
  },
  cancelBtn: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: Colors.white,
    marginTop: 6,
  },
  cancelBtnText: {
    color: Colors.deepTeal,
    fontWeight: "600",
  },
  bannerError: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.errorTint,
    borderWidth: 1,
    borderColor: Colors.errorBorder,
    borderRadius: 10,
    padding: 10,
  },
  bannerText: { color: Colors.text },
});
