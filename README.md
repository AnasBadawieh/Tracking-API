
# Real-Time Tracking 

## Overview

This project consists of a real-time tracking application where users can be tracked on a map. The application has two major parts:

1. **Admin Panel**: A web interface that allows admins to view, manage, and track users in real-time. Admins can highlight users, delete users, and toggle the visibility of users.
2. **User Panel**: A web interface where users can opt to be tracked on the map, and their location is updated in real-time. The user can submit their information and start/stop tracking.

The system uses WebSockets to provide real-time updates to clients, allowing for dynamic interaction and communication between the server, admin, and users.

## Features

- **Admin Panel**:
  - Real-time tracking of user locations on the map.
  - Option to highlight or delete individual users.
  - Option to delete all users at once.
  - Toggle visibility of user locations.
  
- **User Panel**:
  - User can track their own location on the map in real-time.
  - Option to toggle tracking and view their current location.
  - Form to submit user information, including name, student status, and phone number.
  
## Tech Stack

- **Frontend**:
  - HTML5, CSS3, JavaScript (Leaflet.js for maps)
  - Bootstrap 5 for responsive design
  - WebSockets for real-time communication

- **Backend**:
  - Node.js with Express.js
  - WebSocket for real-time data transmission
  - A simple REST API to handle user data and bus data

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/tracker-application.git
   cd tracker-application
   ```

2. Install the required dependencies:

   ```bash
   npm install
   ```

3. Run the server:

   ```bash
   node server.js
   ```

4. The application will be available at `http://localhost:3000`.

## API Endpoints

### POST `/trackerdata/update-bus-data`
- Updates the bus data on the server.
- **Request body**: JSON object containing the bus data.

### GET `/trackerdata/bus-shared-data`
- Retrieves the bus data.

### POST `/trackerdata/delete-user-data`
- Deletes the user data for a specific user.
- **Request body**: JSON object with `userId`.

### POST `/trackerdata/delete-all-users`
- Deletes all user data from the server.

### POST `/trackerdata/update-shared-data`
- Updates the shared data for a user.
- **Request body**: JSON object with user data.

### GET `/trackerdata/shared-data`
- Retrieves the shared data for all users.

## WebSocket Events

- **on connection**: Sends initial shared data to the newly connected client.
- **on message**:
  - **type: 'stopTracking'**: Stops tracking a specific user.
  - **type: 'stopTrackingAll'**: Stops tracking all users.

## License

This project is licensed under the MIT License 

