import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import i18n from '../i18n';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (__DEV__) console.error('ErrorBoundary:', error, errorInfo);
  }

  retry = () => this.setState({ hasError: false, error: null });

  render() {
    if (this.state.hasError && this.state.error) {
      const showDetail = typeof __DEV__ !== 'undefined' && __DEV__;
      return (
        <View style={styles.container}>
          <Text style={styles.title}>{i18n.t('common.errorTitle')}</Text>
          {showDetail && (
            <Text style={styles.message}>{this.state.error?.message}</Text>
          )}
          <TouchableOpacity style={styles.retryBtn} onPress={this.retry}>
            <Text style={styles.retryText}>{i18n.t('game.retry')}</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#0a0a0f',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#f4f4f5',
    marginBottom: 12,
  },
  message: {
    fontSize: 14,
    color: '#a1a1aa',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryBtn: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#6366f1',
    borderRadius: 12,
  },
  retryText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
