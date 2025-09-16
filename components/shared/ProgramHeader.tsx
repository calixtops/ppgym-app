import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { createSharedHomeScreenStyles, ThemeColors } from './HomeScreenStyles';

interface ProgramHeaderProps {
  colors: ThemeColors;
  isGeorgia?: boolean;
  onSwitchProgram: () => void;
  onSwitchUser?: () => void;
}

export const ProgramHeader: React.FC<ProgramHeaderProps> = ({
  colors,
  isGeorgia = false,
  onSwitchProgram,
  onSwitchUser,
}) => {
  const styles = createSharedHomeScreenStyles(colors, isGeorgia);

  return (
    <View style={styles.header}>
      {onSwitchUser && (
        <Pressable 
          style={[styles.switchProgramButton, { marginRight: 8 }]} 
          onPress={onSwitchUser}
        >
          <Text style={styles.switchProgramButtonText}>
            Trocar Usuário
          </Text>
        </Pressable>
      )}
      <Pressable 
        style={styles.switchProgramButton} 
        onPress={onSwitchProgram}
      >
        <Text style={styles.switchProgramButtonText}>
          Trocar Programa
        </Text>
      </Pressable>
    </View>
  );
};