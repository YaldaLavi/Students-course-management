import React from 'react';
import './App.scss';
import { Route, Routes } from 'react-router-dom';
import WelcomePage from './components/WelcomePage/WelcomePage';
import Login from './components/Login/Login';
import ProfileSetting from './components/ProfileSetting/ProfileSetting';
import TestResults from './components/TestResults/TestResults';
import LectureSlides from './components/LectureSlides/LectureSlides';
import LectureUpload from './components/LectureUpload/LectureUpload';
import InstructorPage from './components/InstructorPage/InstructorPage';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<ProfileSetting />} />
        <Route path="/results" element={<TestResults />} />
        <Route path="/instructor" element={<InstructorPage />} />
        <Route path="/lectures" element={<LectureSlides />} />
        <Route path="/lecupload" element={<LectureUpload />} />
      </Routes>
    </>
  );
}

export default App;
