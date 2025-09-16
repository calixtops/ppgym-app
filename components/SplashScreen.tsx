import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors, Spacing, Typography } from '../constants/theme';

// Import condicional do Image apenas para mobile
let Image: any = null;
if (Platform.OS !== 'web') {
  const RN = require('react-native');
  Image = RN.Image;
}

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  onFinish?: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const router = useRouter();
  const [showSkip, setShowSkip] = useState(false);
  const isWeb = Platform.OS === 'web';

  useEffect(() => {
    // Mostra o botão "Pular" após 1 segundo
    const skipTimer = setTimeout(() => {
      setShowSkip(true);
    }, 1000);

    // Timer para mostrar a tela inicial por 3 segundos
    const timer = setTimeout(() => {
      if (onFinish) {
        onFinish();
      } else {
        // Navega para a tela principal
        router.replace('/(tabs)');
      }
    }, 3000);

    return () => {
      clearTimeout(timer);
      clearTimeout(skipTimer);
    };
  }, [onFinish, router]);

  const handleSkip = () => {
    if (onFinish) {
      onFinish();
    } else {
      router.replace('/(tabs)');
    }
  };

  if (isWeb) {
    return (
      <View style={styles.container}>
        <View style={styles.webBackground} />
        {showSkip && (
          <View style={styles.skipContainer}>
            <Pressable style={styles.skipButton} onPress={handleSkip}>
              <Text style={styles.skipText}>Pular</Text>
            </Pressable>
          </View>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/tela_inicial.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      
      {showSkip && (
        <View style={styles.skipContainer}>
          <Pressable style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipText}>Pular</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    position: 'absolute',
    width: width,
    height: height,
    top: 0,
    left: 0,
  },
  webBackground: {
    position: 'absolute',
    width: width,
    height: height,
    top: 0,
    left: 0,
    backgroundColor: Colors.light.primary,
  },
  skipContainer: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 2,
  },
  skipButton: {
    backgroundColor: Colors.light.primary + '20',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.light.primary,
  },
  skipText: {
    color: Colors.light.primary,
    fontSize: Typography.fontSizes.md,
    fontWeight: '600',
  },
});
