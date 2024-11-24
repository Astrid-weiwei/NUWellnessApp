# NUWellness App

## Overview
This React Native app helps users manage their to-do lists for work and personal life, track their mood entries, and access tools for mental well-being. The app integrates with Firebase Firestore for data storage and provides essential CRUD (Create, Read, Update, Delete) operations to allow users to add, complete, and delete tasks, as well as track mood entries.

## Features
- Work and Life To-Do lists with toggle for task completion
- Mood tracking with journal entries
- Tools section for mental wellness:
  - **Mood Tracker**: Records mood and journal entries.
  - **Challenging Negative Thoughts**: Prompts to help users manage negative thoughts.
  - **Meditation**: Provides quick meditation techniques.
  - **Self-Assessment**: Offers tools for self-assessment, such as PHQ-9 for depression and GAD-7 for anxiety.
- Firebase Firestore integration for persistent data storage

## Components and Structure
The app is structured with React Navigation to handle screen transitions between the main pages:
- **HomeScreen**: Displays quick views for navigating to key functionalities like Work and Life To-Do lists, Mood Tracker, and other tools.
- **WorkScreen**: Manages the to-do list for work-related tasks.
- **LifeScreen**: Manages the to-do list for personal life tasks.
- **ToolsScreen**: Contains access to all the tools listed above for mental well-being.
  - **MoodTrackerScreen**: Allows users to record and view their mood entries along with a journal, a photo, and a location.
    - **Take Photo**: Direct to the camera with asking permission
    - **Edit Wellness Locations**: Direct to a local map with different kinds of markers.
  - **ChallengingNegativeThoughtsScreen**: Helps users analyze and manage their thoughts with guided questions.
  - **MeditationScreen**: Provides simple meditation exercises.
  - **SelfAssessmentScreen**: Allows users to take self-assessment questionnaires (e.g., PHQ-9, GAD-7).
  
### Navigation
The app uses two main navigators:
- **Tab Navigator** for the bottom navigation bar, containing Home, Tools, and Activities.
- **Stack Navigators** for deeper navigation within each section, enabling users to drill down into specific screens (e.g., viewing the Work and Life To-Do lists from Activities or exploring tools from ToolsScreen).

### CRUD Operations
The app integrates with Firebase Firestore to implement CRUD operations for each data collection:
1. **WorkTodos**: Supports Create, Read, Update (completion status), and Delete for work-related tasks.
2. **LifeTodos**: Supports Create, Read, Update (completion status), and Delete for personal tasks.
3. **MoodEntries**: Supports Create, Read, and Delete for mood entries with journaling， photo taken, and location marking functionalities.

---

## Data Model

### Collections in Firestore
1. **WorkTodos**
   - **Fields**:
     - `id` (string): Document ID.
     - `text` (string): Task description.
     - `completed` (boolean): Indicates if the task is completed.
   - **Operations**:
     - **Create**: Add new work tasks.
     - **Read**: Display existing tasks.
     - **Update**: Mark tasks as completed.
     - **Delete**: Remove tasks.

2. **LifeTodos**
   - **Fields**:
     - `id` (string): Document ID.
     - `text` (string): Task description.
     - `completed` (boolean): Indicates if the task is completed.
   - **Operations**:
     - **Create**: Add new life tasks.
     - **Read**: Display existing tasks.
     - **Update**: Mark tasks as completed.
     - **Delete**: Remove tasks.

3. **MoodEntries**
   - **Fields**:
     - `id` (string): Document ID.
     - `mood` (string): Mood label (e.g., "Good, "Poor").
     - `journal` (string): Journal entry text.
     - `timestamp` (datetime): Date and time of the mood entry.
   - **Operations**:
     - **Create**: Add new mood entries.
     - **Read**: Display existing mood entries.
     - **Delete**: Remove mood entries.

---

## Team Contributions
- **Weiwei Liu**: Worked on the Work and Life To-Do list components and integrated task completion toggle functionality with Firestore.
-                 Developed the MoodTrackerScreen and ToolsScreen, implementing CRUD operations for mood entries in Firestore.
-                 Developed the camera function in MoodTrackerScreen.
- **Shuojun Chen**: Set up navigation structure and handled the overall app architecture, ensuring seamless integration between screens and Firebase.
-                  Complete the core features, error handlings, and branding for the login screen.
-                  Implement the notification function for mood tracker and meditation.
-                  Developed the map/location function for new entries in the mood tracker. 

### Screenshots

#### Tools Screen
<img width="272" alt="image" src="https://github.com/user-attachments/assets/c2c27b14-cd45-4882-a8c5-67dc385a520f">


#### Work To-Do List
<img width="278" alt="image" src="https://github.com/user-attachments/assets/75f119a7-dd04-433e-b4de-0a6e03f61183">

#### Life To-Do List
<img width="280" alt="image" src="https://github.com/user-attachments/assets/a28baf14-30a9-4e82-818d-6b24a8b79de9">

