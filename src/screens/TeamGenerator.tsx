import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { createFairTeams } from 'src/helper/teamCreation';
import { Player } from 'src/helper/types';

const styles = StyleSheet.create({
    baseText: {
        marginBottom: 8
    },
    titleText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 10
    }
});

export const TeamGenerator = () => {
    const [players] = useState<Player[]>([]);
    const [teams, setTeams] = useState<[Player[], Player[]]>(
        createFairTeams(players)
    );

    const regenerateTeams = () => {
        setTeams(createFairTeams(players));
    };

    return (
        <View style={{ padding: 10 }}>
            <View>
                <Text style={styles.titleText}>Color</Text>
                {teams[0].map((player) => (
                    <Text style={styles.baseText} key={player.name}>
                        {player.name}
                    </Text>
                ))}
            </View>
            <View>
                <Text style={styles.titleText}>White</Text>
                {teams[1].map((player) => (
                    <Text style={styles.baseText} key={player.name}>
                        {player.name}
                    </Text>
                ))}
            </View>
            <Pressable onPress={regenerateTeams}>
                <Text>Regenerate Teams</Text>
            </Pressable>
        </View>
    );
};
