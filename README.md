# NUWellnessApp

## Overview
NUWellnessApp is a React Native app that provides wellness tools, including a mood tracker, habit tracker, and task manager. It uses Firebase for data storage.

## Firebase Configuration
The app connects to Firebase to manage user data. It has three primary collections in Firestore:

### Data Model and Collections

1. **MoodEntries**
   - Stores user mood entries.
   - Fields: 
     - `mood` (string)
     - `journal` (string)
     - `date` (timestamp)
   - CRUD Operations:
     - **Create**: Adding a new mood entry.
     - **Read**: Fetching all mood entries.

2. **Tasks**
   - Manages tasks in the task manager.
   - Fields: 
     - `title` (string)
     - `completed` (boolean)
     - `date` (timestamp)
   - CRUD Operations:
     - **Create**: Adding a new task.
     - **Read**: Fetching all tasks.
     - **Update**: Marking a task as completed.
     - **Delete**: Deleting a task (not yet implemented but planned).

3. **Habits**
   - Tracks user habits.
   - Fields: 
     - `habitName` (string)
     - `isActive` (boolean)
     - `dateAdded` (timestamp)
   - CRUD Operations:
     - **Create**: Adding a new habit.
     - **Read**: Fetching all habits.
     - **Delete**: Deleting a habit.

### Screens and Components

The app consists of multiple screens, each designed to interact with the Firestore collections through the Firebase service layer:

- **Mood Tracker**: Allows users to add mood entries and view previous entries.
- **Task Manager**: Provides functionality for adding, viewing, and completing tasks.
- **Habits Tracker**: Allows users to add and view habits they’re tracking.

### Team Contributions

- **[Your Name]**: Developed the Mood Tracker screen and integrated Firestore for adding mood entries.
- **[Other Member Name]**: Created the Task Manager screen and implemented CRUD functions for task management.
- **[Other Member Name]**: Built the Habit Tracker and integrated it with Firestore.

### Screenshots
![Mood Tracker Screenshot](path-to-screenshot.png)

### Firebase Setup
To use the app, ensure you have Firebase set up with the Firestore database. See `firebaseConfig.js` for configuration details.

### Getting Started
1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Run `npx expo start` to start the app.

### Links
- [GitHub Repository](https://github.com/your-repo-link)
- [Video Walkthrough](https://your-video-link)

## License
This project is licensed under the MIT License.
