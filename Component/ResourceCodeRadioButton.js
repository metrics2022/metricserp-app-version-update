import React, { useState, useEffect } from 'react'
import Fontawesome from 'react-native-vector-icons/FontAwesome';
import { TouchableOpacity, View, StyleSheet, Text, Image } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

const ResourceCodeRadioButton = (props) => {
  const [resCode, setResCode] = useState('')

  return (
    <View>
      {props.resCodeOption != "0" ? (<View style={styles.boderAll}>
        <View style={styles.tableRowMain}>
          <View style={[styles.rbWrapper, styles.content]}>
            <View style={{
              width: "50%",
              display: "flex",
              alignItems: "center"
            }}>
              <Text style={styles.textHeaderStyle}>EMPLOYEE</Text>
            </View>
            <View style={{
              width: "50%",
              display: "flex",
              alignItems: "center",
            }}>
              <Text style={styles.textHeaderStyle}>STATUS</Text>
            </View>
          </View>
        </View >

        {props.resCodeOption.map((res, index) => {
          return (
            <>
              <View style={styles.tableRowMain} key={index} >
                <View style={[styles.rbWrapper, styles.border]} key={index}>

                  <TouchableOpacity
                    style={styles.rbStyle}
                    onPress={() => {
                      setResCode(res.emp_id)
                      props.setEmpId(res.emp_id)
                      props.setEntityCode(res.emp_code)
                      props.setEntityName(res.emp_fname.concat(" ", res.emp_lname))
                    }}>
                    {resCode === res.emp_id && <View style={styles.selected} />}
                  </TouchableOpacity>

                  <View style={{
                    width: "45%",
                    display: "flex",
                    alignItems: "center"
                  }}>
                    <Text style={styles.textStyle}>{res.emp_fname.concat(" ", res.emp_lname)}</Text>
                  </View>

                  <View style={{
                    width: "50%",
                    display: "flex",
                    alignItems: "center"
                  }}>
                    <Text style={styles.textStyle}>{res.emp_active == 1 ? "Yes" : "No"}</Text>
                  </View>
                </View>
              </View>
            </>
          );
        })}

      </View>) : (<View style={styles.boederAll}>
        <View style={styles.tableRowMain}>
          <View style={[styles.rbWrapper, styles.content]}>
            <View style={{
              width: "100%",
              display: "flex",
              alignItems: "center"
            }}>
              <Image
                source={require('../assets/warning.png')}
                width="10"
                height="10"
                resizeMode="contain"
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
    </View>
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
  boderAll: {
    borderColor: "#B3B3B3",
    borderWidth: 1
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
    width: "20%",
    display: "flex",
    alignItems: "center"
  },
  tableRowMain: {
    display: "flex",
    flexDirection: "row",
  },
});

export default ResourceCodeRadioButton