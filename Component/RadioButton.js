import React, { useState, useEffect } from 'react'
import Fontawesome from 'react-native-vector-icons/FontAwesome';
import { TouchableOpacity, View, StyleSheet, Text, Image } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

const RadioButton = (props) => {
  const [resCode, setResCode] = useState('')
  return (
    <>
      {props.workOrderOption != "0" ? (<View style={styles.boederAll}>
        <View style={styles.tableRowMain}>
          <View style={[styles.rbWrapper, styles.content]}>
            <View style={{
              width: "12%",
              display: "flex",
              alignItems: "center"
            }}>
              <Text style={styles.textHeaderStyle}>CODE</Text>
            </View>
            <View style={{
              width: "16%",
              display: "flex",
              alignItems: "center",
            }}>
              <Text style={styles.textHeaderStyle}>DTAILS</Text>
            </View>
            <View style={{
              width: "18%",
              display: "flex",
              alignItems: "center"
            }}>
              <Text style={styles.textHeaderStyle}>HRS</Text>
            </View>
            <View style={{
              width: "25%",
              display: "flex",
              alignItems: "center"
            }}>
              <Text style={styles.textHeaderStyle}>FROM DATE</Text>
            </View>
            <View style={{
              width: "28%",
              display: "flex",
              alignItems: "center"
            }}>
              <Text style={styles.textHeaderStyle}>TO DATE</Text>
            </View>
          </View>
        </View >
        {props.workOrderOption.map((res, index) => {
          return (
            <>
              <View style={styles.tableRowMain} key={index} >
                <View style={[styles.rbWrapper, styles.border]} key={index}>
                  <TouchableOpacity
                    style={styles.rbStyle}
                    onPress={() => {
                      setResCode(res.work_order_routing_id),
                        props.setOperationCode(res.operation_code)
                    }}>
                    {resCode === res.work_order_routing_id && <View style={styles.selected} />}
                  </TouchableOpacity>
                  <View style={{
                    width: "8%",
                    display: "flex",
                    alignItems: "center"
                  }}>
                    <Text style={styles.textStyle}>{res.operation_code}</Text>
                  </View>
                  <View style={{
                    width: "12%",
                    display: "flex",
                    alignItems: "center"
                  }}>
                    <Text style={styles.textStyle}>{res.operation_description}</Text>
                  </View>
                  <View style={{
                    width: "25%",
                    display: "flex",
                    alignItems: "center"
                  }}>
                    <Text style={styles.textStyle}>{res.hours_required}</Text>
                  </View>
                  <View style={{
                    width: "25%",
                    display: "flex",
                    alignItems: "center"
                  }}>
                    <Text style={styles.textStyle}>{res.effectivefrm_date}</Text>
                  </View>
                  <View style={{
                    width: "25%",
                    display: "flex",
                    alignItems: "center"
                  }}>
                    <Text style={styles.textStyle}>{res.effectiveto_date}</Text>
                  </View>
                </View>
              </View>
            </>
          ); 

        })}
      </View>) : (<View >
        <View style={styles.tableRowMain}>
          <View style={[styles.rbWrapper, styles.content]}>
            <View style={{
              width: "100%",
              display: "flex",
              alignItems: "center"
            }}>
              <Image
                  source={require('../assets/warning.png')}
                  width="20%"
                  height="20%"
              />
              </View>
            </View>
        </View>
        <View style={{
          width: "100%",
          display: "flex",
          alignItems: "center"
        }}>
          <Text> No Record Found</Text>
        </View>
      </View>)}
    </>
  )
}
const styles = StyleSheet.create({
  rbWrapper: {
    marginBottom: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ErrWrapper: {
    marginBottom: 10,
    alignItems: 'center',
    flexDirection: 'row',
    width: "100%",
    borderColor: "#ccc",
    borderBottomWidth: 5,
    paddingHorizontal: 8,
    paddingVertical: 8,
    backgroundColor: "#fff",
    padding: 2,
    marginBottom: 15,
    paddingBottom: 15,
  },
  border: {
    borderBottomColor: "#B3B3B3",
    borderBottomWidth: 1,
    padding: 2,
    marginBottom: 5,
    paddingBottom: 5,
  },
  textStyle: {
    fontSize: 13,
  },
  borderHeader: {
    borderBottomColor: "#B3B3B3",
    borderBottomWidth: 2,
    padding: 2,
    marginBottom: 15,
    paddingBottom: 15,
  },
  textHeaderStyle: {
    fontSize: 13,
    color: '#000'
  },
  rbStyle: {
    height: 12,
    width: 12,
    borderRadius: 110,
    borderWidth: 1,
    borderColor: '#6a6c6d',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selected: {
    width: 7,
    height: 7,
    borderRadius: 55,
    backgroundColor: "#6a6c6d",
  },
  content: {
    width: "100%",
    borderColor: "#ccc",
    borderBottomWidth: 2,
    paddingHorizontal: 5,
    paddingVertical: 8,
    marginBottom: 10,
    backgroundColor: "#fff"
  },
  tableCell: {
    width: "15%",
    display: "flex",
    alignItems: "center"
  },
  tableRowMain: {
    display: "flex",
    flexDirection: "row",
  },
});
export default RadioButton