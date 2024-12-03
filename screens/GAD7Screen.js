import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';

const gad7Questions = [
  "Feeling nervous, anxious, or on edge?",
  "Not being able to stop or control worrying?",
  "Worrying too much about different things?",
  "Trouble relaxing?",
  "Being so restless that it's hard to sit still?",
  "Becoming easily annoyed or irritable?",
  "Feeling afraid as if something awful might happen?"
];

const answerOptions = [
  { text: "Not at all", score: 0 },
  { text: "Several days", score: 1 },
  { text: "More than half the days", score: 2 },
  { text: "Nearly every day", score: 3 }
];

const GAD7Screen = ({ navigation }) => {
  const [answers, setAnswers] = useState(new Array(gad7Questions.length).fill(null));
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (questionIndex, score) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = score;
    setAnswers(newAnswers);
    setShowResults(false);
  };

  const calculateScore = () => {
    const total = answers.reduce((sum, score) => sum + score, 0);
    return {
      score: total,
      severity: getSeverityGAD7(total),
      recommendation: getRecommendation(total)
    };
  };

  const getSeverityGAD7 = (score) => {
    if (score <= 4) return "Minimal anxiety";
    if (score <= 9) return "Mild anxiety";
    if (score <= 14) return "Moderate anxiety";
    return "Severe anxiety";
  };

  const getRecommendation = (score) => {
    if (score <= 4) return "Your symptoms suggest minimal anxiety. Continue monitoring your anxiety levels.";
    if (score <= 9) return "Your symptoms suggest mild anxiety. Consider talking to a mental health professional.";
    if (score <= 14) return "Your symptoms suggest moderate anxiety. It's recommended to consult with a mental health professional.";
    return "Your symptoms suggest severe anxiety. It's strongly recommended to seek professional help.";
  };

  const handleSubmit = () => {
    if (answers.includes(null)) {
      Alert.alert(
        "Incomplete Assessment",
        "Please answer all questions to get your results.",
        [{ text: "OK" }]
      );
      return;
    }
    setShowResults(true);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>GAD-7 Anxiety Assessment</Text>
      <Text style={styles.instructions}>
        Over the last 2 weeks, how often have you been bothered by any of the following problems?
      </Text>
      
      {gad7Questions.map((question, questionIndex) => (
        <View key={questionIndex} style={styles.questionContainer}>
          <Text style={styles.question}>{`${questionIndex + 1}. ${question}`}</Text>
          <View style={styles.optionsContainer}>
            {answerOptions.map((option, optionIndex) => (
              <TouchableOpacity
                key={optionIndex}
                style={[
                  styles.optionButton,
                  answers[questionIndex] === option.score && styles.selectedOption
                ]}
                onPress={() => handleAnswer(questionIndex, option.score)}
              >
                <Text style={[
                  styles.optionText,
                  answers[questionIndex] === option.score && styles.selectedOptionText
                ]}>
                  {option.text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}

      {!showResults && (
        <TouchableOpacity 
          style={[
            styles.submitButton,
            answers.includes(null) && styles.submitButtonDisabled
          ]}
          onPress={handleSubmit}
        >
          <Text style={styles.submitButtonText}>Get Results</Text>
        </TouchableOpacity>
      )}

      {showResults && (
        <View style={styles.resultsContainer}>
          <Text style={styles.resultHeader}>Your Assessment Results</Text>
          <Text style={styles.scoreText}>
            Total Score: {calculateScore().score}
          </Text>
          <Text style={styles.severityText}>
            Severity Level: {calculateScore().severity}
          </Text>
          <Text style={styles.recommendationText}>
            {calculateScore().recommendation}
          </Text>
          <TouchableOpacity 
            style={styles.retakeButton}
            onPress={() => {
              setAnswers(new Array(gad7Questions.length).fill(null));
              setShowResults(false);
            }}
          >
            <Text style={styles.retakeButtonText}>Retake Assessment</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  instructions: {
    fontSize: 16,
    marginBottom: 20,
    color: '#666',
    textAlign: 'center',
  },
  questionContainer: {
    marginBottom: 20,
  },
  question: {
    fontSize: 16,
    marginBottom: 10,
  },
  optionsContainer: {
    flexDirection: 'column',
  },
  optionButton: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginVertical: 4,
    backgroundColor: '#fff',
  },
  selectedOption: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  selectedOptionText: {
    color: '#fff',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    marginVertical: 20,
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultsContainer: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 10,
    marginVertical: 20,
  },
  resultHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  scoreText: {
    fontSize: 18,
    marginBottom: 10,
  },
  severityText: {
    fontSize: 18,
    marginBottom: 10,
    color: '#007AFF',
  },
  recommendationText: {
    fontSize: 16,
    marginTop: 10,
    color: '#666',
    lineHeight: 22,
  },
  retakeButton: {
    backgroundColor: '#6c757d',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  retakeButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default GAD7Screen;