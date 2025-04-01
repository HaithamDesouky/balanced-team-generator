import React, { useState } from 'react';
import {
    Text,
    TextInput,
    TouchableOpacity,
    View,
    StyleSheet
} from 'react-native';

const EditableText = ({ defaultColor }: { defaultColor: string }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [color, setColor] = useState(defaultColor);

    const handlePress = () => {
        setIsEditing(true);
    };

    const handleChange = (text: React.SetStateAction<string>) => {
        setColor(text);
    };

    const handleBlur = () => {
        setIsEditing(false);
    };

    return (
        <View style={styles().container}>
            <TouchableOpacity onPress={handlePress}>
                {!isEditing ? (
                    <Text style={styles().titleText}>{color}:</Text>
                ) : (
                    <TextInput
                        style={styles().input}
                        value={color}
                        onChangeText={handleChange}
                        onBlur={handleBlur}
                        autoFocus
                    />
                )}
            </TouchableOpacity>
        </View>
    );
};

const styles = () =>
    StyleSheet.create({
        container: {
            flexDirection: 'row',
            alignItems: 'center'
        },
        titleText: {
            fontSize: 18,
            fontWeight: 'bold'
        },
        input: {
            fontSize: 18,
            color: 'black',
            borderBottomWidth: 1,
            borderColor: 'gray',
            width: 100
        }
    });

export default EditableText;
