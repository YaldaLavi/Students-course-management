import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import { Avatar, ListItemIcon } from '@mui/material';
import TaskIcon from '@mui/icons-material/Task';
import { Link } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import ArticleIcon from '@mui/icons-material/Article';

const drawerWidth = 240;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

export default function PersistentDrawerLeft() {
  const supabase = useSupabaseClient();
  // const session = useSession();

  async function signOut() {
    localStorage.clear();
    await supabase.auth.signOut();
  }

  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open} style={{ background: "#ff7961" } }>
        <Toolbar>
          {localStorage.getItem('role') === 's' && <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>}
          <Typography variant="h6" noWrap component="div" style={{fontFamily: "Inconsolata"}}>
            <p>{'</salt>'}</p>
          </Typography>
          <IconButton
            color="inherit"
            aria-label="logout"
            sx={{ ml: 'auto' }}
          >
            <Link to='/login'>
              <LogoutIcon onClick={() => signOut()}/>
            </Link>
          </IconButton>
        </Toolbar>
      </AppBar>
      
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor:'#ff7961'
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader style={{display: 'flex', justifyContent:'space-between'}}>
          <Typography style={{color: 'white', paddingLeft:'15px'}}>
            MENU
          </Typography>
          <IconButton onClick={handleDrawerClose} style={{color: 'white'}}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton >
        </DrawerHeader>
        <Divider />
        <List>
        <Link to='/profile' style={{color: 'white'}}>
            <ListItem key={'My Profile'} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                  <Avatar alt="Profile" src={localStorage.getItem('picture')!} sx={{ width: 24, height: 24 }}/>
                  </ListItemIcon>
                  <ListItemText primary={'My Profile'} />
                </ListItemButton>
            </ListItem>
          </Link>
          <Link to='/' style={{color: 'white'}}>
            <ListItem key={'Dashboard'} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <HomeIcon style={{color: 'white'}}/>
                  </ListItemIcon>
                  <ListItemText primary={'Dashboard'} />
                </ListItemButton>
            </ListItem>
          </Link>
          <Link to='/results' style={{color: 'white'}}>
            <ListItem key={'Results'} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <TaskIcon style={{color: 'white'}} />
                  </ListItemIcon>
                  <ListItemText primary={'Results'} />
                </ListItemButton>
            </ListItem>
          </Link>
          <Link to='/lectures' style={{color: 'white'}}>
            <ListItem key={'lectures'} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <ArticleIcon style={{color: 'white'}}/>
                  </ListItemIcon>
                  <ListItemText primary={'lectures'} />
                </ListItemButton>
            </ListItem>
          </Link>

        </List>
      </Drawer>
      <br/>
      <br/>
      <br/>
    </Box>
  );
}