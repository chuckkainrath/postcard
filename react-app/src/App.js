import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { useDispatch } from 'react-redux';
import LoginForm from "./components/auth/LoginForm";
import SignUpForm from "./components/auth/SignUpForm";
import NavBar from "./components/NavBar";
import Splash from './components/Splash';
import ProtectedRoute from "./components/auth/ProtectedRoute";
import PhotosComponent from './components/MainPage/PhotosComponent';
import { authenticate } from "./store/session";
import ProfileContainer from "./components/ProfilePage/ProfileContainer";
import UploadPage from './components/PhotoUpload/UploadPage';
import PostCard from './components/PostCard';
import './bootstrap.css';

function App() {
  const [loaded, setLoaded] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    (async() => {
      await dispatch(authenticate());
      setLoaded(true);
    })();
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <BrowserRouter>
      <NavBar />
      <Switch>
        <Route path="/" exact={true}>
          <Splash />
        </Route>
        <Route path="/login" exact={true}>
          <LoginForm />
        </Route>
        <Route path="/sign-up" exact={true}>
          <SignUpForm />
        </Route>
        <ProtectedRoute path="/photos" exact={true}>
          <PhotosComponent />
        </ProtectedRoute>
        <ProtectedRoute path="/photo-upload" exact={true}>
          <UploadPage />
        </ProtectedRoute>
        <ProtectedRoute path="/create-postcard/:photoId" exact={true}>
          <PostCard />
        </ProtectedRoute>
        <ProtectedRoute path="/profiles/:username" exact={true}>
          <ProfileContainer />
        </ProtectedRoute>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
