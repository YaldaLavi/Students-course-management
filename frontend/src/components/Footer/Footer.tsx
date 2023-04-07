
import React, { FC, ReactElement } from "react";
import { Box, Button, Container, createTheme, Grid, Link, styled, ThemeProvider, Typography } from "@mui/material";
import { Facebook, Instagram, LinkedIn, Mail } from "@mui/icons-material";
import { grey } from "@mui/material/colors";
import './Footer.scss'

export const Footer: FC = (): ReactElement => {
    const font = "'Inconsolata', monospace";
const theme = createTheme({
  typography: {
    fontFamily: font,
  },
});

  const StyledButton = styled(Button) ({
    "&.MuiButton-root": {
        backgroundColor: '#ff7961',
        color: '#fff',
        border:'solid 1px white',
        '&:hover': {
            backgroundColor: '#ff7961',
            color: 'black',
            boxShadow:'0px 0px 7px 2px white'
        }
    },
    "&.MuiButton-text": {
      color: "#ff7961"
    },
  });

  return (
    <ThemeProvider theme={theme} >
    <Box
    
      sx={{
        width: "100%",
        height: "auto",
        backgroundColor: "#ff7961",
        paddingTop: "1rem",
        paddingBottom: "1rem",
        marginTop:"1rem",
        position:'absolute'

      }}
    >
      <Container maxWidth="lg">
        <Grid container direction="column" alignItems="center">
          <Grid item xs={12}>
            <Typography color="white" variant="h5">
              Let's talk! <b>amsterdam@salt.study</b>
            </Typography>
          </Grid>
          <Grid item xs={12}>
          <StyledButton variant="outlined" color="inherit" size="medium" startIcon={<Mail  sx={{ color: grey[100]}}/>} style={{margin:"5px",marginTop:"10px",}}>
          <a href="mailto: amsterdam@salt.study" >Contact Us</a>
        </StyledButton>
            
          </Grid>
          <Grid item xs={12}>
          <Link href="https://www.facebook.com/schoolofappliedtechnology" target="_blank" >
            <Facebook fontSize="large" style={{margin:"10px"}} sx={{ color: grey[100] }}/>
            </Link>
            <Link href="https://www.instagram.com/school_of_applied_technology/" target="_blank" >
            <Instagram fontSize="large" style={{margin:"10px"}}sx={{ color: grey[100] }}/>
            </Link>
            <Link href="https://se.linkedin.com/company/applied-technology-stockholm" target="_blank" >
            <LinkedIn fontSize="large" style={{margin:"10px"}} sx={{ color: grey[100] }}/>            </Link>            
          </Grid>
          <Grid item xs={12}>
            <Typography color="white" variant="subtitle1">
              ©&lt;/salt&gt;
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
    </ThemeProvider>
  );
};

export default Footer;
