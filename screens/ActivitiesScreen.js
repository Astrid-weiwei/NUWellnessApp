// import React from 'react';
// import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

// export default function ActivitiesScreen({ navigation }) {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Activities</Text>
//       <TouchableOpacity onPress={() => navigation.navigate('Work')}>
//         <Text style={styles.item}>Work</Text>
//       </TouchableOpacity>
//       <TouchableOpacity onPress={() => navigation.navigate('Life')}>
//         <Text style={styles.item}>Life</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginVertical: 20,
//   },
//   item: {
//     fontSize: 18,
//     paddingVertical: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ddd',
//   },
// });
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function ActivitiesScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Activities</Text>
      <TouchableOpacity onPress={() => navigation.navigate('Work')}>
        <Text style={styles.item}>Work</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Life')}>
        <Text style={styles.item}>Life</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginVertical: 20 },
  item: { fontSize: 18, paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#ddd' },
});
