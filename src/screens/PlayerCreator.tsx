import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Alert, Text } from "react-native";
import { Picker } from "@react-native-picker/picker";

const PlayerCreator = () => {
  const [name, setName] = useState("");
  const [role, setRole] = useState("DEF");
  const [rating, setRating] = useState("1");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSave = () => {
    if (!name.trim()) {
      setErrorMessage("Please enter a name.");
      return;
    }

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
    setName(text);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter a name"
        value={name}
        onChangeText={handleNameChange}
      />
      <Picker
        style={styles.input}
        selectedValue={role}
        onValueChange={(itemValue) => setRole(itemValue)}
      >
        <Picker.Item label="DEF" value="DEF" />
        <Picker.Item label="ATT" value="ATT" />
      </Picker>
      <Picker
        style={styles.input}
        selectedValue={rating}
        onValueChange={(itemValue) => setRating(itemValue)}
      >
        {Array.from({ length: 10 }, (_, index) => (
          <Picker.Item
            key={index}
            label={String(index + 1)}
            value={String(index + 1)}
          />
        ))}
      </Picker>
      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
      <View style={styles.buttonContainer}>
        <Button title="Save" onPress={handleSave} />
        <Button title="Cancel" onPress={handleCancel} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  input: {
    marginBottom: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "gray",
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
});

export { PlayerCreator };
