# Salt Student Overview- Students Course Managemen
https://user-images.githubusercontent.com/90472067/231740751-8af21907-34e9-47bc-83d1-51d72ac427eb.mp4


<br>
Salt Student Overview is a web application that shows the current progress of the logged in Salt Student. It for example displays the current test progress, showing the amount of reds and greens the students has received and the feedback for each individual test. Another feature would be a page that shows all the lectures by date so that it is easier for the students to look up the lectures. A third feature could be adding the google calendar of the specific user, and highlight their planning of the day.

## Functionality
- User Registration and Authentication: Users and instructors can register using their Google account.
- Add and delete events in Google calendar
- Add and change test results for each student
## Features
- **Calender:** Students can add and view events on their Google calendar, and see all events of every day and every week.
- **Test Results:** Students can see the results of tests and feedback, while instructors can add test results and their feedback.
- **Lecture PDFs:** Students can view PDFs of lectures, and instructors can add lecture material.

## Tech Stack
- **React:** React is a JavaScript library used for building user interfaces. We used React to develop the frontend of the application.
- **Node.js:** Node.js is a cross-platform, open-source server environment that can run on Windows, Linux, Unix, macOS, and more. Node.js is a back-end JavaScript runtime environment, runs on the V8 JavaScript Engine, and executes JavaScript code outside a web browser
- **Express:** Express.js, or simply Express, is a back end web application framework for building RESTful APIs with Node.js, released as free and open-source software under the MIT License. 
- **PostgresSQL:** PostgreSQL, also known as Postgres, is a free and open-source relational database management system emphasizing extensibility and SQL compliance.

## External APIs
- **Google Calendar API.:** I used the Google Calendar API for the event calender .

### How to Run the Application
1. Clone the repository.
2. Run **'npm install'** in the Client directory to install the frontend dependencies.
3. Run **'npm install'** in the Server directory to install the backend dependencies.
4. Run **'npm run dev** in the Server directory o start the backend server.
5. Run **'npm start'** in the Client directory to start the frontend server.
6. Open **'http://localhost:3000'** in your browser to access the application.

### License
This project is licensed under the MIT License.




