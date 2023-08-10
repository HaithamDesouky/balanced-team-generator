import { NavigationContainer } from '@react-navigation/native';
import { TeamGenerator } from 'screens/TeamGenerator';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { PlayerCreator } from 'screens/PlayerCreator';
import { PlayerList } from 'screens/PlayerList';
import * as IoniIcon from 'react-native-vector-icons/Ionicons';
import * as FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Provider } from 'react-redux';

import { store } from 'src/state/store';
import useThemePalette from 'src/components/hooks/useThemePalette';

const RootStack = createBottomTabNavigator();

export default function App() {
    const colorPalette = useThemePalette();

    return (
        <Provider store={store}>
            <NavigationContainer>
                <RootStack.Navigator
                    initialRouteName="Player List"
                    screenOptions={() => ({
                        headerShown: false,
                        tabBarActiveTintColor: colorPalette.contrast,
                        tabBarInactiveTintColor: 'gray',
                        tabBarInactiveBackgroundColor: colorPalette.surface
                    })}
                >
                    <RootStack.Screen
                        name="Create a player"
                        component={PlayerCreator}
                        options={{
                            tabBarIcon: () => (
                                <IoniIcon.default
                                    name="person-add"
                                    size={30}
                                    color={colorPalette.contrast}
                                />
                            ),
                            tabBarLabel: 'Add Player'
                        }}
                    />
                    <RootStack.Screen
                        name="Team Generator"
                        component={TeamGenerator}
                        options={{
                            tabBarIcon: () => (
                                <FontAwesome.default
                                    name="group"
                                    size={30}
                                    color={colorPalette.contrast}
                                />
                            ),
                            tabBarLabel: 'Create Teams'
                        }}
                    />
                    <RootStack.Screen
                        name="Player List"
                        component={PlayerList}
                        options={{
                            tabBarIcon: ({ size }) => (
                                <FontAwesome.default
                                    name="th-list"
                                    color={colorPalette.contrast}
                                    size={size}
                                />
                            ),
                            tabBarLabel: 'Player List'
                        }}
                    />
                </RootStack.Navigator>
            </NavigationContainer>
        </Provider>
    );
}
