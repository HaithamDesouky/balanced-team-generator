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
import Icon from "react-native-vector-icons/Ionicons";
// import Icon as AntDesignIcon from "react-native-vector-icons/AntDesign";

const Stack = createNativeStackNavigator();

const Drawer = createDrawerNavigator();
const RootStack = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <RootStack.Navigator
        initialRouteName="ExploreStack"
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: "#e67a15",
          tabBarInactiveTintColor: "gray",
        })}
      >
        <RootStack.Screen
          name="Create a player"
          component={PlayerCreator}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="add" size={30} color="#900" />
            ),
            tabBarLabel: "Add Player",
          }}
        />
        <RootStack.Screen
          name="Team Generator"
          component={TeamGenerator}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="team" size={30} color="#900" />
            ),
            tabBarLabel: "Create Teams",
          }}
        />

        <RootStack.Screen
          name="Player List"
          component={PlayerList}
          options={{
            tabBarIcon: ({ color, size }) => (
              <RestaurantIcon color={color} size={size} />
            ),
            tabBarLabel: "Player List",
          }}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
