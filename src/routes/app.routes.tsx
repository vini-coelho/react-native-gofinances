import React from 'react';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from 'styled-components';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Dashboard } from '../screens/Dashboard';
import { Register } from '../screens/Register';
import { Summary } from '../screens/Summary';

const { Navigator, Screen } = createBottomTabNavigator();

export function AppRoutes() {
  const theme = useTheme();

  return (
    <Navigator
      tabBarOptions={{
        activeTintColor: theme.colors.secondary,
        inactiveTintColor: theme.colors.text,
        labelPosition: 'beside-icon',
        style: {
          paddingVertical: Platform.OS === 'ios' ? 20 : 0,
          height: 88
        },
        labelStyle: {
          fontFamily: theme.fonts.medium,
          fontSize: RFValue(12)
        },
      }}
    >
      <Screen
        name='Listagem'
        component={Dashboard}
        options={{
          tabBarIcon: (({ size, color }) => (
            <MaterialIcons
              name='format-list-bulleted'
              size={size}
              color={color}
            />
          ))
        }}
      />
      <Screen
        name='Cadastrar'
        component={Register}
        options={{
          tabBarIcon: (({ size, color }) => (
            <Feather
              name='dollar-sign'
              size={size}
              color={color}
            />
          ))
        }}
      />
      <Screen
        name='Resumo'
        component={Summary}
        options={{
          tabBarIcon: (({ size, color }) => (
            <Feather
              name='pie-chart'
              size={size}
              color={color}
            />
          ))
        }}
      />
    </Navigator>
  );
}
