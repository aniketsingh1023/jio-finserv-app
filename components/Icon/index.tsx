import React from 'react';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  style?: any;
}

/**
 * Custom Icon Component using Expo Vector Icons
 * Provides consistent SVG icons throughout the app
 */
export const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  color = Colors.primary,
  style,
}) => {
  // Map icon names to specific icon sets
  switch (name) {
    // Tab icons
    case 'home':
      return <Ionicons name="home-sharp" size={size} color={color} style={style} />;
    case 'info':
      return <Ionicons name="information-circle" size={size} color={color} style={style} />;
    case 'calculator':
      return <MaterialIcons name="calculate" size={size} color={color} style={style} />;
    case 'phone':
      return <Ionicons name="call" size={size} color={color} style={style} />;
    case 'profile':
      return <Ionicons name="person" size={size} color={color} style={style} />;

    // Loan icons
    case 'personal-loan':
      return <MaterialIcons name="person" size={size} color={color} style={style} />;
    case 'home-loan':
      return <MaterialIcons name="home" size={size} color={color} style={style} />;
    case 'auto-loan':
      return <MaterialIcons name="directions-car" size={size} color={color} style={style} />;
    case 'business-loan':
      return <MaterialIcons name="business" size={size} color={color} style={style} />;
    case 'education-loan':
      return <MaterialIcons name="school" size={size} color={color} style={style} />;
    case 'credit-card':
      return <MaterialIcons name="credit-card" size={size} color={color} style={style} />;

    // Feature icons
    case 'speed':
      return <Feather name="zap" size={size} color={color} style={style} />;
    case 'money':
      return <MaterialIcons name="attach-money" size={size} color={color} style={style} />;
    case 'security':
      return <Feather name="lock" size={size} color={color} style={style} />;
    case 'support':
      return <Feather name="headphones" size={size} color={color} style={style} />;
    case 'leaf':
      return <Feather name="leaf" size={size} color={color} style={style} />;

    // Action icons
    case 'arrow-right':
      return <Feather name="arrow-right" size={size} color={color} style={style} />;
    case 'chevron-down':
      return <Feather name="chevron-down" size={size} color={color} style={style} />;
    case 'menu':
      return <Feather name="menu" size={size} color={color} style={style} />;
    case 'search':
      return <Feather name="search" size={size} color={color} style={style} />;
    case 'eye':
      return <Feather name="eye" size={size} color={color} style={style} />;
    case 'eye-off':
      return <Feather name="eye-off" size={size} color={color} style={style} />;
    case 'check':
      return <Feather name="check" size={size} color={color} style={style} />;
    case 'x':
      return <Feather name="x" size={size} color={color} style={style} />;
    case 'star':
      return <Feather name="star" size={size} color={color} style={style} />;
    case 'phone-call':
      return <Feather name="phone-call" size={size} color={color} style={style} />;
    case 'mail':
      return <Feather name="mail" size={size} color={color} style={style} />;
    case 'map-pin':
      return <Feather name="map-pin" size={size} color={color} style={style} />;

    // Other icons
    case 'settings':
      return <Feather name="settings" size={size} color={color} style={style} />;
    case 'download':
      return <Feather name="download" size={size} color={color} style={style} />;
    case 'log-out':
      return <Feather name="log-out" size={size} color={color} style={style} />;

    default:
      return <Ionicons name="help" size={size} color={color} style={style} />;
  }
};

export default Icon;
