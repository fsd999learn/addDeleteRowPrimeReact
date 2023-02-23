import React, { useState, useEffect } from 'react';
import {
  Viewport,
  AuthService,
  HttpService,
  HttpServiceContext
} from '@leap/sdk';
import AppService from './services/AppService';
import AppLoader from './components/AppLoader';

import '@leap/sdk/lib/style';
import './App.css';

const App = ({ version }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState(null);
  const [loggedOut, setLoggedOut] = useState(false);
  const [title, setTitle] = useState('Technology Services');
  const [search, setSearch] = useState(false);
  const [navigationItems, setNavigationItems] = useState([]);
  const [profile, setProfile] = useState(null);
  const [notificationCount, setNotificationCount] = useState(null);
  const [apps, setApps] = useState([]);
  const [basePath, setBasePath] = useState(null);
  const [env, setEnv] = useState(null);
  const [defaultApp, setDefaultApp] = useState(null);
  const [isDefaultApp, setIsDefaultApp] = useState(null);

  const initState = {
    authenticated: false,
    title: 'Technology Services',
    search: false,
    navigationItems: [],
    profile: null,
    notificationCount: null,
    apps: []
  };

  useEffect(() => {
    if (version) {
      console.log(`App version = ${version}`);
    }

    HttpServiceContext.setErrorInterceptor(handleHttpServiceError);
    HttpService.get('/tsp-config/config.json').then(({ data: config }) => {
      const hostname = window.location.hostname;
      let env = config.env ? config.env[hostname] : null;
      if (!env) {
        env = {
          apiEndpoint: '',
          authEndpoint: '',
          loginType: 'sdk',
          analytics: []
        };
      }
      env.handlers = {
        httpServiceError: handleHttpServiceError
      };
      setTitle(config.name);
      setBasePath(config.basePath);
      setEnv(env);
      setDefaultApp(config.app);
      if (env && env.apiEndpoint) {
        HttpServiceContext.setApiEndpoint(env.apiEndpoint);
      }
      const authenticated = AppService.isAuthenticated();
      if (authenticated) {
        handleAuthenticated();
      }
    });
  }, []);

  const handleHttpServiceError = error => {
    if (error.response && error.response.status === 401) {
      console.log('HTTP 401 Unauthorized, logging out current user ...');
      return AuthService.logout().then(() => {
        handleLogout({
          type: 'tokenExpired'
        });
      });
    } else {
      throw error;
    }
  };

  const handleLogout = error => {
    localStorage.clear();
    setAuthenticated(false);
    setError(error);
    setLoggedOut(true);
    setState(initState);
  };

  const handleAuthenticated = () => {
    setAuthenticated(true);
    setError(null);
    loadMyApp();
  };

  const handleAppLoad = config => {
    handleAppConfigUpdate(config);
  };

  const handleAppConfigUpdate = config => {
    const newTitle = config.title || title || 'Technology Services';
    const newIsDefaultApp = newTitle === 'Technology Services';
    setTitle(newTitle);
    setSearch(config.search);
    setNavigationItems(config.navigationItems || []);
    setIsDefaultApp(newIsDefaultApp);
  };

  const handleAppNotificationUpdate = () => {
    loadMyNotifications();
  };

  const loadMyApp = () => {
    AppService.getMyProfile().then(profile => {
      setProfile(profile);
