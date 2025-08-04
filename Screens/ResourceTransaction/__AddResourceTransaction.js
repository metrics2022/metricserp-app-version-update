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
    TouchableWithoutFeedback,
    Button,
    Modal,
    Pressable,
    Image
} from 'react-native';
import moment from "moment";
import Icon from 'react-native-vector-icons/FontAwesome';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Picker } from '@react-native-picker/picker';
import Fontawesome from 'react-native-vector-icons/FontAwesome';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SearchResourceWorkOrdersAction, SelectedWorkOrderResourceAction, SearchResourceCodeAction, SelectedResourceCodeAction, ResourceSubmitAction } from '../../Redux/Actions/ResourceTransactionsAction';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import OrganizatinSearchCom from '../../Component/OrganizatinSearchCom'
import HeaderTextLeft from '../../Component/HeaderTextLeft';
import RadioButton from '../../Component/RadioButton';
import ResourceCodeRadioButton from '../../Component/ResourceCodeRadioButton'

const AddResourceTransaction = ({ navigation, route }) => {

    const workOrderState = useSelector((state) => state.ResourceTransaction);

    const dispatch = useDispatch();

    const [organization, setOrganization] = useState(1);
    const [customerId, setCustomerId] = useState('');
    const [lineOrganization, setLineOrganization] = useState('')
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [date, setDate] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [resCodeModalVisible, setResCodeModalVisible] = useState(false);
    const [workOrderNo, setWorkOrderNo] = useState('')
    const [workOrderId, setWorkOrderId] = useState('')
    const [workOrderOption, setWorkOrderOption] = useState('');
    const [operationCode, setOperationCode] = useState('')
    const [resCodeId, setrResCodeId] = useState('')
    const [resCodeOption, setResCodeOption] = useState('')
    const [resCodeNo, setResCodeNo] = useState('')
    const [entityName, setEntityName] = useState('')
    const [entityCode, setEntityCode] = useState('')
    const [hrsUsed, setHrsUsed] = useState('')
    const [comment, setComment] = useState('')
    const [empId, setEmpId] = useState('')

    const [btnDisabled, setBtnDisabled] = useState(true);
    const [isSectionShow, setIsSectionShow] = useState(true);

    const readItemFromStorage = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('uuid')
            return jsonValue != null ? JSON.parse(jsonValue) : null
        } catch (e) {
        }
    }
    useEffect(() => {
        readItemFromStorage().then((e) => { setCustomerId(e.emp_data.emp_id) });
    }, []);
    //Transaction Date
    const showDatePicker = () => {
        setDatePickerVisibility(true);
    }
    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };
    const handleConfirm = (date) => {
        setDate(new Date(date).toLocaleDateString());
        hideDatePicker();
    };
    const getTransDate = () => {
        return date !== '' ? moment(date).format("DD-MM-YYYY") : null
    };

    useEffect(() => {
        if (workOrderNo == '' || resCodeId == '' || hrsUsed == '') {
            setBtnDisabled(true);
        }
        else {
            setBtnDisabled(false);
        }
    }, [workOrderNo, resCodeId, hrsUsed]);
//Work Order
    useEffect(() => {
        if (customerId != "") {
            dispatch(SearchResourceCodeAction(customerId));
            dispatch(SearchResourceWorkOrdersAction(customerId));
        }
    }, [customerId]);
    //Modal Work_order
    const handleOpen = (workOrderId) => {
        // console.log("Workorder_id----", workOrderId)
        dispatch({ type: "SELECTED_RESOURCE_WORK_ORDER_SEARCH_RESET" })
        dispatch(SelectedWorkOrderResourceAction(workOrderId
        ))
        setOperationCode('')
        setModalVisible(true);
    }
    useEffect(() => {
        setWorkOrderOption(workOrderState.selectedWorkOrder)
    }, [workOrderState.selectedWorkOrder])

    const WorkOrderNum = (value) => workOrderState.allWorkOrders?.map((item) => {
        if (item.work_order_id == value) {
            return (
                setWorkOrderNo(item.work_order_no))
        }
    }
    )
    const handleCloseWorkOrder = () => {
        setModalVisible(false);
        setOperationCode('')
    }
    const workOrderData = () => {
        return (
            workOrderState.allWorkOrders?.map((item) => {
                return (
                    <Picker.Item style={styles.listItem} key={item.work_order_id} label={item.work_order_no}
                        value={item.work_order_id}
                        // value={[item.work_order_id,item.work_order_no]}
                    />
                )
            })
        )
    }
    const modalTableData = () => {
        return (
            <View style={styles.tableContainer}>
                <View style={styles.content}>
                    <View style={styles.tableList}>
                        <View style={styles.tableRowMain}>
                            <RadioButton workOrderOption={workOrderOption} setOperationCode={setOperationCode} />
                        </View>
                    </View>
                </View >
            </View >
        )
    }
    // console.log("WORKORDER ID:", workOrderId, "WorkOrderNO:", workOrderNo)
    // console.log("RESPONCECODE :", resCodeOption)
    const resoCodeData = () => {
        return (
            workOrderState.allResourceCode?.map((item) => {
                return (
                    <Picker.Item style={styles.listItem} key={item.resource_id} label={item.resource_code}
                        value={item.resource_id} />
                )
            })
        )
    }
    const ResourceCodeNum = (value) => workOrderState.allResourceCode?.map((obj) => {
        if (obj.resource_id == value) {
            return (
                setResCodeNo(obj.resource_code)
            )
        }
    }
    )
    const resCodeHandleOpen = (resCodeId) => {
        // console.log("RES_ID----", resCodeId)
        dispatch({ type: "SELECTED_RESOURCE_CODE_SEARCH_RESET" })
        dispatch(SelectedResourceCodeAction(resCodeId))
        setEntityCode('')
        setEntityName('')
        setResCodeModalVisible(true)
    }
    // console.log("WOrkorder_Out::", workOrderId)
    const handleCloseResourceCode = () => {
        setResCodeModalVisible(false)
        setEntityCode('')
        setEntityName('')
    }
    useEffect(() => {
        setResCodeOption(workOrderState.selectedResCode)
    }, [workOrderState.selectedResCode])

    const handleSelect = () => {
        // console.log("RESPONCECODE----:", resCodeOption)
        setModalVisible(false)
        setResCodeModalVisible(false)
        // setOperationCode(workOrderCode)
    }
    //Modal
    // console.log("workOrderOption", workOrderOption)
    // console.log("workOrderNo", WorkOrderNum())
// console.log("workOrderOption",workOrderOption.operation_code)
    const setdefaultlineOrganization = (val) => {
        if (lineOrganization == '' || lineOrganization == null) {
            setLineOrganization(val)
        }
    }
    const resCodeModalTableData = () => {
        return (
            <View style={styles.tableContainer}>
                <View style={styles.content}>
                    <View style={styles.tableList}>
                        <View style={styles.tableRowMain}>
                            <ResourceCodeRadioButton resCodeOption={resCodeOption} setEntityCode={setEntityCode} setEntityName={setEntityName} setEmpId={setEmpId} />
                        </View>
                    </View>
                </View >
            </View >
        )
    }
    //Transaction Date 
    const goBack = () => {
        navigation.goBack()
    }
    useEffect(() => {
        if (workOrderState.newResourceSubmit.status === "Success") {
            dispatch({ type: "RESOURCE_SUBMIT_RESET" });
            setIsSectionShow(false);
        }
    }, [workOrderState]);

    const handleResourceSubmit = () => {
      //  console.log("RESOURCESUBMIT-----:", "workorder_id : ", workOrderId, "org_id : ", organization, "entitie_id : ", empId, "resource_id : ", resCodeId, "operation_code : ", operationCode, "transaction_date : ", date, "num_of_hrs : ", hrsUsed, "workorder_no : ", workOrderNo, "comments : ", comment)
        dispatch(ResourceSubmitAction({
            workorder_id: workOrderId,
            org_id: organization,
            // entitie_id: empId,
            entitie_id: empId != '' ? empId : "0",
            resource_id: resCodeId,
            // operation_code: operationCode,
            operation_code: operationCode != '' ? operationCode : "0",
            transaction_date: date != null ? date : "0",
            num_of_hrs: hrsUsed,
            resource_cost_actual: "",
            resource_cost_calculation_date: "",
            workorder_no: workOrderNo != '' ? workOrderNo : "0",
            comments: comment != '' ? comment : "0",
        }));
    }
    // console.log("LineOrganization:", lineOrganization, "Transaction Date:", date, "Workorder :", workOrder, "Organization:", organization)

    // console.log("Workorder :", workOrder,)
    // console.log("WorkorderCode :", workOrderCode,)
    // console.log("Organization :", organization, "Transaction Date :", date, "Workorder :", workOrderNo, "operationCode:", operationCode, "Resource Code:", resCodeNo, "Entity Name:", entityName, "Entity Code :", entityCode, "Hrs Used: ", hrsUsed, "Comments:", comment)    
    return (
        <SafeAreaView style={{ flex: 1 }}>
            {
                workOrderState.isLoading && (
                    <View style={{ flex: 1, position: "absolute", zIndex: 2, left: 0, width: "100%", justifyContent: "center", height: "100%", justifyContent: 'center', alignItems: "center", backgroundColor: "rgba(255,255,255,0.4)" }}>
                        <View style={{
                            backgroundColor: "#000", paddingHorizontal: 15, paddingVertical: 15, borderRadius: 5, shadowOffset: {
                                width: 0,
                                height: 3,
                            },
                            shadowOpacity: 0.12,
                            shadowRadius: 4.65,
                            elevation: 6,
                        }}>
                            <ActivityIndicator size="large" color="#1788F0" />
                        </View>
                    </View>
                )
            }
            <View style={styles.mainWrapper}>
                {
                    isSectionShow && (
                        <>
                <HeaderTextLeft title={"Create New Resource "} goBack={goBack} fontSize={25} />
                        </>
                    )
                }
                <ScrollView style={{ flex: 1 }}>
                    {
                        isSectionShow ? (
                            <>
                                <View style={{ width: "100%", paddingHorizontal: 5, position: "relative", marginTop: 20 }}>
                        <OrganizatinSearchCom organization={organization} setOrganization={setOrganization} customerId={customerId} />
                                </View>
                    <View style={{ width: "100%", paddingHorizontal: 5, position: "relative", marginTop: 20 }}>
                                    <Text style={{ color: "#000", fontSize: 15, marginBottom: 5, fontWeight: "700" }}>TRANSACTION DATE</Text>
                        <View style={[styles.dateWrapper, { backgroundColor: "#e1e2e3", fontSize: 15, color: "#000", paddingHorizontal: 12, height:46 }]}>
                            <View style={styles.dateRow}>
                                <View style={[styles.box1,]}>
                                    <TouchableOpacity onPress={showDatePicker} style={{ height: 30, backgroundColor: "#e1e2e3" }}>
                                        <Fontawesome name="calendar" color="#000" size={16} style={{ position: "absolute", top: 14, right: 10 }} />
                                    </TouchableOpacity>
                                </View>
                                <View style={[styles.box2,]}>
                                                <TextInput
                                                    value={getTransDate()}
                                                    style={{height:46}}
                                                    placeholder="Select Date"
                                    />
                                </View>
                            </View>
                            <DateTimePickerModal
                                isVisible={isDatePickerVisible}
                                mode="date"
                                onConfirm={handleConfirm}
                                            onCancel={hideDatePicker}
                            />
                        </View>
                    </View>
                                {/* Work Order */}
                    <View style={{ width: "100%", paddingHorizontal: 5, position: "relative", marginTop: 20 }}>
                                    <Text style={{ color: "#000", fontSize: 15, marginBottom: 5, fontWeight: "700" }}>WORK ORDER</Text>
                        <View style={styles.picker}>
                        <Picker
                                note
                                mode="dropdown"
                                selectedValue={workOrderId}
                                style={{                                    
                                    width: "100%",
                                }}
                                            dropdownIconColor="#000"
                                onValueChange={(value, index) => {
                                    setWorkOrderId(value)
                                                handleOpen(value)
                                                WorkOrderNum(value)
                                            }
                                            }>
                                            <Picker.Item label={"Select Work Order"} key={"0"} value={''} />
                                            {workOrderData()}
                                        </Picker>
                                    </View>
                                    {workOrderId === '' ? <Fontawesome name="star" color="#FF0000" size={8} style={{ position: "absolute", top: 5, left: 110, zIndex:9 }} /> : undefined}
                                </View>
                                <View style={{ width: "100%", paddingHorizontal: 5, position: "relative", marginTop: 20 }}>
                                    <Text style={{ color: "#000", fontSize: 15, marginBottom: 5, fontWeight: "700" }}>OPERATION CODE </Text>
                                    <TextInput editable={false} selectTextOnFocus={false} name="OperationCode" defaultValue='' placeholderTextColor="#1a1a1a" value={operationCode} style={{ backgroundColor: "#e1e2e3", fontSize: 15, color: "#000", paddingHorizontal: 12, height:46 }} />
                                </View>
                                {/* ResourceCode */}
                                <View style={{ width: "100%", paddingHorizontal: 5, position: "relative", marginTop: 20 }}>
                                    <Text style={{ color: "#000", fontSize: 15, marginBottom: 5, fontWeight: "700" }}>RESOURCE CODE</Text>
                                    <View style={styles.picker}>
                                        <Picker
                                            note
                                            mode="dropdown"
                                            selectedValue={resCodeId}
                                            style={{
                                                
                                                width: "100%",
                                            }}
                                            dropdownIconColor="#000"
                                            onValueChange={(value, index) => {
                                                setrResCodeId(value)
                                                resCodeHandleOpen(value)
                                                ResourceCodeNum(value)
                                            }
                                            }
                                        >
                                            <Picker.Item label={"Select Resource Code"} key={"0"} value={''} />
                                            {resoCodeData()}
                                        </Picker>
                        </View>
                                    {resCodeId === '' ? <Fontawesome name="star" color="#FF0000" size={8} style={{ position: "absolute", top: 5, left: 128 }} /> : undefined}
                    </View>
                                <View style={{ width: "100%", paddingHorizontal: 5, position: "relative", marginTop: 20 }}>
                                    <Text style={{ color: "#000", fontSize: 15, marginBottom: 5, fontWeight: "700" }}>ENTITY NAME </Text>
                                    <TextInput editable={false} selectTextOnFocus={false} name="EntityName" defaultValue='' placeholderTextColor="#1a1a1a" value={entityName} style={{ backgroundColor: "#e1e2e3", fontSize: 15, color: "#000", paddingHorizontal: 12, height:46 }} />
                                </View>
                                <View style={{ width: "100%", paddingHorizontal: 5, position: "relative", marginTop: 20 }}>
                                    <Text style={{ color: "#000", fontSize: 15, marginBottom: 5, fontWeight: "700" }}>ENTITY CODE </Text>
                                    <TextInput editable={false} selectTextOnFocus={false} name="EntityCode" defaultValue='' placeholderTextColor="#1a1a1a" value={entityCode} style={{ backgroundColor: "#e1e2e3", fontSize: 15, color: "#000", paddingHorizontal: 12, height:46 }} />
                                </View>
                                {/* HRS USED*/}
                                <View style={{ width: "100%", paddingHorizontal: 5, position: "relative", marginTop: 20 }}>
                                    <Text style={{ color: "#000", fontSize: 15, marginBottom: 5, fontWeight: "700" }}>HRS.USED</Text>
                                    <TextInput selectTextOnFocus={false} name="HrsUsed" defaultValue='' placeholderTextColor="#1a1a1a" value={hrsUsed} onChangeText={(e) => { setHrsUsed(e) }} style={{ backgroundColor: "#e1e2e3", fontSize: 15, color: "#000", paddingHorizontal: 12, height:46 }} />
                                    {hrsUsed === '' ? <Fontawesome name="star" color="#FF0000" size={8} style={{ position: "absolute", top: 5, left: 80 }} /> : undefined}
                                </View>
                                {/* Coments*/}
                    <View style={{ width: "100%", paddingHorizontal: 5, position: "relative", marginTop: 20 }}>
                                    <Text style={{ color: "#000", fontSize: 15, marginBottom: 5, fontWeight: "700" }}>COMMENTS</Text>
                                    <TextInput selectTextOnFocus={false} name="Comments" defaultValue='' placeholderTextColor="#1a1a1a" value={comment} onChangeText={(e) => { setComment(e) }} style={{ backgroundColor: "#e1e2e3", fontSize: 15, color: "#000", paddingHorizontal: 12, height:46 }} />
                                </View>
                                <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                                    <View>
                                        <TouchableOpacity disabled={btnDisabled} style={[styles.btnSubmit, { backgroundColor: btnDisabled ? "#9d9d9d" : "#2a9df4" }]} onPress={() => handleResourceSubmit()}>
                                            <Text style={{ color: "#FFF" }}>Save</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ marginleft: 20, paddingLeft: 5 }}>
                                        <Pressable style={[styles.btnSubmit, { backgroundColor: "#e64400", }]}
                                            onPress={() => { navigation.navigate('ResourceTransactionSearch'), navigation.popToTop(), dispatch({ type: "RESOURCE_SUBMIT_RESET" }) }}>
                                            <Text style={{ color: "#fff" }} > Cancel</Text>
                                        </Pressable>
                                    </View>
                                </View>
                            </>) : (
                            <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center", marginTop: 100 }}>
                                <View>
                                    <Text style={{ color: "#000", fontSize: 16, fontWeight: "700" }}>Resource Created Successfully</Text>
                                    <TouchableOpacity style={[styles.btnSubmit, { backgroundColor: "#2a9df4" }]} onPress={() => { navigation.navigate('ResourceTransactionSearch'), navigation.popToTop(), dispatch({ type: "RESOURCE_SUBMIT_RESET" }) }}>
                                        <Text style={{ color: "#FFF", fontSize: 18, fontWeight: "600", textTransform: "uppercase" }}>Home</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                        )
                    }
                </ScrollView>
            </View>
            {/* //Modal */}
            <View style={[styles.centeredView, { backgroundColor: modalVisible ? "rgba(0,0,0,0.5)" : "transparent", display: modalVisible ? "flex" : "none" }]}>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={(index) => {
                        setModalVisible(!modalVisible);
                    }} >
                    <View style={{ flex: 1, alignItems: "center", flexDirection: "column", justifyContent: "center" }}>
                        <View style={styles.modalView}>
                            <TouchableOpacity onPress={() => handleCloseWorkOrder()} style={{ position: "absolute", right: -10, top: -10, zIndex: 99, backgroundColor: "#FFF", borderRadius: 40, overflow: "hidden" }}><MaterialCommunityIcons size={35} color="red" name="close-circle" /></TouchableOpacity>
                            <View style={[styles.borderHeader, { flexDirection: "row", justifyContent: "flex-start" }]}>
                                <Text style={{ color: "#808080", fontSize: 20, fontWeight: "700", marginBottom: 5 }}>{workOrderNo}</Text>
                            </View>
                            <View style={{ flexDirection: "row", justifyContent: "center" }}>
                                {/* <RadioButton gender={gender} /> */}
                                {modalTableData()}
                            </View>
                            <View>
                            </View>
                            <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                                <View>
                                    <Pressable style={[styles.btnSubmit, { backgroundColor: "#2a9df4" }]}
                                        onPress={() => { handleSelect() }}>
                                        <Text style={{ color: "#fff" }}>Select</Text>
                                    </Pressable>
                                </View>

                                <View style={{ marginleft: 20, paddingLeft: 5 }}>
                                    <Pressable style={[styles.btnSubmit, { backgroundColor: "#e64400", }]}
                                        onPress={() => { handleClose() }}>
                                        <Text style={{ color: "#fff" }} > Close</Text>
                                    </Pressable>
                                </View>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View >
            {/* //RESCODE_Modal */}
            <View style={[styles.centeredView, { backgroundColor: resCodeModalVisible ? "rgba(0,0,0,0.5)" : "transparent", display: resCodeModalVisible ? "flex" : "none" }]}>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={resCodeModalVisible}
                    onRequestClose={(index) => {
                        setResCodeModalVisible(!resCodeModalVisible);
                    }}>
                    <View style={{ flex: 1, alignItems: "center", flexDirection: "column", justifyContent: "center" }}>
                        <View style={styles.modalView}>
                            <TouchableOpacity onPress={() => handleCloseResourceCode()} style={{ position: "absolute", right: -10, top: -10, zIndex: 99, backgroundColor: "#FFF", borderRadius: 40, overflow: "hidden" }}><MaterialCommunityIcons size={35} color="red" name="close-circle" /></TouchableOpacity>
                            <View style={[styles.borderHeader, { flexDirection: "row", justifyContent: "flex-start" }]}>
                                <Text style={{ color: "#808080", fontSize: 20, fontWeight: "700", marginBottom: 5 }}> Resurce Code - {resCodeNo}</Text>
                            </View>
                            <View style={{ flexDirection: "row", justifyContent: "center" }}>
                                {/* <RadioButton gender={gender} /> */}
                                {resCodeModalTableData()}
                            </View>
                            <View>
                            </View>
                            <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                                <View>
                                    <Pressable style={[styles.btnSubmit, { backgroundColor: "#2a9df4" }]}
                                        onPress={() => { handleSelect() }}>
                                        <Text style={{ color: "#fff" }}>Select</Text>
                                    </Pressable>
                                </View>
                                <View style={{ marginleft: 20, paddingLeft: 5 }}>
                                    <Pressable style={[styles.btnSubmit, { backgroundColor: "#e64400", }]}
                                        onPress={() => { handleClose() }}>
                                        <Text style={{ color: "#fff" }} > Close</Text>
                                    </Pressable>
                                </View>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View >
        </SafeAreaView>
    )
}

var styles = StyleSheet.create({
    mainWrapper: {
        flex: 1,
        backgroundColor: '#FFF',
        paddingTop: 30,
        paddingBottom: 10,
        paddingHorizontal: 20
    },
    btnSubmit: {
        borderRadius: 3,
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 30,
        paddingHorizontal: 9,
        paddingVertical: 7,
        color: "#ffffff",
    },
    dateRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginHorizontal: -5
    },
    box1: {
        width: "9%",
    },
    box2: {
        width: "50%",
    },
    input: {
        width: "100%",
        height: 30,
        paddingHorizontal: -4,
        paddingVertical: 2,
        fontStyle: "italic",
        backgroundColor: "#e1e2e3",
        color: "#000"
    },
    conInput: {
        backgroundColor: "#e1e2e3", fontSize: 15, color: "#000", paddingHorizontal: 12
    },
    listItem: {
        fontSize: 15,
        padding: 0
    },
    modalView: {
        width: "95%",
        margin: 0,
        flexDirection: "column",
        backgroundColor: "white",
        borderRadius: 10,
        paddingHorizontal: 5,
        paddingVertical: 15,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    },
    centeredView: {
        width: "100%",
        height: "100%",
        position: "absolute",
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    tableContainer: {
        flex: 1,
        padding: 2,
        paddingTop: 2,
        backgroundColor: "#F2F2F2"
    },
    content: {
        borderColor: "#ccc",
        borderWidth: 0.4,
        paddingHorizontal: 2,
        paddingVertical: 2
    },
    tableHeader: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center"
    },
    input: {
        height: 30,
        margin: 12,
        borderWidth: 1,
        padding: 10
    },
    tableList: {
        display: "flex",
        flexDirection: "column"
    },
    tableRowMain: {
        display: "flex",
        flexDirection: "row",
        borderColor: "#ccc",
        borderWidth: 1,
        padding: 5
    },
    tableRow: {
        display: "flex",
        flexDirection: "row",
        padding: 5,
        borderBottomColor: "#ccc",
        borderBottomWidth: 1
    },
    tableCell: {
        width: "20%",
        display: "flex",
        alignItems: "center"
    },
    img: {
        height: 20,
        width: 20,
        marginHorizontal: 5,
    },
    picker: {
        flex: 1,
        backgroundColor: "#e1e2e3",
        justifyContent: "center",
        padding: 5,
    },

});
export default AddResourceTransaction