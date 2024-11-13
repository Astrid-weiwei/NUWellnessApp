// import React from 'react';
// import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

// export default function ToolsScreen({ navigation }) {
//   return (
//     <View style={styles.container}>
//       <TouchableOpacity onPress={() => navigation.navigate('MoodTracker')}>
//         <Text style={styles.item}>Mood Tracker</Text>
//       </TouchableOpacity>
//       <TouchableOpacity onPress={() => navigation.navigate('ChallengingNegativeThoughts')}>
//         <Text style={styles.item}>Challenging Negative Thoughts</Text>
//       </TouchableOpacity>
//       <TouchableOpacity onPress={() => navigation.navigate('Meditation')}>
//         <Text style={styles.item}>Meditation</Text>
//       </TouchableOpacity>
//       <TouchableOpacity onPress={() => navigation.navigate('SelfAssessment')}>
//         <Text style={styles.item}>Self-Assessment</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20 },
//   item: { fontSize: 18, marginVertical: 15, borderBottomWidth: 1, borderBottomColor: '#ddd' },
// });
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function ToolsScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate('Mood Tracker')}>
        <Text style={styles.toolItem}>Mood Tracker</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Challenging Negative Thoughts')}>
        <Text style={styles.toolItem}>Challenging Negative Thoughts</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Meditation')}>
        <Text style={styles.toolItem}>Meditation</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Self-Assessment')}>
        <Text style={styles.toolItem}>Self-Assessment</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  toolItem: {
    fontSize: 18,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
});
