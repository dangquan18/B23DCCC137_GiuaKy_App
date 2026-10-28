import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import TaskListScreen from '../screens/TaskListScreen';
import TaskDetailScreen from '../screens/TaskDetailScreen';
import TaskFormScreen from '../screens/TaskFormScreen';
import HeaderBackButton from '../components/HeaderBackButton';
import { colors, fontSize, fontWeight } from '../theme/colors';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const screenOptions = ({
  navigation,
}: {
  navigation: Pick<NativeStackNavigationProp<RootStackParamList>, 'goBack'>;
}): NativeStackNavigationOptions => ({
  headerStyle: { backgroundColor: colors.background },
  headerTitleAlign: 'center',
  headerTitleStyle: {
    color: colors.text,
    fontSize: fontSize.body,
    fontWeight: fontWeight.heavy,
  },
  headerShadowVisible: false,
  headerBackVisible: false,
  headerLeft: () => <HeaderBackButton onPress={navigation.goBack} />,
  contentStyle: { backgroundColor: colors.background },
});

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={screenOptions}>
        <Stack.Screen
          name="TaskList"
          component={TaskListScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="TaskDetail"
          component={TaskDetailScreen}
          options={{ title: 'Chi tiết công việc' }}
        />
        <Stack.Screen
          name="TaskForm"
          component={TaskFormScreen}
          options={({ route }) => ({
            title: route.params?.taskId ? 'Sửa công việc' : 'Thêm công việc',
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
