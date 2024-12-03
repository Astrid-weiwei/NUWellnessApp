import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';

const phq9Questions = [
  "Little interest or pleasure in doing things?",
  "Feeling down, depressed, or hopeless?",
  "Trouble falling or staying asleep, or sleeping too much?",
  "Feeling tired or having little energy?",
  "Poor appetite or overeating?",
  "Feeling bad about yourself or that you are a failure or have let yourself or your family down?",
  "Trouble concentrating on things, such as reading the newspaper or watching television?",
  "Moving or speaking so slowly that other people could have noticed? Or so fidgety or restless that you have been moving a lot more than usual?",
  "Thoughts that you would be better off dead or of hurting yourself in some way?"
];

const answerOptions = [
  { text: "Not at all", score: 0 },
  { text: "Several days", score: 1 },
  { text: "More than half the days", score: 2 },
  { text: "Nearly every day", score: 3 }
];

const PHQ9Screen = ({ navigation }) => {
  const [answers, setAnswers] = useState(new Array(phq9Questions.length).fill(null));
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (questionIndex, score) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = score;
    setAnswers(newAnswers);
    setShowResults(false); // Hide results when answers change
  };

  const calculateScore = () => {
    const total = answers.reduce((sum, score) => sum + score, 0);
    return {
      score: total,
      severity: getSeverityPHQ9(total),
      recommendation: getRecommendation(total)
    };
  };

  const getSeverityPHQ9 = (score) => {
    if (score <= 4) return "Minimal depression";
    if (score <= 9) return "Mild depression";
    if (score <= 14) return "Moderate depression";
    if (score <= 19) return "Moderately severe depression";
    return "Severe depression";
  };

  const getRecommendation = (score) => {
    if (score <= 4) return "Your symptoms suggest minimal depression. Continue monitoring your mood.";
    if (score <= 9) return "Your symptoms suggest mild depression. Consider talking to a mental health professional.";
    if (score <= 14) return "Your symptoms suggest moderate depression. It's recommended to consult with a mental health professional.";
    if (score <= 19) return "Your symptoms suggest moderately severe depression. Please seek professional help.";
    return "Your symptoms suggest severe depression. It's strongly recommended to seek immediate professional help.";
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
      <Text style={styles.header}>PHQ-9 Depression Assessment</Text>
      <Text style={styles.instructions}>
        Over the last 2 weeks, how often have you been bothered by any of the following problems?
      </Text>
      
      {phq9Questions.map((question, questionIndex) => (
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
              setAnswers(new Array(phq9Questions.length).fill(null));
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

export default PHQ9Screen;