import { View, Text } from "react-native";
import React from "react";
import { initialPlayers } from "src/mock/mockPlayerList";

export const PlayerList = () => {
  return (
    <View>
      <Text>PlayerCreator</Text>
      {initialPlayers.map((player) => (
        <Text>{player.name}</Text>
      ))}
    </View>
  );
};
