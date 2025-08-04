import React from 'react';
import { Alert } from 'react-native';

function AlertComponent(props) {
  const { title, message, buttons } = props;

  return (
    Alert.alert(
      title,
      message,
      buttons,
      { cancelable: false }
    )
  );
}

export default AlertComponent;