import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, TextInput, Button, FlatList, } from "react-native";
import React, { useState, useEffect } from "react";
import { push, ref, remove, onValue } from "firebase/database";
//Firebase configuration and db in firebase.js
import database from "./firebase";

export default function App() {
  ref(database, "items/");

  const [amount, setAmount] = useState("");
  const [product, setProduct] = useState("");
  const [item, setItems] = useState();

  //tietojen lukeminen
  useEffect(() => {
    const itemsRef = ref(database, "items/");
    onValue(itemsRef, (snapshot) => {
      console.log("onValue: ");
      const data = snapshot.val();
      console.log(data);
      const items = data ? Object.keys(data).map((key) => ({ key, ...data[key] })) : [];
      console.log(items);
      setItems(items);
    });
  }, []);

  //tietojen lisääminen
  const saveItem = () => {
    push(ref(database, "items/"), { product: product, amount: amount });
  };

//tietojen poistaminen
  const deleteItem = (key) => {
    console.log("deleteItem: ", key);
    remove(ref(database, "/items/" + key));
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Tuote"
        onChangeText={(product) => setProduct(product)}
        value={product}
      />
      <TextInput
        style={styles.input}
        placeholder="Määrä"
        onChangeText={(amount) => setAmount(amount)}
        value={amount}
      />
      <Button onPress={saveItem} title="Save" />

      <Text style={styles.listTitle}>Shopping list</Text>

      <FlatList
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => (
          <View style={styles.listcontainer}>
            <Text> {item.product}, {item.amount} </Text>
            <Text style={{ color: "#0000ff", marginLeft: 10 }} onPress={() => deleteItem(item.key)} > Delete </Text>
          </View>
        )}
        data={item}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
  },
  input: {
    height: 30,
    minWidth: 150,
    margin: 5,
    borderWidth: 1,
    borderColor: "grey",
    paddingLeft: 10,
    paddingRight: 10,
  },
  listTitle: {
    marginTop: 30,
    paddingBottom: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
  listcontainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
});
