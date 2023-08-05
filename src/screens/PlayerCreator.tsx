import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";

const PlayerCreator = () => {
  const [name, setName] = useState("");
  const [role, setRole] = useState("DEF");
  const [rating, setRating] = useState("1");

  const handleSave = () => {
    const playersJSON = localStorage.getItem("Players");

    const existingPlayers = JSON.parse(playersJSON || "[]") || [];

    // Create a new player object
    const newPlayer = { name, role, rating };

    // Add the new player to the existing array
    const updatedPlayers = [...existingPlayers, newPlayer];

    console.log({ playersJSON, updatedPlayers });

    // Update local storage with the updated array
    localStorage.setItem("Players", JSON.stringify(updatedPlayers));

    // Clear the form fields
    setName("");
    setRole("DEF");
    setRating("1");
  };

  const handleCancel = () => {
    // You can perform any cancel actions here
    setName("");
    setRole("DEF");
    setRating("1");
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter a name"
        value={name}
        onChangeText={(text) => setName(text)}
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
});

export { PlayerCreator };
