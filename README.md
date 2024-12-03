# NUWellness App

## Overview
NUWellness App is a comprehensive React Native mobile application designed to enhance mental well-being through task management, mood tracking, and various wellness tools. Integrated with Firebase Firestore, the app provides CRUD (Create, Read, Update, Delete) operations for managing to-do lists and mood entries, along with advanced functionalities like notifications, camera use, and location-based features.

## Features
- Work and Life To-Do Lists: Toggle for task completion with persistent data storage.
- Mood Tracking:
  - Record moods, journal entries, photos, and locations for wellness insights.
  - Integrated reminders for daily check-ins.
- Mental Wellness Tools:
  - **Mood Tracker**: Records mood and journal entries.
  - **Challenging Negative Thoughts**: Prompts to help users manage negative thoughts.
  - **Meditation**: Provides quick meditation techniques.
  - **Self-Assessment**: Offers tools for self-assessment, such as PHQ-9 for depression and GAD-7 for anxiety.
- Notifications:
  - Added daily reminders for mood tracking and meditation.
  - Notifications configured to appear at user-defined times.
- Camera Use:
  - Fully implemented camera functionality in the Mood Tracker.
  - Allowed users to take photos and attach them to mood entries.
  - Addressed permission handling for camera use.
- Location Features:
  - Integrated location-based features in the Mood Tracker using OpenStreetMap API.
  - Users can select and mark wellness activity locations with various categories (e.g., parks, gyms).
- Authentication:
  - Enhanced the login page with Firebase Authentication.
  - Added features for secure sign-up and sign-in, including validation for password strength and error handling.
  - Integrated "Forgot Password" functionality with email-based recovery.
- External API Use:
  - OpenStreetMap API used for location features.
- Edit Entries: Users can now edit their mood tracker entries, allowing updates to journals, moods, and attached photos or locations.
- User Profile: A user profile section has been added to the Home screen, displaying user details and offering basic profile management functionality.


## Components and Structure
The app is structured with React Navigation to handle screen transitions between the main pages:
- **LoginScreen**:
  - Added "Forgot Password" feature with Firebase Authentication.
  - Enhanced user feedback for authentication errors.
- **HomeScreen**: Displays quick views for navigating to key functionalities like Work and Life To-Do lists, Mood Tracker, and other tools.
- **WorkScreen**: Manages the to-do list for work-related tasks.
- **LifeScreen**: Manages the to-do list for personal life tasks.
- **ToolsScreen**: Contains access to all the tools listed above for mental well-being.
  - **MoodTrackerScreen**: Integrated camera functionality for photo attachment. Added interactive location markers using OpenStreetMap API. Notifications to prompt daily mood tracking.
    - **Take Photo**: Direct to the camera with asking permission
    - **Edit Wellness Locations**: Direct to a local map with different kinds of markers. OpenStreetMap API used. 
  - **ChallengingNegativeThoughtsScreen**: Helps users analyze and manage their thoughts with guided questions.
  - **MeditationScreen**: Provides simple meditation exercises with a daily reminder(notification).
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
     - `photo` (object, optional): the photo taken by the user.
     - `location` (array, optional): markers on local map to display wellness activities.
   - **Operations**:
     - **Create**: Add new mood entries.
     - **Read**: Display existing mood entries.
     - **Delete**: Remove mood entries.

---

## Team Contributions
- **Weiwei Liu**: Worked on the Work and Life To-Do list components and integrated task completion toggle functionality with Firestore.
- Developed the MoodTrackerScreen and ToolsScreen, implementing CRUD operations for mood entries in Firestore.
- Developed the camera function in MoodTrackerScreen.
- Added password recovery functionality in the login screen using Firebase Authentication.
- Enhanced camera functionality for mood entries, including photo previews and permission handling.     
- Developed CRUD operations for mood entries in Firestore. 

- **Shuojun Chen**: Set up navigation structure and handled the overall app architecture, ensuring seamless integration between screens and Firebase.
- Complete the core features, error handlings, and branding for the login screen.
- Implement the notification function for mood tracker and meditation.
- Developed the map/location function for new entries in the mood tracker.
- Contributed to refining MoodTrackerScreen by integrating location features with OpenStreetMap API.
- Implemented notification reminders for mood tracking and meditation.
- Fixed navigation issues and improved user experience in the MoodTrackerScreen.


### Screenshots

#### Tools Screen
<img width="272" alt="image" src="https://github.com/user-attachments/assets/c2c27b14-cd45-4882-a8c5-67dc385a520f">


#### Work To-Do List
<img width="278" alt="image" src="https://github.com/user-attachments/assets/75f119a7-dd04-433e-b4de-0a6e03f61183">

#### Life To-Do List
<img width="280" alt="image" src="https://github.com/user-attachments/assets/a28baf14-30a9-4e82-818d-6b24a8b79de9">

#### Mood Tracker Screen
<img width="280" alt="image" src="https://github.com/Astrid-weiwei/NUWellnessApp/blob/iteration2-new/assets/MoodTrackerScreen.jpg">

#### Map and Location for Moodtracker Entry
<img width="280" alt="image" src="https://github.com/Astrid-weiwei/NUWellnessApp/blob/iteration2-new/assets/Map%20and%20Location.jpg">

#### Login Screen
<img width="291" alt="image" src="https://github.com/user-attachments/assets/e613fb72-1faf-4631-a48b-dd1993e61283">


#### Meditation Screen
<img width="280" alt="image" src="https://github.com/Astrid-weiwei/NUWellnessApp/blob/iteration2-new/assets/MeditationScreen.jpg">

