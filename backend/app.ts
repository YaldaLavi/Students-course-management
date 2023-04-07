/* eslint-disable import/prefer-default-export */
import express from 'express';
import cors from 'cors';
import db from './database';

export const app = express();
app.use(cors());
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/users', async (req, res) => {
  const users = await db.getAllUsers();
  res.json(users);
});
app.get('/api/topics', async (req, res) => {
  const topics = await db.getAllTopics();
  res.json(topics);
});

app.get('/api/weekendtest', async (req, res) => {
  const weekendTest = await db.getAllWeekendTest();
  res.json(weekendTest);
});

app.get('/api/students', async (req, res) => {
  const students = await db.getAllStudents();
  res.json(students);
});

app.get('/api/courses', async (req, res) => {
  const courses = await db.getAllCourses();
  res.json(courses);
});

app.get('/api/mobusers/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const mobUsers = await db.findUsersByMobId(id);
    if (!mobUsers) {
      res.status(404).json({ message: 'not found' });
    } else {
      res.json(mobUsers);
    }
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching data' });
  }
});

app.get('/api/courseusers/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const courseUsers = await db.findCoursesById(id);
    if (!courseUsers) {
      res.status(404).json({ message: 'not found' });
    } else {
      res.json(courseUsers);
    }
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching data' });
  }
});
app.put('/api/infousers/:id', async (req, res) => {
  const { id } = req.params;
  const { bio, linkedIn, gitHub } = req.body;

  try {
    const result = await db.UpdateUsersByUserId(id, bio, linkedIn, gitHub);
    if (result === null) {
      res.status(404).send('User not found');
    } else {
      res.status(200).send('User updated successfully');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});

app.get('/api/weekendtestcourse/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const test = await db.findTestByCourseId(id);
    if (!test) {
      res.status(404).json({ message: 'not found' });
    } else {
      res.json(test);
    }
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching data' });
  }
});

app.get('/api/weekendtestid/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const test = await db.findTestById(id);
    if (!test) {
      res.status(404).json({ message: 'not found' });
    } else {
      res.json(test);
    }
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching data' });
  }
});

app.get('/api/previoustests/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const tests = await db.findPreviousTestsById(id);
    if (!tests) {
      res.status(404).json({ message: 'not found'});
    } else {
      res.json(tests);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'An error occurred while fetching data' });
  }
});

app.get('/api/alluserdetails', async (req, res) => {
  const users = await db.getAllUserDetails();
  res.json(users);
});

app.get('/api/getuserbyemail/:email', async (req, res) => {
  const { email } = req.params;
  try {
    const test = await db.getUserDetailsByEmail(email);
    if (!test) {
      res.status(404).json({ message: 'not found' });
    } else {
      res.json(test);
    }
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching data' });
  }
});

app.post('/api/postfeedback', async (req, res) => {
  const data = req.body;
  const result = await db.postNewFeedback(data);
  res.json(result);
});

app.put('/api/updatefeedback/:id', async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const result = await db.updateFeedback(id, data);
  res.json(result);
});

app.delete('/api/deletefeedback/:id', async (req, res) => {
  const { id } = req.params;
  await db.deleteFeedback(id);
});

app.listen(port, () => console.log(`Running on http://localhost:${port}`));
