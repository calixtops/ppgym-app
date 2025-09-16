import { IconSymbol } from '@/components/ui/icon-symbol';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { createSharedHomeScreenStyles, PROGRAM_COLORS, ThemeColors } from './HomeScreenStyles';

interface QuickAction {
  title: string;
  description: string;
  icon: string;
  onPress: () => void;
}

interface QuickActionsSectionProps {
  colors: ThemeColors;
  isGeorgia?: boolean;
  actions: QuickAction[];
}

export const QuickActionsSection: React.FC<QuickActionsSectionProps> = ({
  colors,
  isGeorgia = false,
  actions = [], // Default para array vazio
}) => {
  const styles = createSharedHomeScreenStyles(colors, isGeorgia);
  
  // Obter a cor de accent baseada no programa
  const accentColor = isGeorgia ? PROGRAM_COLORS.GEORGIA : PROGRAM_COLORS.PEDRO;

  // Se não há actions, não renderiza o componente
  if (!actions || actions.length === 0) {
    return null;
  }

  return (
    <View style={styles.quickActionsSection}>
      <Text style={styles.sectionTitle}>Ações Rápidas</Text>
      
      <View style={styles.quickActionsGrid}>
        {actions.map((action, index) => (
          <Pressable 
            key={index} 
            style={styles.quickActionCard}
            onPress={action.onPress}
          >
            <IconSymbol 
              name={action.icon as any} 
              size={32} 
              color={accentColor}
              style={styles.quickActionIcon}
            />
            <Text style={styles.quickActionTitle}>{action.title}</Text>
            <Text style={styles.quickActionDescription}>{action.description}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
};