import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Image, StyleSheet, View } from 'react-native';
import { ALBUM } from '../data/tracks';

interface VinylRecordProps {
  isPlaying: boolean;
  size?: number;
}

export default function VinylRecord({ isPlaying, size = 240 }: VinylRecordProps) {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pausedFraction = useRef(0); // 0.0–1.0, position within one rotation
  const loopRef = useRef<Animated.CompositeAnimation | null>(null);

  // Track the current animation value so we know where to resume
  useEffect(() => {
    const id = rotateAnim.addListener(({ value }) => {
      pausedFraction.current = value % 1;
    });
    return () => rotateAnim.removeListener(id);
  }, []);

  useEffect(() => {
    if (isPlaying) {
      loopRef.current?.stop();
      const frac = pausedFraction.current;
      rotateAnim.setValue(frac);

      // First: finish the current rotation at correct speed, then loop
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: Math.max(50, (1 - frac) * 8000),
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (!finished) return;
        rotateAnim.setValue(0);
        loopRef.current = Animated.loop(
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 8000,
            easing: Easing.linear,
            useNativeDriver: true,
          })
        );
        loopRef.current.start();
      });
    } else {
      loopRef.current?.stop();
      rotateAnim.stopAnimation((val) => {
        pausedFraction.current = val % 1;
      });
    }
  }, [isPlaying]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const artSize = size * 0.42;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Animated.View
        style={[
          styles.vinyl,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            transform: [{ rotate: spin }],
          },
        ]}
      >
        {/* Vinyl grooves */}
        <View style={[styles.ring, { width: size * 0.95, height: size * 0.95, borderRadius: size * 0.475 }]} />
        <View style={[styles.ring, { width: size * 0.82, height: size * 0.82, borderRadius: size * 0.41 }]} />
        <View style={[styles.ring, { width: size * 0.70, height: size * 0.70, borderRadius: size * 0.35 }]} />
        <View style={[styles.ring, { width: size * 0.60, height: size * 0.60, borderRadius: size * 0.30 }]} />

        {/* Center art */}
        <View
          style={[
            styles.artCircle,
            {
              width: artSize,
              height: artSize,
              borderRadius: artSize / 2,
              overflow: 'hidden',
            },
          ]}
        >
          <Image
            source={ALBUM.artwork}
            style={{ width: artSize, height: artSize }}
            resizeMode="cover"
          />
        </View>

        {/* Center hole */}
        <View
          style={[
            styles.hole,
            {
              width: size * 0.06,
              height: size * 0.06,
              borderRadius: size * 0.03,
            },
          ]}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  vinyl: {
    backgroundColor: '#1A1A1A',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 12,
  },
  ring: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: '#333333',
  },
  artCircle: {
    position: 'absolute',
    backgroundColor: '#111',
  },
  hole: {
    position: 'absolute',
    backgroundColor: '#0A0A0A',
    zIndex: 10,
  },
});
