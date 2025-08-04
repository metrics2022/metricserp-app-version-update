import React from 'react'
import {
    ActivityIndicator,
    SafeAreaView,
    StyleSheet,
    TouchableOpacity
  } from "react-native";
import {WebView} from 'react-native-webview';
import AntDesign from 'react-native-vector-icons/AntDesign';


const Terms = ({ navigation }) => {

    const webviewRef = React.useRef(null);


    function LoadingIndicatorView() {
      return (
        <ActivityIndicator
          color="#009b88"
          size="large"
          style={styles.ActivityIndicatorStyle}
        />
      );
    }
    return (
      <>
        <SafeAreaView style={styles.flexContainer}>
        <TouchableOpacity style={{
                backgroundColor: '#FFF',
                paddingHorizontal: 15,
                paddingVertical: 12,
                shadowColor: "#000",
                shadowOffset: {
                    width: 0,
                    height: 2
                },
                shadowOpacity: 0.25,
                shadowRadius: 4,
                elevation: 5,
                marginBottom: 10
            }}
              onPress={() => navigation.goBack()}
            >
                <AntDesign name='arrowleft' size={24} color="#000" />
            </TouchableOpacity>
          <WebView
            source={{ uri: "https://metricserp.com/terms-of-use/" }}
            renderLoading={LoadingIndicatorView}
            startInLoadingState={true}
            ref={webviewRef}
          />

        </SafeAreaView>
      </>
    );
  }

  const styles = StyleSheet.create({
    ActivityIndicatorStyle: {
      flex: 1,
      justifyContent: "center",
    },
    flexContainer: {
      flex: 1,
    },
    tabBarContainer: {
      backgroundColor: "#d3d3d3",
      height: 56,
      alignItems: "center",
      flexDirection: "row",
      paddingHorizontal: 16,
      justifyContent: "space-between",
    },
    button: {
      fontSize: 24,
    },
    arrow: {
      color: "#ef4771",
    },
    icon: {
      width: 20,
      height: 20,
    },
  });


export default Terms;
