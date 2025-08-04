import React, { useState, useEffect } from 'react'
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    ActivityIndicator,
    Keyboard,
    TouchableWithoutFeedback
} from 'react-native';
import { AllOrganizationAction } from '../Redux/Actions/AllOrganizationAction';
import { Picker } from '@react-native-picker/picker';
import { useDispatch, useSelector } from 'react-redux';


const OrganizatinSearchCom = (props) => {
    // const [selectedVal, setSelectedVal] = useState('');
    const organizationState = useSelector((state) => state.AllOrganization);
    const dispatch = useDispatch();

    useEffect(() => {
        if (props.customerId != "") {
            dispatch(AllOrganizationAction(props.customerId));
        }
    }, [props.customerId]);
    const branchItems = () => {
        return (
            organizationState.allBranchs?.map((item, index) => {
                return (
                    <Picker.Item style={styles.listItem} key={index} label={item.org_name} value={item.org_id} />
                )
            })
        )
    }
    return (
        <>
            <View style={styles.Row}>
                <View style={{ width: "100%", paddingHorizontal: 5}}>
                    <Text style={{ color: "#000", fontSize: 15, marginBottom: 5, fontWeight: "700" }}>Organization</Text>
                    <Picker
                        selectedValue={props.organization}
                        style={{ color: "#000", padding: 0, backgroundColor: "#e1e2e3"}}
                        dropdownIconColor="#000"
                        onValueChange={(itemValue, itemIndex) =>
                            props.setOrganization(itemValue)
                        }
                    >
                        {branchItems()}
                    </Picker>
                </View>
            </View>
        </>
    )
}
var styles = StyleSheet.create({
    Row: {
        flexDirection: "row",
        marginHorizontal: -5,
        flexWrap: "wrap"
    },
    listItem: {
        fontSize: 15,
        padding: 0,
    },


});
export default OrganizatinSearchCom