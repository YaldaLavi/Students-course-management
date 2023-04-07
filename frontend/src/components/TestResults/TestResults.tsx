import React from 'react';
import './TestResults.scss';
import { Box, Button, CardContent, Link, Modal, Paper, styled, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { useState, useEffect } from 'react';
import PrimarySearchAppBar from "../NavBar/NavBar";
import axios from 'axios';

type UserData = {
  id: number,
  email: string,
  first_name: string,
  last_name:string,
  Role:string,
  mob_id:number,
  course_id:number,
};

type TestData = {
  id: number,
  name: string,
  repo_name: string,
  repo_url: string,
  ongoing: boolean
}

type PreviousTestsData = {
  id: number,
  name: string,
  user_id: number,
  test_id: number,
  feedback: string,
  result: string
}

const TestResults = () => {
  const [open, setOpen] = React.useState(false);
  const [modalName, setModalName] = useState('');
  const [modalFeedback, setModalFeedback] = useState('');
  const handleOpen = (name: string, feedback: string) => {
    setOpen(true)
    setModalName(name);
    setModalFeedback(feedback);
  };
  const handleClose = () => setOpen(false);
  const [courseNumber, setCourseNumber] = useState('');
  const [user, setUser] = useState('');
  const [feedback, setFeedback] = useState([]);
  const [currentTestName, setCurrentTestName] = useState('');
  const [currentTestRepoName, setCurrentTestRepoName] = useState('');
  const [currentTestUrl, setCurrentTestUrl] = useState('');

  useEffect(() => {
    const getUserData = async () => {
      axios.get('http://localhost:8080/api/users')
        .then((data) => {
          const user = data.data.filter((user: UserData) => {
            return user.email === localStorage.getItem('email');
          });
          setCourseNumber(user[0].course_id);
          setUser(user[0].id);
        })
    }
    getUserData();
  }, []);

  useEffect(() => {
    const getCurrentTest = async () => {
      if (courseNumber !== '') {
        axios.get(`http://localhost:8080/api/weekendtestcourse/${courseNumber}`)
          .then(data => {
            data.data.map((test: TestData) => {
              if (test.ongoing) {
                setCurrentTestName(test.name);
                setCurrentTestRepoName(test.repo_name);
                setCurrentTestUrl(test.repo_url);
              }
              return `${test.name} / ${test.repo_name}`;
            });
          });
      }
    };

    getCurrentTest();
  }, [courseNumber, currentTestName])

  useEffect(() => {
    const getPreviousTests = async () => {
      if (user !== '') {
        const response = await fetch(`http://localhost:8080/api/previoustests/${user}`)
        const data = await response.json();
        setFeedback(data);
      }
    };
    getPreviousTests();
  }, [user]);

  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  let danger = 0;
  for (let i = 0; i < feedback.length; i++) {
    if (i >= 1 && (feedback[i-1] as { result: string }).result === 'red' && (feedback[i] as { result: string }).result === 'red') {
        danger = 2;
    }

    if (danger > 0 && (feedback[i] as { result: string }).result === 'green') {
      danger--;
    }
  }

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    minHeight: '250px'
  }));

  const PreviousTestButton = styled(Button)({
    color: 'rgb(255, 121, 97)',
  });

  return (
    <>
    <PrimarySearchAppBar/>
    <div className='weekendTest'>

    <Grid container spacing={2}>
      <Grid xs={6}>
        <Item>
          <CardContent>
            <Typography variant="h5" component="div">
              Current test
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              Current test for the weekend
            </Typography>
            <hr />
            <br />
            <Typography variant="h5">
              {currentTestName} / {currentTestRepoName}
            </Typography>
            <br />
            <Link href={currentTestUrl}>
              {currentTestUrl}
            </Link>
          </CardContent>
        </Item>
      </Grid>

      <Grid xs={6}>
        <Item>
        <CardContent>
          <Typography variant="h5" component="div">
            Progress
          </Typography>

          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            Weekend results per week
          </Typography>
          <div className='progressDiv'>
            {feedback.map((item: PreviousTestsData) => (
              <div className={'resultCircle ' + item.result}></div>
            ))}
          </div>
          
          <br />
          <hr />
          <br />
          <div>
            {danger === 2
            ? 
              <div>
                <Typography>Warning! You have 2 reds in a row</Typography>
                <Button size='small'>What does this mean?</Button>
              </div>
            :
              <div>
                <Typography>You'e doing great</Typography>
                <Typography>Keep it up!</Typography>
              </div>
            }
            </div>
          </CardContent>
        </Item>
      </Grid>

      <Grid xs={12}>
        <Item>
          <CardContent>
            <Typography variant="h5" component="div">
              Previous Tests
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              All previous weekend tests with feedback
            </Typography>
            <hr />
            <br />
              <Grid container spacing={2}>
                {feedback && feedback.map((item: PreviousTestsData) => (
                  <Grid xs={3}>
                    <div className='test'>
                      <PreviousTestButton onClick={() => handleOpen(item.name, item.feedback)} className={item.result + 'Text'}>{item.name}</PreviousTestButton>
                      {/* {item.result === 'green' ?
                        <CheckIcon></CheckIcon>
                      : <CloseIcon></CloseIcon>
                      } */}
                    </div>
                  </Grid>
                ))}

                  <Modal
                      open={open}
                      onClose={handleClose}
                      aria-labelledby="modal-modal-title"
                      aria-describedby="modal-modal-description"
                    >
                      <Box sx={style}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                          {modalName}
                        </Typography>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }} style={{ wordWrap: "break-word" }}>
                          {modalFeedback}
                        </Typography>
                      </Box>
                    </Modal>
              </Grid>
          </CardContent>
        </Item>
      </Grid>
    </Grid>
    </div>
  </>
  );
};

export default TestResults;