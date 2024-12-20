import { useEvent } from "expo";
import { requestBluetoothPermission, thermalib } from "thermalib-expo";
import { Button, SafeAreaView, ScrollView, Text, View } from "react-native";

export default function App() {
  const onChangePayload = useEvent(thermalib, "onChange");

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container}>
        <Text style={styles.header}>Module API Example</Text>
        {/* <Group name="Constants">
          <Text>None</Text>
        </Group>
        <Group name="Functions">
          <Text>None</Text>
        </Group> */}
        <Group name="Async functions">
          <Button
            title="Init thermalib"
            onPress={async () => {
              await thermalib.initThermalib();
            }}
          />
          <Button
            title="Start scanning"
            onPress={async () => {
              await requestBluetoothPermission();
              await thermalib.startScanning();
            }}
          />
          <Button
            title="Get devices"
            onPress={async () => {
              await requestBluetoothPermission();
              const devs = await thermalib.getDevices();
              console.log("devices", devs);
            }}
          />
        </Group>
        <Group name="Events">
          <Text>{onChangePayload?.value}</Text>
        </Group>
      </ScrollView>
    </SafeAreaView>
  );
}

function Group(props: { name: string; children: React.ReactNode }) {
  return (
    <View style={styles.group}>
      <Text style={styles.groupHeader}>{props.name}</Text>
      {props.children}
    </View>
  );
}

const styles = {
  header: {
    fontSize: 30,
    margin: 20,
  },
  groupHeader: {
    fontSize: 20,
    marginBottom: 20,
  },
  group: {
    margin: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    gap: 10,
  },
  container: {
    flex: 1,
    backgroundColor: "#eee",
  },
  view: {
    flex: 1,
    height: 200,
  },
};
