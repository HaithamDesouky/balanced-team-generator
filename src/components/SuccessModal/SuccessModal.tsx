import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import Modal from "react-native-modal";

interface SuccessModalProps {
  isVisible: boolean;
  onClose: () => void;
  onViewPlayers: () => void;
  onCreateTeams: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  isVisible,
  onClose,
  onViewPlayers,
  onCreateTeams,
}) => {
  return (
    <Modal isVisible={isVisible}>
      <View style={styles.modalContent}>
        <Text style={styles.successText}>Player saved correctly.</Text>
        <View style={styles.buttonContainer}>
          <Button title="See Players List" onPress={onViewPlayers} />
          <Button title="Create Teams" onPress={onCreateTeams} />
        </View>
        <Button title="Close" onPress={onClose} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  successText: {
    fontSize: 18,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
});

export default SuccessModal;
