import React from "react";
import './Login.scss';
import { TypeAnimation } from "react-type-animation";
import { styled, Button } from "@mui/material";
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import GoogleIcon from '@mui/icons-material/Google';

const LoginButton = styled(Button) ({
  "&.MuiButton-root": {
    backgroundColor: "#ff7961"
  },
  "&.MuiButton-text": {
    color: "white"
  },
});

const Login = () => {
  const ref = React.createRef<HTMLSpanElement>();
  const CURSOR_CLASS_NAME = 'custom-type-animation-cursor';

  const showCursorAnimation = (show: boolean) => {
    if (!ref.current) {
      return;
    }
    
    const el = ref.current;

    if (show) {
      el.classList.add(CURSOR_CLASS_NAME);
    } else {
      el.classList.remove(CURSOR_CLASS_NAME);
    }
  };

  const session = useSession();
  const supabase = useSupabaseClient();

  async function googleSignIn() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        scopes: 'https://www.googleapis.com/auth/calendar'
      }
    });
    if(error) {
      alert("Error logging in to Google provider with Supabase");
      console.log(error);
    } 
  }

  console.log(session);

  return (
    <div className='content'>
      <TypeAnimation
        ref={ref} 
        cursor={false}
        className={CURSOR_CLASS_NAME}
        sequence={[
          '<',
          100,
          '</',
          50,
          '</slat',
          200,
          '</salt',
          500,
          '</salt>',
          () => showCursorAnimation(false)
        ]}
        speed={1}
        style={{
          fontSize: '6em',
        }}
      />

      <h1 className='title'>Student Overview</h1>
      <br />
      <div className='login'>
        <LoginButton onClick={() => googleSignIn()}><GoogleIcon className="googleIcon"/>Sign in with Google</LoginButton>
      </div>
    </div>
  );
};

export default Login;