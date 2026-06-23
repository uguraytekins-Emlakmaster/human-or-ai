import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Audio, Video, ResizeMode } from 'expo-av';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useGame } from '../../game/GameContext';
import { GameAnswerButton } from '../GameAnswerButton';
import { StreakBadge } from '../StreakBadge';
import { colors, spacing, typography } from '../theme';
import { trackGameOver } from '../../analytics/analytics';

interface GameScreenProps {
  onResult: () => void;
  onGameOver: () => void;
}

export const GameScreen = React.memo(function GameScreen({ onResult, onGameOver }: GameScreenProps) {
  const { t } = useTranslation();
  const { state, submitAnswer, useFiftyFifty, useSkip } = useGame();
  const { currentImage, score, streak, isRevealing, isPlaying, gameMode, timeLeft, powerUps, hiddenAnswer } = state;
  const [imageError, setImageError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);
  const soundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    if (currentImage) setImageError(false);
  }, [currentImage?.id]);

  useEffect(() => {
    return () => {
      if (soundRef.current) soundRef.current.unloadAsync().catch(() => {});
    };
  }, [currentImage?.id]);

  useEffect(() => {
    if (isRevealing) onResult();
  }, [isRevealing, onResult]);

  useEffect(() => {
    if (!isPlaying && state.totalShown > 0) onGameOver();
  }, [isPlaying, state.totalShown, onGameOver]);

  useEffect(() => {
    if (!currentImage && !isPlaying && state.totalShown === 0) onGameOver();
  }, [currentImage, isPlaying, state.totalShown, onGameOver]);

  useEffect(() => {
    if (gameMode === 'time_attack' && timeLeft === 0) {
      trackGameOver(score, streak, 'time_attack');
      onGameOver();
    }
  }, [gameMode, timeLeft, score, streak, onGameOver]);

  if (!currentImage) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loading}>{t('game.loading')}</Text>
      </SafeAreaView>
    );
  }

  const contentType = currentImage.contentType;
  const canFiftyFifty = powerUps.fiftyFifty > 0 && hiddenAnswer === null;
  const canSkip = powerUps.skip > 0;

  const renderContent = () => {
    if (contentType === 'image' && currentImage.uri) {
      if (imageError) {
        return (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.imagePlaceholderText}>?</Text>
            <Text style={styles.imagePlaceholderSubtext}>{t('game.contentUnavailable')}</Text>
            <View style={styles.retryRow}>
              <TouchableOpacity
                style={styles.retryBtn}
                onPress={() => { setImageError(false); setRetryKey((k) => k + 1); }}
              >
                <Text style={styles.retryBtnText}>{t('game.retry')}</Text>
              </TouchableOpacity>
              {canSkip && (
                <TouchableOpacity style={styles.retryBtn} onPress={useSkip}>
                  <Text style={styles.retryBtnText}>{t('game.skip')}</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        );
      }
      return (
        <Image
          key={`${currentImage.id}-${retryKey}`}
          source={{ uri: currentImage.uri }}
          style={styles.image}
          contentFit="cover"
          onError={() => setImageError(true)}
          cachePolicy={Platform.OS === 'web' ? 'none' : 'memory-disk'}
        />
      );
    }
    if (contentType === 'audio' && currentImage.audioUri) {
      return (
        <AudioPlayer uri={currentImage.audioUri} soundRef={soundRef} />
      );
    }
    if (contentType === 'text' && currentImage.text) {
      return (
        <View style={styles.textContent}>
          <Text style={styles.textContentBody}>"{currentImage.text}"</Text>
        </View>
      );
    }
    if (contentType === 'video' && currentImage.videoUri) {
      if (imageError) {
        return (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.imagePlaceholderSubtext}>{t('game.contentUnavailable')}</Text>
            <View style={styles.retryRow}>
              <TouchableOpacity style={styles.retryBtn} onPress={() => { setImageError(false); setRetryKey((k) => k + 1); }}>
                <Text style={styles.retryBtnText}>{t('game.retry')}</Text>
              </TouchableOpacity>
              {canSkip && (
                <TouchableOpacity style={styles.retryBtn} onPress={useSkip}>
                  <Text style={styles.retryBtnText}>{t('game.skip')}</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        );
      }
      return (
        <View style={styles.videoWrapper}>
          <Video
            key={`${currentImage.id}-${retryKey}`}
            source={{ uri: currentImage.videoUri }}
            style={styles.video}
            useNativeControls
            resizeMode={ResizeMode.CONTAIN}
            status={{ shouldPlay: true, isLooping: false }}
            onError={() => setImageError(true)}
          />
        </View>
      );
    }
    if (contentType === 'video') {
      return (
        <View style={styles.imagePlaceholder}>
          <Text style={styles.imagePlaceholderSubtext}>{t('game.videoComingSoon')}</Text>
        </View>
      );
    }
    return (
      <View style={styles.imagePlaceholder}>
        <Text style={styles.imagePlaceholderSubtext}>{t('game.contentUnavailable')}</Text>
        {canSkip && (
          <TouchableOpacity style={styles.retryBtn} onPress={useSkip}>
            <Text style={styles.retryBtnText}>{t('game.skip')}</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.topBar}>
        <View style={styles.scoreRow}>
          <Text style={styles.scoreLabel}>{t('game.score')}</Text>
          <Text style={styles.scoreValue}>{score}</Text>
        </View>
        {gameMode === 'time_attack' && (
          <View style={styles.timerBox}>
            <Text style={styles.timer}>{t('game.timer', { seconds: timeLeft })}</Text>
          </View>
        )}
        <StreakBadge streak={streak} />
      </View>

      <View style={styles.powerUpRow}>
        <TouchableOpacity
          style={[styles.powerUpBtn, !canFiftyFifty && styles.powerUpBtnDisabled]}
          onPress={useFiftyFifty}
          disabled={!canFiftyFifty}
        >
          <Text style={styles.powerUpIcon}>50/50</Text>
          <Text style={styles.powerUpCount}>{powerUps.fiftyFifty}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.powerUpBtn, !canSkip && styles.powerUpBtnDisabled]}
          onPress={useSkip}
          disabled={!canSkip}
        >
          <Text style={styles.powerUpIcon}>{t('game.skip')}</Text>
          <Text style={styles.powerUpCount}>{powerUps.skip}</Text>
        </TouchableOpacity>
      </View>

      <Animated.View entering={FadeIn.duration(280)} style={styles.imageWrapper}>
        {renderContent()}
      </Animated.View>

      <View style={styles.buttons}>
        {hiddenAnswer !== 'real' && (
          <View style={styles.buttonFlex}>
            <GameAnswerButton
              type="real"
              onPress={() => submitAnswer('real')}
              disabled={isRevealing}
            />
          </View>
        )}
        {hiddenAnswer !== 'ai' && (
          <View style={styles.buttonFlex}>
            <GameAnswerButton
              type="ai"
              onPress={() => submitAnswer('ai')}
              disabled={isRevealing}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
});

function AudioPlayer({ uri, soundRef }: { uri: string; soundRef: React.MutableRefObject<Audio.Sound | null> }) {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    let mounted = true;
    Audio.Sound.createAsync({ uri })
      .then(({ sound }) => {
        if (mounted) {
          soundRef.current = sound;
          setLoaded(true);
        } else {
          sound.unloadAsync().catch(() => {});
        }
      })
      .catch(() => {});
    return () => {
      mounted = false;
      if (soundRef.current) {
        soundRef.current.unloadAsync().catch(() => {});
        soundRef.current = null;
      }
    };
  }, [uri]);

  const play = async () => {
    if (soundRef.current) {
      try {
        await soundRef.current.replayAsync();
      } catch {
        await soundRef.current.playAsync();
      }
    }
  };

  return (
    <TouchableOpacity style={styles.audioPlaceholder} onPress={play} activeOpacity={0.8}>
      <Text style={styles.audioIcon}>🔊</Text>
      <Text style={styles.audioHint}>{loaded ? '▶ Tap to play' : '...'}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loading: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xxl,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  scoreRow: {
    alignItems: 'center',
  },
  scoreLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  scoreValue: {
    ...typography.title,
    color: colors.text,
  },
  timerBox: {
    backgroundColor: colors.surfaceElevated,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 12,
  },
  timer: {
    ...typography.headline,
    color: colors.primary,
  },
  imageWrapper: {
    flex: 1,
    marginHorizontal: spacing.md,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  videoWrapper: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  video: {
    width: '100%',
    height: '100%',
    minHeight: 200,
  },
  imagePlaceholder: {
    flex: 1,
    backgroundColor: colors.surfaceElevated,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    fontSize: 64,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  imagePlaceholderSubtext: {
    ...typography.bodySmall,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  retryRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  retryBtn: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 8,
  },
  retryBtnText: {
    ...typography.bodySmall,
    color: colors.primary,
    fontWeight: '600',
  },
  textContent: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.xl,
  },
  textContentBody: {
    ...typography.body,
    color: colors.text,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  audioPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surfaceElevated,
  },
  audioIcon: { fontSize: 48, marginBottom: spacing.sm },
  audioHint: { ...typography.bodySmall, color: colors.textMuted },
  powerUpRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  powerUpBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceElevated,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 12,
    gap: spacing.xs,
  },
  powerUpBtnDisabled: { opacity: 0.5 },
  powerUpIcon: { ...typography.caption, color: colors.primary },
  powerUpCount: { ...typography.headline, color: colors.text },
  buttons: {
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  buttonFlex: {
    flex: 1,
  },
});
