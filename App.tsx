import { StyleSheet, Text, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { TeamGenerator } from "screens/TeamGenerator";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { PlayerCreator } from "screens/PlayerCreator";
import ExploreIcon from "Icons/ExploreIcon";
import RestaurantIcon from "Icons/RestaurantIcon";
import { PlayerList } from "screens/PlayerList";
import * as IoniIcon from "react-native-vector-icons/Ionicons";
import * as AntDesignIcon from "react-native-vector-icons/AntDesign";
import * as FontAwesome from "react-native-vector-icons/FontAwesome";

import { SafeAreaProvider } from "react-native-safe-area-context";

const Stack = createNativeStackNavigator();

const Drawer = createDrawerNavigator();
const RootStack = createBottomTabNavigator();

const colorPalette = {
  primary: "#04f5ff",
  secondary: "#e90052",
  surface: "#ffffff",
  tertiary: "#00ff85",
  contrast: "#38003c",
};

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <RootStack.Navigator
          initialRouteName="ExploreStack"
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarActiveTintColor: colorPalette.contrast,
            tabBarInactiveTintColor: "gray",
            tabBarInactiveBackgroundColor: colorPalette.surface,
          })}
        >
          <RootStack.Screen
            name="Create a player"
            component={PlayerCreator}
            options={{
              tabBarIcon: ({ color, size }) => (
                <IoniIcon.default
                  name="person-add"
                  size={30}
                  color={colorPalette.contrast}
                />
              ),
              tabBarLabel: "Add Player",
            }}
          />
          <RootStack.Screen
            name="Team Generator"
            component={TeamGenerator}
            options={{
              tabBarIcon: ({ color, size }) => (
                <FontAwesome.default
                  name="group"
                  size={30}
                  color={colorPalette.contrast}
                />
              ),
              tabBarLabel: "Create Teams",
            }}
          />

          <RootStack.Screen
            name="Player List"
            component={PlayerList}
            options={{
              tabBarIcon: ({ color, size }) => (
                <FontAwesome.default
                  name="th-list"
                  color={colorPalette.contrast}
                  size={size}
                />
              ),
              tabBarLabel: "Player List",
            }}
          />
        </RootStack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}