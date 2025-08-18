import React from 'react';
// import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

// redux

import { Provider } from 'react-redux';
import store from './Redux/store';


const Root = () => (
    <Provider store={store}>
      <App />
    </Provider>
  )

  if (__DEV__) {
    import('./config/ReactotronConfig').then(() =>
      console.log('Reactotron Configured')
    );
  }

AppRegistry.registerComponent(appName, () => Root);