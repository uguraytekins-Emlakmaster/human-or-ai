import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { PRIVACY_POLICY_URL } from '../../constants/appLinks';
import { PRIVACY_POLICY_SECTIONS } from '../../content/privacyPolicyText';
import { colors, spacing, typography } from '../theme';

interface PrivacyPolicyScreenProps {
  onBack: () => void;
}

export function PrivacyPolicyScreen({ onBack }: PrivacyPolicyScreenProps) {
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.back}>{t('settings.back')}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{t('settings.privacy')}</Text>
        <View style={styles.spacer} />
      </View>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.updated}>{t('privacy.updated')}</Text>
        {PRIVACY_POLICY_SECTIONS.map((s) => (
          <View key={s.titleKey} style={styles.section}>
            <Text style={styles.sectionTitle}>{t(s.titleKey)}</Text>
            <Text style={styles.body}>{t(s.bodyKey)}</Text>
          </View>
        ))}
        <TouchableOpacity onPress={() => Linking.openURL(PRIVACY_POLICY_URL).catch(() => {})}>
          <Text style={styles.link}>{PRIVACY_POLICY_URL}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  back: { ...typography.body, color: colors.primary, fontWeight: '600' },
  title: { ...typography.headline, color: colors.text },
  spacer: { width: 48 },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xxl },
  updated: { ...typography.caption, color: colors.textMuted, marginBottom: spacing.lg },
  section: { marginBottom: spacing.lg },
  sectionTitle: { ...typography.headline, color: colors.text, marginBottom: spacing.sm },
  body: { ...typography.body, color: colors.textSecondary, lineHeight: 22 },
  link: { ...typography.caption, color: colors.primary, marginTop: spacing.md },
});
