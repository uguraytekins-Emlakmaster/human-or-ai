import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ScrollView,
  Platform,
  Linking,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { colors, spacing, typography, borderRadius } from '../theme';
import { setSoundEnabled, playSampleCorrect, playSampleWrong } from '../../audio/sounds';
import i18n, { setLanguage, supportedLanguages } from '../../i18n';
import { PRIVACY_POLICY_URL, PLAY_STORE_URL, APP_STORE_URL, SUPPORT_DEVELOPMENT_URL } from '../../constants/appLinks';
import { removeAdsPurchased, purchaseRemoveAds, isMonetizationLive } from '../../monetization/ads';
import {
  isStreakReminderEnabled,
  setStreakReminderEnabled,
  requestNotificationPermission,
  scheduleStreakReminderIfEnabled,
} from '../../notifications/streakReminder';
import { getDailyStreak } from '../../retention/dailyStreak';

interface SettingsScreenProps {
  onBack: () => void;
  onAchievements?: () => void;
  onPrivacy?: () => void;
}

function SettingRow({
  icon,
  label,
  description,
  right,
}: {
  icon: string;
  label: string;
  description?: string;
  right: React.ReactNode;
}) {
  return (
    <View style={styles.row}>
      <View style={styles.rowLeft}>
        <View style={styles.iconWrap}>
          <Text style={styles.icon}>{icon}</Text>
        </View>
        <View style={styles.rowText}>
          <Text style={styles.rowLabel}>{label}</Text>
          {description ? (
            <Text style={styles.rowDesc} numberOfLines={1}>
              {description}
            </Text>
          ) : null}
        </View>
      </View>
      <View style={styles.rowRight}>{right}</View>
    </View>
  );
}

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.cardInner}>{children}</View>
    </View>
  );
}

export function SettingsScreen({ onBack, onAchievements, onPrivacy }: SettingsScreenProps) {
  const { t } = useTranslation();
  const [soundOn, setSoundOn] = React.useState(true);
  const [hapticsOn, setHapticsOn] = React.useState(true);
  const [adsRemoved, setAdsRemoved] = React.useState(removeAdsPurchased());
  const [streakReminderOn, setStreakReminderOn] = React.useState(isStreakReminderEnabled());

  useEffect(() => {
    setSoundEnabled(soundOn);
  }, [soundOn]);

  const handleStreakReminderToggle = async (value: boolean) => {
    if (value) {
      const granted = await requestNotificationPermission();
      if (!granted) {
        Alert.alert(
          t('settings.notificationsPermissionTitle'),
          t('settings.notificationsPermissionMessage')
        );
        return;
      }
      await setStreakReminderEnabled(true);
      setStreakReminderOn(true);
      await scheduleStreakReminderIfEnabled(getDailyStreak());
    } else {
      await setStreakReminderEnabled(false);
      setStreakReminderOn(false);
    }
  };

  const currentLang = (i18n.language?.split('-')[0] ?? i18n.language) ?? 'en';

  const handleRateApp = () => {
    if (Platform.OS === 'android' && PLAY_STORE_URL) {
      Linking.openURL(PLAY_STORE_URL).catch(() =>
        Alert.alert(t('settings.rateApp'), t('settings.rateAppUnavailable'))
      );
    } else if (Platform.OS === 'ios' && APP_STORE_URL) {
      Linking.openURL(APP_STORE_URL).catch(() =>
        Alert.alert(t('settings.rateApp'), t('settings.rateAppUnavailable'))
      );
    } else {
      Alert.alert(t('settings.rateApp'), t('settings.rateAppWeb'));
    }
  };

  const handlePrivacy = () => {
    if (onPrivacy) {
      onPrivacy();
      return;
    }
    Linking.openURL(PRIVACY_POLICY_URL).catch(() =>
      Alert.alert(t('settings.privacy'), t('settings.privacyUnavailable'))
    );
  };

  const handleRemoveAds = async () => {
    const ok = await purchaseRemoveAds();
    if (ok) {
      setAdsRemoved(true);
      Alert.alert(t('settings.removeAds'), t('settings.removeAdsThankYou'));
    }
  };

  const handleSupport = () => {
    if (SUPPORT_DEVELOPMENT_URL) {
      Linking.openURL(SUPPORT_DEVELOPMENT_URL).catch(() =>
        Alert.alert(t('settings.supportDevelopment'), t('settings.privacyUnavailable'))
      );
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={onBack}
          style={styles.backBtn}
          activeOpacity={0.7}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Text style={styles.backChevron}>‹</Text>
          <Text style={styles.backLabel}>{t('settings.back')}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{t('settings.title')}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <SectionCard title={t('settings.sectionAudio')}>
          <SettingRow
            icon="🔊"
            label={t('settings.sound')}
            description={t('settings.soundDesc')}
            right={
              <View style={styles.soundRight}>
                <TouchableOpacity
                  style={styles.playSampleBtn}
                  onPress={() => {
                    playSampleCorrect();
                    setTimeout(() => playSampleWrong(), 600);
                  }}
                >
                  <Text style={styles.playSampleText}>{t('settings.playSample')}</Text>
                </TouchableOpacity>
                <Switch
                  value={soundOn}
                  onValueChange={setSoundOn}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor={colors.white}
                  ios_backgroundColor={colors.border}
                />
              </View>
            }
          />
          <View style={styles.separator} />
          <SettingRow
            icon="📳"
            label={t('settings.haptics')}
            description={t('settings.hapticsDesc')}
            right={
              <Switch
                value={hapticsOn}
                onValueChange={setHapticsOn}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={colors.white}
                ios_backgroundColor={colors.border}
              />
            }
          />
          <View style={styles.separator} />
          <SettingRow
            icon="🔥"
            label={t('settings.streakReminder')}
            description={t('settings.streakReminderDesc')}
            right={
              <Switch
                value={streakReminderOn}
                onValueChange={handleStreakReminderToggle}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={colors.white}
                ios_backgroundColor={colors.border}
              />
            }
          />
        </SectionCard>

        <SectionCard title={t('settings.sectionLanguage')}>
          <Text style={styles.langHint}>{t('settings.languageDesc')}</Text>
          <View style={styles.langGrid}>
            {supportedLanguages.map((code) => {
              const isActive = currentLang === code;
              return (
                <TouchableOpacity
                  key={code}
                  style={[styles.langChip, isActive && styles.langChipActive]}
                  onPress={() => setLanguage(code)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.langChipText,
                      isActive && styles.langChipTextActive,
                    ]}
                    numberOfLines={1}
                  >
                    {t(`languages.${code}`)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </SectionCard>

        <SectionCard title={t('settings.sectionAbout')}>
          <View style={styles.versionRow}>
            <Text style={styles.versionIcon}>ℹ️</Text>
            <Text style={styles.versionText}>{t('settings.version')}</Text>
          </View>
          {onAchievements ? (
            <TouchableOpacity
              style={styles.linkRow}
              onPress={onAchievements}
              activeOpacity={0.7}
            >
              <Text style={styles.linkIcon}>🏆</Text>
              <Text style={styles.linkText}>{t('settings.achievements')}</Text>
              <Text style={styles.linkArrow}>›</Text>
            </TouchableOpacity>
          ) : null}
          {!adsRemoved && isMonetizationLive() && (
            <TouchableOpacity
              style={styles.linkRow}
              onPress={handleRemoveAds}
              activeOpacity={0.7}
            >
              <Text style={styles.linkIcon}>🚫</Text>
              <Text style={styles.linkText}>{t('settings.removeAds')}</Text>
              <Text style={styles.linkArrow}>›</Text>
            </TouchableOpacity>
          )}
          {SUPPORT_DEVELOPMENT_URL ? (
            <TouchableOpacity
              style={styles.linkRow}
              onPress={handleSupport}
              activeOpacity={0.7}
            >
              <Text style={styles.linkIcon}>☕</Text>
              <Text style={styles.linkText}>{t('settings.supportDevelopment')}</Text>
              <Text style={styles.linkArrow}>›</Text>
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity
            style={styles.linkRow}
            onPress={handleRateApp}
            activeOpacity={0.7}
          >
            <Text style={styles.linkIcon}>⭐</Text>
            <Text style={styles.linkText}>{t('settings.rateApp')}</Text>
            <Text style={styles.linkArrow}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.linkRow, styles.linkRowLast]}
            onPress={handlePrivacy}
            activeOpacity={0.7}
          >
            <Text style={styles.linkIcon}>🔒</Text>
            <Text style={styles.linkText}>{t('settings.privacy')}</Text>
            <Text style={styles.linkArrow}>›</Text>
          </TouchableOpacity>
        </SectionCard>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingRight: spacing.sm,
  },
  backChevron: {
    fontSize: 28,
    color: colors.primary,
    fontWeight: '300',
    marginTop: Platform.OS === 'android' ? -2 : 0,
  },
  backLabel: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
    marginLeft: 2,
  },
  title: {
    ...typography.title,
    color: colors.text,
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    pointerEvents: 'none',
  },
  headerSpacer: {
    width: 80,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  card: {
    marginBottom: spacing.xl,
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  sectionTitle: {
    ...typography.caption,
    fontSize: 13,
    fontWeight: '600',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  cardInner: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    minHeight: 56,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: 0,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  icon: {
    fontSize: 20,
  },
  rowText: {
    flex: 1,
    minWidth: 0,
  },
  rowLabel: {
    ...typography.body,
    fontWeight: '600',
    color: colors.text,
  },
  rowDesc: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  rowRight: {
    marginLeft: spacing.sm,
  },
  soundRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  playSampleBtn: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  playSampleText: {
    ...typography.bodySmall,
    color: colors.primary,
    fontWeight: '600',
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
    marginLeft: 40 + spacing.md,
  },
  langHint: {
    ...typography.bodySmall,
    color: colors.textMuted,
    marginBottom: spacing.md,
  },
  langGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  langChip: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  langChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  langChipText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  langChipTextActive: {
    color: colors.white,
    fontWeight: '600',
  },
  versionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  versionIcon: {
    fontSize: 18,
    marginRight: spacing.md,
  },
  versionText: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: 0,
  },
  linkRowLast: {
    paddingBottom: spacing.sm,
  },
  linkIcon: {
    fontSize: 18,
    marginRight: spacing.md,
  },
  linkText: {
    ...typography.body,
    color: colors.text,
    flex: 1,
  },
  linkArrow: {
    ...typography.body,
    color: colors.textMuted,
    fontSize: 20,
    fontWeight: '300',
  },
  bottomSpacer: {
    height: spacing.xl,
  },
});
