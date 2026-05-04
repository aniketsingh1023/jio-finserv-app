import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors } from "@/constants/colors";

type Props = {
  message: string;
  type: "success" | "error";
};

export default function CustomToast({ message, type }: Props) {
  return (
    <View
      style={[
        styles.container,
        type === "success" ? styles.success : styles.error,
      ]}
    >
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 60,
    left: 20,
    right: 20,
    padding: 14,
    borderRadius: 10,
    zIndex: 999,
  },
  success: {
    backgroundColor: "#27AE60",
  },
  error: {
    backgroundColor: "#FF3B30",
  },
  text: {
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
  },
});