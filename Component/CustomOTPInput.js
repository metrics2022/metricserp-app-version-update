

import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet
} from "react-native";

const CustomOTPInput = ({
  code,
  setCode,
  maximumLength,
  setIsPinReady,
  handleOtpChange,
}) => {
  const boxArray = new Array(maximumLength).fill(0);
  const inputRef = useRef();

  const [isInputBoxFocused, setIsInputBoxFocused] = useState(false);

  const handleOnPress = () => {
    setIsInputBoxFocused(true);
    inputRef.current.focus();
  };

  const handleOnBlur = () => {
    setIsInputBoxFocused(false);
  };

  useEffect(() => {
    setIsPinReady(code.length === maximumLength);
    return () => setIsPinReady(false);
  }, [code]);

  const boxDigit = (_, index) => {
    const digit = code[index] || "";

    const isCurrentValue = index === code.length;
    const isLastValue = index === maximumLength - 1;
    const isCodeComplete = code.length === maximumLength;

    const isValueFocused = isCurrentValue || (isLastValue && isCodeComplete);
    const boxStyle = isInputBoxFocused && isValueFocused
      ? styles.SplitBoxesFocused
      : styles.SplitBoxes;

    return (
      <View key={index} style={boxStyle}>
        <Text style={styles.SplitBoxText}>{digit}</Text>
      </View>
    );
  };

  return (
    <View style={styles.OTPInputContainer}>
      <Pressable style={styles.SplitOTPBoxesContainer} onPress={handleOnPress}>
        {boxArray.map(boxDigit)}
      </Pressable>
      <TextInput
        value={code}
        onChangeText={setCode}
        maxLength={maximumLength}
        ref={inputRef}
        onBlur={handleOnBlur}
        keyboardType="numeric"
        style={styles.TextInputHidden}
      />
    </View>
  );
};

export default CustomOTPInput;

const styles = StyleSheet.create({
  OTPInputContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  TextInputHidden: {
    position: 'absolute',
    opacity: 0,
    // You can uncomment the below lines for debugging or visual input
    // width: 300,
    // borderColor: '#e5e5e5',
    // borderWidth: 1,
    // borderRadius: 5,
    // padding: 15,
    // marginTop: 50,
    // color: 'white',
  },
  SplitOTPBoxesContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  SplitBoxes: {
    borderColor: '#e5e5e5',
    borderWidth: 2,
    borderRadius: 5,
    padding: 12,
    minWidth: 45,
  },
  SplitBoxesFocused: {
    borderColor: '#e5e5e5',
    backgroundColor: '#D3D3D3',
    borderWidth: 2,
    borderRadius: 5,
    padding: 12,
    minWidth: 45,
  },
  SplitBoxText: {
    fontSize: 20,
    textAlign: 'center',
    color: '#e5e5e5',
  },
});