/* eslint-disable no-lone-blocks */
import React, { useState, useEffect } from 'react'
import './WelcomePage.scss'
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import PrimarySearchAppBar from "../NavBar/NavBar";
import Footer from '../Footer/Footer';
import { useSession } from '@supabase/auth-helpers-react';
import DateTimePicker from 'react-datetime-picker';
import dayjs from 'dayjs';
import { styled, TextField, Button } from "@mui/material";
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const StyledBox = styled(Box)({
  margin: '20px 24px 40px 24px',
});

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#f8f8f8',
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  transition: '0.2s ease-in-out',
  border: 'solid 1px transparent',
  boxShadow: '0px 2px 1px -1px rgba(255,121,97), 0px 1px 1px 0px rgba(255,121,97), 0px 1px 3px 0px rgba(255,121,97)',
  '@media (min-width: 900px)': {
    '&:hover': {
      boxShadow: '0px 2px 3px 1px rgba(255,121,97), 0px 1px 3px 2px rgba(255,121,97), 0px 1px 5px 2px rgba(255,121,97)',
      color: theme.palette.text.primary,
      backgroundColor: 'white',
      transform: 'scale(1.01)'
    },
  },
  '&.item-clicked': {
    boxShadow: '0px 2px 3px 2px rgba(255,121,97), 0px 1px 3px 3px rgba(255,121,97), 0px 1px 5px 3px rgba(255,121,97)',
    color: theme.palette.text.primary,
    backgroundColor: 'white',
    transform: 'scale(1.01)'
  },
}));

const CssTextField = styled(TextField) ({
  '& label.Mui-focused': {
    color: "black",
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: "#ff7961",
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: "black",
    },
    '&.Mui-focused fieldset': {
      borderColor: "#ff7961",
    },
  },
});

const LoginButton = styled(Button) ({
  "&.MuiButton-root": {
    backgroundColor: "#ff7961"
  },
  "&.MuiButton-text": {
    color: "white"
  },
});

interface gapiType {
  summary: string,
  date: string,
  id: string,
  startTime: string,
  endTime: string
}

type UserData = {
  id: number,
  email: string,
  first_name: string,
  last_name:string,
  Role:string,
  mob_id:number,
  course_id:number,
};

type PreviousTestsData = {
  id: number,
  name: string,
  user_id: number,
  test_id: number,
  feedback: string,
  result: string
}

function WelcomePage() {
  const [testClicked, setTestClicked] = useState(false);
  const [WDClicked, setWDClicked] = useState(false);
  const [topicClicked, setTopicClicked] = useState(false);
  const [HLClicked, setHLClicked] = useState(false);
  const [calendarClicked, setCalendarClicked] = useState(false);
  const [eventsClicked, setEventsClicked] = useState(false);

  const [start, setStart] = useState(new Date());
  const [end, setEnd] = useState(new Date());
  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [weeksEvents, setWeeksEvents] = useState<gapiType[]>();
  const [dayEvents, setDayEvents] = useState<gapiType[]>();
  const [reFetchCalendar, setReFetchCalendar] = useState(false);

  const [user, setUser] = useState('');
  const [feedback, setFeedback] = useState<any[]>([]);
  const [topics, setTopics] = useState([]);

  const [loading, setLoading] = useState('loading');

  const session = useSession();
  const profilePicture = session?.user.user_metadata.picture;
  const email = session?.user.email;
  {email && localStorage.setItem('email', email)};
  {profilePicture && localStorage.setItem('picture', profilePicture)};

  function capitalizeFirstLetter(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  useEffect(() => {
    if (localStorage.length !== 0){
      axios.get('http://localhost:8080/api/users')
        .then(data => {
          const filteredData = data.data.filter((item: UserData) => {
            return item.email === localStorage.getItem('email');
          })
          setUser(filteredData[0].id)
          localStorage.setItem('role', filteredData[0].Role);
          return filteredData;
        }).then((user: UserData[]) => {
          if (user[0].Role === 's') {
            setLoading('done');
          } else {
            window.location.href = '/instructor';
          }
        })
    } 
  }, [session])

  async function createCalendarEvent() {
    const event = {
      'summary': eventName,
      'description': eventDescription,
      'start': {
        'dateTime': start.toISOString(),
        'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      'end': {
        'dateTime': end.toISOString(),
        'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone
      },
    };
    await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
      method: "POST",
      headers: {
        'Authorization':'Bearer ' + session?.provider_token,
      },
      body: JSON.stringify(event)
    });
    setReFetchCalendar(!reFetchCalendar);
    toast.success('Event has been added!');
  }

  async function deleteEvent(id: string) {
    await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${id}`, {
      method: "DELETE",
      headers: {
        'Authorization':'Bearer ' + session?.provider_token
      },
    });
    setReFetchCalendar(!reFetchCalendar);
    toast.warning('Event deleted!')
  }

  useEffect(() => {
    async function getCalendarEventWeek() {
      if (session?.provider_token) {
        const startOfWeek = dayjs().startOf('week').add(1, 'day');
        const endOfWeek = dayjs().endOf('week').add(1, 'day');
        const params = new URLSearchParams({
          "timeMin": startOfWeek.toISOString(),
          "timeMax": endOfWeek.toISOString(),
          "singleEvents": true.toString(),
          "orderBy": 'startTime',
        });
        await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events?${params}`, {
          method: "GET",
          headers: {
            'Authorization':'Bearer ' + session?.provider_token
          }
        }).then((data) => {
          return data.json();
        }).then((data) => {
          const weeksEvents: gapiType[] = data.items.map((item: any) => {
            return {
              summary: item.summary,
              date: item.start.dateTime,
              id: item.id,
              startTime: item.start.dateTime,
              endTime: item.end.dateTime,
            };
          });
          setWeeksEvents(weeksEvents);
        });
      }
    }
    getCalendarEventWeek()
  }, [session?.provider_token, reFetchCalendar]);

  useEffect(() => {
    async function getCalendarEventDay() {
      if (session?.provider_token) {
        const startOfDay = dayjs().startOf('day');
        const endOfDay = dayjs().endOf('day');
        const params = new URLSearchParams({
          "timeMin": startOfDay.toISOString(),
          "timeMax": endOfDay.toISOString(),
          "singleEvents": true.toString(),
          "orderBy": 'startTime',
        });
        await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events?${params}`, {
          method: "GET",
          headers: {
            'Authorization':'Bearer ' + session?.provider_token
          }
        }).then((data) => {
          return data.json();
        }).then((data) => {
          const dayEvents: gapiType[] = data.items.map((item: any) => {
            return {
              summary: item.summary,
              date: item.start.dateTime,
              id: item.id,
              startTime: item.start.dateTime,
              endTime: item.end.dateTime,
            };
          });
          setDayEvents(dayEvents);
        });
      }
    }
    getCalendarEventDay()
  }, [session?.provider_token, reFetchCalendar]);

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

  const morningEvents: gapiType[] = [];
  const afternoonEvents: gapiType[] = [];
  const eveningEvents: gapiType[] = [];

  const MORNING_START = 6;
  const AFTERNOON_START = 12;
  const EVENING_START = 18;
 
  {dayEvents &&
    dayEvents.forEach((event) => {
      const startTime = new Date(event.startTime).getHours();
      if (startTime >= MORNING_START && startTime < AFTERNOON_START) {
        morningEvents.push(event);
      } else if (startTime >= AFTERNOON_START && startTime < EVENING_START) {
        afternoonEvents.push(event);
      } else {
        eveningEvents.push(event);
      }
    });
  }

  const startWeek = dayjs('2023-01-09').isoWeek();
  const currentWeek = dayjs().isoWeek();
  const weekNumber = currentWeek - startWeek + 1;
  const today = dayjs().format('dddd');

  useEffect(() => {
    axios.get('http://localhost:8080/api/topics')
      .then(data => {
        const filteredData = data.data.filter((item: any) => item.week_number === weekNumber);
        setTopics(filteredData[0].week_topic);
      })
  }, []);
  const chunk = (arr: any, size: any) =>
  arr.reduce(
    (chunks: any, el: any, i: any) =>
      (i % size ? chunks[chunks.length - 1].push(el) : chunks.push([el])) &&
      chunks,
    []
  );
  const topicChunks = chunk(topics, 3);

  const getClassNameForTestResult = (result: 'green' | 'red' | 'undefined') => {
    switch (result) {
      case 'green':
        return 'testresult-table-row-el testresult-table-row-el-green';
      case 'red':
        return 'testresult-table-row-el testresult-table-row-el-red';
      default:
        return 'testresult-table-row-el testresult-table-row-el-undefined';
    }
  };

  const getTestResultAtIndex = (index: number) => {
    if (index < feedback.length) {
      return feedback[index];
    } else {
      return { result: 'undefined' };
    }
  };
  return (
  <>
    {loading === 'loading' && <div className='loading'></div>}
    <PrimarySearchAppBar />
    <div className='welcome'>
      {session && <h1 className='welcome-title'>{`welcome back ${capitalizeFirstLetter(session?.user.user_metadata.name.split(' ')[0])}`}</h1>}
    </div>
    <StyledBox sx={{ flexGrow: 1 }} className='box'>
      <Grid container spacing={3}>
        <Grid xs={12} sm={12} md={12} lg={5}>
          <Item onClick={() => setTestClicked(!testClicked)} className={`testresult ${testClicked ? 'item-clicked' : ''}`}>
            <h2 className='testresult-title'>Weekend Test Results</h2>
            <Grid container spacing={2}>
              <table className="testresult-table">
                <tbody>
                  <tr className="testresult-table-row">
                    <td className={getClassNameForTestResult(getTestResultAtIndex(0)?.result || 'undefined')}>
                      Week 1
                    </td>
                    <td className={getClassNameForTestResult(getTestResultAtIndex(1)?.result || 'undefined')}>
                      Week 4
                    </td>
                    <td className={getClassNameForTestResult(getTestResultAtIndex(2)?.result || 'undefined')}>
                      Week 7
                    </td>
                  </tr>
                  <tr className="testresult-table-row">
                    <td className={getClassNameForTestResult(getTestResultAtIndex(3)?.result || 'undefined')}>
                      Week 2
                    </td>
                    <td className={getClassNameForTestResult(getTestResultAtIndex(4)?.result || 'undefined')}>
                      Week 5
                    </td>
                    <td className={getClassNameForTestResult(getTestResultAtIndex(5)?.result || 'undefined')}>
                      Week 8
                    </td>
                  </tr>
                  <tr className="testresult-table-row">
                    <td className={getClassNameForTestResult(getTestResultAtIndex(6)?.result || 'undefined')}>
                      Week 3
                    </td>
                    <td className={getClassNameForTestResult(getTestResultAtIndex(7)?.result || 'undefined')}>
                      Week 6
                    </td>
                    <td className={getClassNameForTestResult(getTestResultAtIndex(8)?.result || 'undefined')}>
                      Week 9
                    </td>
                  </tr>
                </tbody>
              </table>
            </Grid>
          </Item>
        </Grid>
        <Grid xs={12} sm={4} md={4} lg={2}>
          <Item onClick={() => setWDClicked(!WDClicked)} className={`weekdate ${WDClicked ? 'item-clicked' : ''}`}>
            <h3 className='weekdate-date'>Week</h3>
            <h1 className='weekdate-weeknumber'>{weekNumber}</h1>
            <h4 className='weekdate-day'>{today}</h4>
          </Item>
        </Grid>
        <Grid xs={12} sm={8} md={8} lg={5}>
          <Item onClick={() => setTopicClicked(!topicClicked)} className={`topic ${topicClicked ? 'item-clicked' : ''}`}>
            <h2 className='topic-title'>This Weeks Topics</h2>
            <div className='topic-container'>
              {topicChunks.map((chunk: any, index: number) => (
                <ul className='topic-container-list' key={index}>
                  {chunk.map((topic: any, index: number) => (
                    <li className='topic-container-list-item' key={index}>
                      {topic.replace(/'/g, '')}
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </Item>
        </Grid>
        <Grid xs={12} sm={12} md={12} lg={12}>
          <Item onClick={() => setHLClicked(!HLClicked)} className={`${HLClicked ? 'item-clicked' : ''}`}>
            <div className='highlight-title'>
              <h2>Events</h2>
              <i className="fa-solid fa-calendar-days highlight-icon"></i>
              <h2>Today</h2>
            </div>
            <div className='highlight'>
              <div className='highlight-schedule'>
                <h4 className='highlight-schedule-title'>Morning</h4>
                {morningEvents.map((event: gapiType) => {
                  const endDate = new Date(event.endTime);
                  const startDate = new Date(event.startTime);
                  const nowDate = new Date();
                  const date = new Date(event.date).toLocaleString().toString().split(',');
                  const isPastEvent = endDate < nowDate;
                  const isDuringEvent = nowDate > startDate && nowDate < endDate;
                  const classNames = ['highlight-schedule-box'];
                  if (isPastEvent) {
                    classNames.push('past-event');
                  }
                  if (isDuringEvent) {
                    classNames.push('during-event');
                  }
                    return (
                      <div className={classNames.join(' ')}>
                        <p className='highlight-schedule-el'>{`${date[1].split(':').slice(0,2).join(':')} - ${event.summary}`}</p>
                        {isDuringEvent && <i className="fa-solid fa-exclamation highlight-schedule-box-warning"></i>}
                        {isPastEvent && <i className="fa-solid fa-check highlight-schedule-box-checkmark"></i>}
                        {!isPastEvent && !isDuringEvent && <i onClick={() => deleteEvent(event.id)} className="fa-solid fa-xmark highlight-schedule-box-delete"></i>}
                      </div>
                    )
                })}
              </div>
              <div className='highlight-schedule'>
              <h4 className='highlight-schedule-title'>Afternoon</h4>
                {afternoonEvents.map((event: gapiType) => {
                  const endDate = new Date(event.endTime);
                  const startDate = new Date(event.startTime);
                  const nowDate = new Date();
                  const date = new Date(event.date).toLocaleString().toString().split(',');
                  const isPastEvent = endDate < nowDate;
                  const isDuringEvent = nowDate > startDate && nowDate < endDate;
                  const classNames = ['highlight-schedule-box'];
                  if (isPastEvent) {
                    classNames.push('past-event');
                  }
                  if (isDuringEvent) {
                    classNames.push('during-event');
                  }
                    return (
                      <div className={classNames.join(' ')}>
                        <p className='highlight-schedule-el'>{`${date[1].split(':').slice(0,2).join(':')} - ${event.summary}`}</p>
                        {isDuringEvent && <i className="fa-solid fa-exclamation highlight-schedule-box-warning"></i>}
                        {isPastEvent && <i className="fa-solid fa-check highlight-schedule-box-checkmark"></i>}
                        {!isPastEvent && !isDuringEvent && <i onClick={() => deleteEvent(event.id)} className="fa-solid fa-xmark highlight-schedule-box-delete"></i>}
                      </div>
                    )
                })}
                </div>
                <div className='highlight-schedule'>
                  <h4 className='highlight-schedule-title'>Evening</h4>
                  {eveningEvents.map((event: gapiType) => {
                    const endDate = new Date(event.endTime);
                    const startDate = new Date(event.startTime);
                    const nowDate = new Date();
                    const date = new Date(event.date).toLocaleString().toString().split(',');
                    const isPastEvent = endDate < nowDate;
                    const isDuringEvent = nowDate > startDate && nowDate < endDate;
                    const classNames = ['highlight-schedule-box'];
                    if (isPastEvent) {
                      classNames.push('past-event');
                    }
                    if (isDuringEvent) {
                      classNames.push('during-event');
                    }
                      return (
                        <div className={classNames.join(' ')}>
                          <p className='highlight-schedule-el'>{`${date[1].split(':').slice(0,2).join(':')} - ${event.summary}`}</p>
                          {isDuringEvent && <i className="fa-solid fa-exclamation highlight-schedule-box-warning"></i>}
                          {isPastEvent && <i className="fa-solid fa-check highlight-schedule-box-checkmark"></i>}
                          {!isPastEvent && !isDuringEvent && <i onClick={() => deleteEvent(event.id)} className="fa-solid fa-xmark highlight-schedule-box-delete"></i>}
                        </div>
                      )
                  })}
                </div>
              </div>
          </Item>
        </Grid>
        <Grid xs={12} sm={12} md={12} lg={12}>
          <Item onClick={() => setCalendarClicked(!calendarClicked)} className={`calendar ${calendarClicked ? 'item-clicked' : ''}`}>
            <div className='calendar-title'>
              <h2>&nbsp;Week</h2>
              <i className="fa-solid fa-calendar-week calendar-icon"></i>
              <h2>Events</h2>
            </div>
            {weeksEvents && weeksEvents.length !== 0 &&
              <div className='calendar-schedule'>
                <div className='calendar-grid'>
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                    <div className='calendar-grid-day'>
                      <h4 className='calendar-grid-day-title'>{day}</h4>
                      {weeksEvents.filter(event => new Date(event.startTime).toLocaleString('en-US', {weekday: 'long'}) === day).map(event => {
                        const endDate = new Date(event.endTime);
                        const startDate = new Date(event.startTime);
                        const date = startDate.toLocaleString().toString().split(',');
                        const nowDate = new Date();
                        const isPastEvent = endDate < nowDate;
                        const isDuringEvent = nowDate > startDate && nowDate < endDate;
                        const classNames = ['calendar-schedule-box'];
                        if (isPastEvent) {
                          classNames.push('past-event');
                        }
                        if (isDuringEvent) {
                          classNames.push('during-event');
                        }
                        return (
                          <div className={classNames.join(' ')}>
                            <p className='calendar-schedule-box-el'>
                              {`
                                ${date[1].split(':').slice(0,2).join(':')} - 
                                ${event.summary}
                              `}
                            </p>
                            {isDuringEvent && <i className="fa-solid fa-exclamation calendar-schedule-box-warning"></i>}
                            {isPastEvent && <i className="fa-solid fa-check calendar-schedule-box-checkmark"></i>}
                            {!isPastEvent && !isDuringEvent && <i onClick={() => deleteEvent(event.id)} className="fa-solid fa-xmark calendar-schedule-box-delete"></i>}
                          </div>
                        )
                      })}
                    </div>
                  ))}
                </div>
              </div>
            }
          </Item>
        </Grid>
        <Grid xs={12} sm={12} md={12} lg={12}>
          <Item onClick={() => setEventsClicked(!eventsClicked)} className={`events ${eventsClicked ? 'item-clicked' : ''}`}>
            <h2 className='events-title'>Create a new event</h2>
            <div className='events-timeset'>
              <div className='events-timeset-input'>
                <p className='events-timeset-input-title'>Start of the event</p>
                <DateTimePicker onChange={setStart} value={start} />
              </div>
              <div className='events-timeset-input'>
                <p className='events-timeset-input-title'>End of the event</p>
                <DateTimePicker onChange={setEnd} value={end} />
              </div>
            </div>
            <div className='events-summary'>
              <CssTextField label="Event name" variant='standard' onChange={(e) => setEventName(e.target.value)}/>
              <CssTextField label="Event description" variant='standard' onChange={(e) => setEventDescription(e.target.value)}/>
            </div>
            <br />
            <LoginButton onClick={() => createCalendarEvent()}>Create Event</LoginButton>
          </Item>
        </Grid>
      </Grid>
    </StyledBox>
    <Footer />
  </>
  )
}

export default WelcomePage