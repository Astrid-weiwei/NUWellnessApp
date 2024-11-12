# NUWellness App

NUWellness is a wellness and productivity app for Northeastern University students. This app helps students manage their mental health, track productivity, and stay balanced.

## Features
- **Tasks**: Manage schoolwork with deadlines and reminders.
- **Safe Space**: Anonymously share and respond to posts.
- **Resources**: Access on-campus wellness facilities.

## Data Model
### Collections
1. **Users**
   - Fields: `userId`, `displayName`, `dashboardPreferences`, `profilePicture`
2. **Tasks**
   - Fields: `taskId`, `title`, `dueDate`, `completed`, `userId`
3. **Posts**
   - Fields: `postId`, `content`, `userId`, `timestamp`, `likes`

## CRUD Operations
- **Users**: Create, Read, Update (profile)
- **Tasks**: Create, Read, Update, Delete (tasks)
- **Posts**: Create, Read, Delete (posts)

## Team Contributions
- **Weiwei Liu**: Developed Tasks component with CRUD operations.
- **Shuojun Chen**: Implemented Safe Space feature with anonymous posting.

## Screenshots
![Tasks Screen](screenshot-tasks.png)
