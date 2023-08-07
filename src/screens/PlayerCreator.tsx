import React, { useState, useEffect, useRef } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Text,
  Keyboard,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import SuccessModal from "src/components/SuccessModal/SuccessModal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform, StatusBar, TouchableWithoutFeedback } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PlayerCreator = ({ navigation }: any) => {
  const [name, setName] = useState("");
  const [role, setRole] = useState("DEF");
  const [rating, setRating] = useState("1");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [textFocused, setTextFocused] = useState(false);

  const localInputRef = useRef<TextInput>();

  const keyboardDidHideCallback = () => {
    localInputRef?.current?.blur?.();
  };

  useEffect(() => {
    const keyboardDidHideSubscription = Keyboard.addListener(
      "keyboardDidHide",
      keyboardDidHideCallback
    );

    return () => {
      keyboardDidHideSubscription?.remove();
    };
  }, []);

  const handleSave = async () => {
    if (!name.trim()) {
      setErrorMessage("Please enter a name.");
      return;
    }

    /*     if (Platform.OS === "web") {
      const playersJSON = localStorage.getItem("Players");
      const existingPlayers = JSON.parse(playersJSON || "[]") || [];
      console.log({ existingPlayers });
      // Check if a player with the same name already exists
      if (existingPlayers.some((player) => player.name === name)) {
        console.log("im here");
        setErrorMessage("Player already exists.");
        return;
      }
      // Create a new player object
      const newPlayer = { name, role, rating };
      // Add the new player to the existing array
      const updatedPlayers = [...existingPlayers, newPlayer];
      // Update local storage with the updated array
      localStorage.setItem("Players", JSON.stringify(updatedPlayers));
    } else { */
    try {
      const playersJSON = await AsyncStorage.getItem("Players");
      const existingPlayers = JSON.parse(playersJSON || "[]") || [];

      // Check if a player with the same name already exists
      if (existingPlayers.some((player) => player.name === name)) {
        setErrorMessage("Player already exists.");
        return;
      }

      // Create a new player object
      const newPlayer = { name, role, rating };

      // Add the new player to the existing array
      const updatedPlayers = [...existingPlayers, newPlayer];

      // Update AsyncStorage with the updated array
      await AsyncStorage.setItem("Players", JSON.stringify(updatedPlayers));

      // Clear the form fields
      setName("");
      setRole("DEF");
      setRating("1");
      setErrorMessage("");
      setSuccessMessage(`${name} has been added to the list`);
    } catch (error) {
      console.error("Error saving player:", error);
    }
    /*  } */

    // Clear the form fields
    setName("");
    setRole("DEF");
    setRating("1");
    setErrorMessage("");
  };

  const handleCancel = () => {
    // You can perform any cancel actions here
    setName("");
    setRole("DEF");
    setRating("1");
  };
  const handleNameChange = (text) => {
    // Clear the error message when the user starts typing
    setErrorMessage("");
    setErrorMessage("");
    setName(text);
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.container}>
        <View>
          <Text>Name</Text>
          <TextInput
            ref={(ref) => {
              localInputRef && (localInputRef.current = ref as any);
            }}
            style={{
              ...styles.input,
              borderColor: textFocused ? "red" : "blue",
            }}
            placeholder="Enter a name"
            value={name}
            onFocus={() => setTextFocused(true)}
            onBlur={() => setTextFocused(false)}
            onChangeText={handleNameChange}
            onEndEditing={() => setTextFocused(false)}
          />
          <TouchableWithoutFeedback
            onPress={() => {
              setTextFocused(false);
              localInputRef?.current?.blur();
            }}
          >
            <>
              {textFocused && <Text>FOCUS</Text>}
              <Text>Position</Text>
              <Picker
                style={styles.input}
                selectedValue={role}
                onFocus={() => {
                  setTextFocused(false);
                  localInputRef?.current?.blur();
                }}
                onValueChange={(itemValue) => setRole(itemValue)}
              >
                <Picker.Item label="DEF" value="DEF" />
                <Picker.Item label="ATT" value="ATT" />
              </Picker>
              <Text>{"Level (from 1-10)"}</Text>
              <Picker
                style={styles.input}
                selectedValue={rating}
                onValueChange={(itemValue) => setRating(itemValue)}
                onFocus={() => {
                  setTextFocused(false);
                  localInputRef?.current?.blur();
                }}
              >
                {Array.from({ length: 10 }, (_, index) => (
                  <Picker.Item
                    key={index}
                    label={String(index + 1)}
                    value={String(index + 1)}
                  />
                ))}
              </Picker>
            </>
          </TouchableWithoutFeedback>
        </View>
        {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
        {successMessage && (
          <Text style={styles.successMessage}>{successMessage}</Text>
        )}

        <View style={styles.buttonContainer}>
          <Button title="Save" onPress={handleSave} />
          <Button title="Cancel" onPress={handleCancel} />
        </View>
        {/*      <SuccessModal
          isVisible={isSuccessModalVisible}
          onClose={closeSuccessModal}
          onViewPlayers={navigateToPlayersList}
          onCreateTeams={navigateToCreateTeams}
        /> */}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    height: "100%",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    // paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    height: "100%",
    paddingHorizontal: 10,
  },
  input: {
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    marginBottom: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: 4,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  successMessage: {
    color: "green",
    marginBottom: 10,
  },
});

export { PlayerCreator };
