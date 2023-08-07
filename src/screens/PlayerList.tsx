import React, { useEffect, useState } from "react";
import { Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";

export const PlayerList = () => {
  const [playerList, setPlayerList] = useState([]);

  useEffect(() => {
    const fetchPlayerList = async () => {
      try {
        const playersJSON = await AsyncStorage.getItem("Players");
        const savedPlayers = JSON.parse(playersJSON || "[]");
        setPlayerList(savedPlayers);
      } catch (error) {
        console.error("Error fetching player list:", error);
      }
    };

    fetchPlayerList();
  }, []);

  return (
    <SafeAreaView>
      <Text>Player List</Text>
      {playerList.map((player, index) => (
        <Text key={index}>{player.name}</Text>
      ))}
    </SafeAreaView>
  );
};
