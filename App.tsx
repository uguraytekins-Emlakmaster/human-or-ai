import './src/i18n';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Platform, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useTranslation } from 'react-i18next';
import { AppNavigator } from './src/navigation/AppNavigator';
import { ErrorBoundary } from './src/ui/ErrorBoundary';
import { initSounds } from './src/audio/sounds';
import { trackSessionStart, trackSessionEnd } from './src/analytics/analytics';
import { loadFromStorage as loadPersonalBest } from './src/retention/personalBest';
import { loadFromStorage as loadProgression } from './src/progression/achievements';
import { loadFromStorage as loadDailyRewards } from './src/retention/dailyRewards';
import { loadDailyStreakFromStorage } from './src/retention/dailyStreak';
import { loadDailyChallengesCountFromStorage } from './src/retention/dailyChallengesCount';
import { loadRemoveAdsFromStorage } from './src/monetization/ads';
import { loadInterstitialState } from './src/monetization/monetizationState';
import { loadStreakReminderPreference } from './src/notifications/streakReminder';
import { applySavedLanguage } from './src/i18n';

function AppContent() {
  const { t } = useTranslation();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    Promise.all([
      loadPersonalBest(),
      loadProgression(),
      loadDailyRewards(),
      loadDailyStreakFromStorage(),
      loadDailyChallengesCountFromStorage(),
      loadRemoveAdsFromStorage(),
      loadInterstitialState(),
      loadStreakReminderPreference(),
      applySavedLanguage(),
    ])
      .then(() => setHydrated(true))
      .catch((e) => {
        if (__DEV__) console.warn('[App] Hydration failed', e);
        setHydrated(true);
      });
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      initSounds();
    } catch (_) {}
    trackSessionStart();
    const start = Date.now();
    return () => {
      trackSessionEnd(Math.round((Date.now() - start) / 1000));
    };
  }, [hydrated]);

  if (!hydrated) {
    return (
      <View style={styles.loadingRoot}>
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={styles.loadingText}>{t('common.loading')}</Text>
      </View>
    );
  }

  return (
    <>
      <StatusBar style="light" />
      <AppNavigator />
    </>
  );
}

const RootWrapper = Platform.OS === 'web' ? View : GestureHandlerRootView;

export default function App() {
  return (
    <ErrorBoundary>
      <View style={styles.root}>
        <RootWrapper style={styles.flex}>
          <SafeAreaProvider style={styles.flex}>
            <AppContent />
          </SafeAreaProvider>
        </RootWrapper>
      </View>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0a0a0f',
    ...(Platform.OS === 'web' ? { position: 'absolute' as const, top: 0, left: 0, right: 0, bottom: 0 } : {}),
  },
  flex: {
    flex: 1,
  },
  loadingRoot: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0a0a0f',
    gap: 16,
  },
  loadingText: {
    color: '#a1a1aa',
    fontSize: 16,
  },
});
