import React, { Component } from 'react';

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

class App extends Component {
  initState = {
    authenticated: false,
    title: 'Technology Services',
    search: false,
    navigationItems: [],
    profile: null,
    notificationCount: null,
    apps: []
  };

  constructor(props) {
    super(props);

    this.handleHttpServiceError = this.handleHttpServiceError.bind(this);
    this.handleAuthenticated = this.handleAuthenticated.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleAppLoad = this.handleAppLoad.bind(this);
    this.handleAppConfigUpdate = this.handleAppConfigUpdate.bind(this);
    this.handleAppNotificationUpdate = this.handleAppNotificationUpdate.bind(
      this
    );

    this.state = this.initState;
  }

  componentWillMount() {
    const { version } = this.props;
    if (version) {
      console.log(`App version = ${version}`);
    }

    HttpServiceContext.setErrorInterceptor(this.handleHttpServiceError);
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
        httpServiceError: this.handleHttpServiceError
      };
      this.setState(
        {
          title: config.name,
          basePath: config.basePath,
          env: env,
          defaultApp: config.app
        },
        () => {
          if (this.state.env && this.state.env.apiEndpoint) {
            HttpServiceContext.setApiEndpoint(this.state.env.apiEndpoint);
          }
          const authenticated = AppService.isAuthenticated();
          if (authenticated) {
            this.handleAuthenticated();
          }
        }
      );
    });
  }

  handleHttpServiceError(error) {
    if (error.response && error.response.status === 401) {
      console.log('HTTP 401 Unauthorized, logging out current user ...');
      return AuthService.logout().then(() => {
        this.handleLogout({
          type: 'tokenExpired'
        });
      });
    } else {
      throw error;
    }
  }

  handleLogout(error) {
    localStorage.clear();
    this.setState(
      {
        authenticated: false,
        error: error,
        loggedOut: true
      },
      () => {
        this.setState(this.initState);
      }
    );
  }

  handleAuthenticated() {
    this.setState(
      {
        authenticated: true,
        error: null
      },
      this.loadMyApp
    );
  }

  handleAppLoad(config) {
    this.handleAppConfigUpdate(config);
  }

  handleAppConfigUpdate(config) {
    const title = config.title || this.state.title || 'Technology Services';
    const isDefaultApp = title === 'Technology Services';
    this.setState({
      title,
      search: config.search,
      navigationItems: config.navigationItems || [],
      isDefaultApp
    });
  }

  handleAppNotificationUpdate() {
    this.loadMyNotifications();
  }

  loadMyApp() {
    AppService.getMyProfile().then(profile => {
      this.setState({
        profile
      });
    });

    AppService.getMyApps().then(apps => {
      if (apps) {
        this.setState({
          apps
        });
      }
    });

    this.loadMyNotifications();
  }

  loadMyNotifications() {
    AppService.getNoOfNotifications().then(notificationCount => {
      this.setState({
        notificationCount:
          notificationCount && notificationCount > 0 ? notificationCount : null
      });
    });
  }

  render() {
    return (
      <Viewport>
        <AppLoader
          apps={this.state.apps}
          authenticated={this.state.authenticated}
          basePath={this.state.basePath}
          defaultApp={this.state.defaultApp}
          env={this.state.env}
          error={this.state.error}
          loggedOut={this.state.loggedOut}
          navigationItems={this.state.navigationItems}
          notificationCount={this.state.notificationCount}
          onAppLoad={this.handleAppLoad}
          onAppConfigUpdate={this.handleAppConfigUpdate}
          onAppNotificationUpdate={this.handleAppNotificationUpdate}
          onAuthenticated={this.handleAuthenticated}
          onNotification
          onLogout={this.handleLogout}
          profile={this.state.profile}
          search={this.state.search}
          title={this.state.title}
          isDefaultApp={this.state.isDefaultApp}
        />
      </Viewport>
    );
  }
}

export default App;
