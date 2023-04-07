import React, {useState, useEffect} from "react";
import "./ProfileSetting.scss";
import { toast } from 'react-toastify';
import Footer from "../Footer/Footer";
import Navbar from "../NavBar/NavBar";
import axios from "axios";
import { Box, Button, Grid, InputLabel, Modal, TextField   } from "@mui/material";
import PersonPinIcon from '@mui/icons-material/PersonPin';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';

type UserData = {
  id: number,
  email: string,
  first_name: string,
  last_name:string,
  Role:string,
  mob_id:number,
  course_id:number,
};

type MobUsers = {
  id: number,
  email: string,
  first_name: string,
  last_name:string,
  Role:string,
  mob_name: string,
  mob_id: number
};

const ProfileSetting = () => {
  const style = {
    position: 'absolute' as 'absolute',
    top: '40%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid rgba(255,121,97)',
    boxShadow: '0px 9px 46px 8px rgba(255,121,97)',
    p: 4,
  };

  const [name, setName] = useState('');
  const [id, setID] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [mobNumber, setMobNumber] = useState('');
  const [mobName, setMobName] = useState('');
  const [momMembers, setMobMembers] = useState([]);
  const [courseNumber, setCourseNumber] = useState('');
  const [courseName, setCourseName] = useState('');
  const[bio,setBio]=useState('');
  const[linkedIn,setLinkedIn]=useState('');
  const[gitHub,setGitHub]=useState('');
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  async function getUserData() {
    axios.get('http://localhost:8080/api/users')
      .then((data) => {
        const user = data.data.filter((user: UserData) => {
          return user.email === localStorage.getItem('email');
        });
        setName(user[0].first_name);
        setLastName(user[0].last_name);
        setEmail(user[0].email);
        setMobNumber(user[0].mob_id);
        setCourseNumber(user[0].course_id);
        setID(user[0].id);
        setBio(user[0].bio);
        setLinkedIn(user[0].linkedin);
        setGitHub(user[0].github);
      })
  }

  useEffect(() => {
 
    getUserData();
  }, []);

  const handleSubmit = async (event:any) => {
    event.preventDefault(); 

  try {
    const response = await axios.put(`http://localhost:8080/api/infousers/${id}`, {
      bio: bio,
      linkedIn: linkedIn,
      gitHub: gitHub
    });
    setBio('');
    setLinkedIn('');
    setGitHub('');
    getUserData();
    toast.success('User data updated successfully');


  } catch (error:any) {
    if (error.response && error.response.status === 404) {
      console.log('User not found');
    } else {
      console.log('Failed to update user data');
    }
  }
  };
 
  useEffect(() => {
    async function getMobData() {
      if (mobNumber !== '') {
        axios.get(`http://localhost:8080/api/mobusers/${mobNumber}`)
        .then((data) => {
          const mobMembers = data.data.map((member: MobUsers) => {
            return `${member.first_name} ${member.last_name}`;
          })
          setMobName(data.data[0].mob_name);
          setMobMembers(mobMembers);
        })
      }
    };
    getMobData();
  }, [mobNumber]);

  useEffect(() => {
    async function getClassData() {
      if (courseNumber !== '') {
        axios.get(`http://localhost:8080/api/courseusers/${courseNumber}`)
        .then((data) => {
          setCourseName(data.data[0].name);
        })
      }
    }
    getClassData();
  }, [courseNumber])

  return (
  <>
    <Navbar />
    <div className="main-profile-div" >
     <Grid container spacing={1} style={{display:'flex',justifyContent:'space-evenly',overflow:'scroll'}}>
        <Grid  item sm={12} xs={12} md={4}   className='Profile-image-Part'>
          <div className="image-container" >
          <img alt="profile" src={localStorage.getItem('picture')!} className="image"/>
          </div>
          <Grid container xs={12} sm={12} className="info-container">
            <Grid item className="margin" style={{paddingLeft:'15px',wordBreak:'break-all'}} >
            <InputLabel htmlFor="my-input" className="labelField">Bio </InputLabel>
            <Grid item style={{display:'flex',alignItems:'center'}}>
                <PersonPinIcon/>
                <div style={{color:'black'}} className="TextField">{bio}</div>
                </Grid>
                </Grid>
                <Grid item  className="margin"style={{paddingLeft:'15px',wordBreak:'break-all'}}>
            <InputLabel htmlFor="my-input" className="labelField">LinkedIn </InputLabel>
            <Grid item style={{display:'flex',alignItems:'center'}}>
            <LinkedInIcon/>
                <p className="TextField">{linkedIn}</p>
                </Grid>
                </Grid>
                <Grid item  className="margin"style={{paddingLeft:'15px',wordBreak:'break-all'}}>
            <InputLabel htmlFor="my-input" className="labelField">GitHub</InputLabel>
            <Grid item style={{display:'flex',alignItems:'center'}}>

            <GitHubIcon />
                <p  className="TextField">{gitHub}</p>
                </Grid>
                </Grid>

                <Grid item  className="button">
               <Button  variant="contained" color="warning" onClick={handleOpen} >Edit</Button>
               <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box  sx={style}>
        <form onSubmit={handleSubmit}>
 <Grid sm={12} className="info-container">

  <Grid xs={12} sm={12} item className="test">
 <TextField placeholder="Enter your bio" label="bio" variant="outlined" fullWidth required multiline value={bio} onChange={(e)=>setBio(e.target.value)} color="warning"/>
 </Grid>
 <Grid xs={12} sm={12} item className="test">
   <TextField placeholder="Enter your LinkedIn" label="LinkedIn" variant="outlined" fullWidth required multiline  value={linkedIn}color="warning" onChange={(e)=>setLinkedIn(e.target.value)}/>
  </Grid>
<Grid xs={12} sm={12} item className="test">

   <TextField placeholder="Enter your Github" label="Github" variant="outlined" fullWidth required multiline value={gitHub}color="warning" onChange={(e)=>setGitHub(e.target.value)}/>

  </Grid>
  <Grid container spacing={1}>
  <Grid item xs={12} >
     <Button type="submit" variant="contained" color="warning" fullWidth >Submit</Button>
   </Grid>
  </Grid>
</Grid>
</form>
        </Box>
      </Modal>
                </Grid>
          </Grid>
       
        </Grid>

        <Grid  item sm={12} xs={12}  md={6}  className='Profile-dis-Part'>
                <InputLabel htmlFor="my-input" className="labelField">First Name </InputLabel>
                <input id="my-input" aria-describedby="my-helper-text"defaultValue={name} disabled className="TextField"/>
                <InputLabel htmlFor="my-input" className="labelField" >Last Name </InputLabel>
                <input id="my-input" aria-describedby="my-helper-text"defaultValue={lastName} disabled className="TextField"/>
                <InputLabel htmlFor="my-input" className="labelField">Email</InputLabel>
                <input id="my-input" aria-describedby="my-helper-text"defaultValue={email} disabled className="TextField"/>
                <InputLabel htmlFor="my-input" className="labelField">Course</InputLabel>
                <input id="my-input" aria-describedby="my-helper-text" defaultValue={courseName} disabled color="warning" className="TextField"/>
                <InputLabel htmlFor="my-input" className="labelField">Mob name</InputLabel>
                <input id="my-input" aria-describedby="my-helper-text"defaultValue={mobName} disabled className="TextField"/>
                <InputLabel htmlFor="my-input" className="labelField">Instructors</InputLabel>
                <input id="my-input" aria-describedby="my-helper-text" defaultValue="Wietse,Dasha" disabled className="TextField"/>
                <InputLabel htmlFor="my-input" className="labelField">Mob Members:</InputLabel>
                <input id="my-input" aria-describedby="my-helper-text" defaultValue={momMembers.join(' - ')} disabled className="TextField"/>
        </Grid>
    </Grid>
        </div>
      <Footer />
    </>
  );
};

export default ProfileSetting;



