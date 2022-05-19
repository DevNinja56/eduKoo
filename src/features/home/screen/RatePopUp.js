import React from 'react'
import { View, Text, TouchableOpacity, Image, ImageBackground, Modal, StyleSheet, Dimensions } from 'react-native'

const PopUp = (props) => {

    const width = Dimensions.get('window').width
    const height = Dimensions.get('window').height

    return (
        <Modal
            visible={props.isVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => console.log('close')}
        >
            <View style={styles.container}>
                <View style={styles.innerModal}>
                    <TouchableOpacity
                        onPress={props.onCloseClick}
                        style={styles.closeBtn}>
                        <Image
                            source={require('../../../assets/images/rateApp/icon-close.png')}
                            style={{
                                width: 25,
                                height: 25,
                            }}
                        />
                    </TouchableOpacity>
                    <Text style={styles.title}>
                        {props.title}
                    </Text>
                    <Text style={[styles.title, {
                        fontFamily: "pt_sans-web-regular",
                        color: "#ac75c9",
                        marginTop: 10
                    }]}>
                        {props.description}
                    </Text>

                    <View style={styles.row}>
                        <TouchableOpacity
                            onPress={props.onDownClick}
                            style={styles.rateBtn}>
                            <Image
                                source={require('../../../assets/images/rateApp/icon-thumb-down.png')}
                                style={{
                                    width: 50,
                                    height: 50
                                }}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={props.onUpClick}
                            style={[styles.rateBtn,{
                                marginLeft:20
                            }]}>
                            <Image
                                source={require('../../../assets/images/rateApp/icon-thumb-up.png')}
                                style={{
                                    width: 50,
                                    height: 50
                                }}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(47, 4, 68, 0.8)'
    },
    innerModal: {
        width: Dimensions.get('window').width - 110,
        height: Dimensions.get('window').height / 2 - 110,
        alignSelf: "center",
        backgroundColor: "#220431"
    },
    closeBtn: {
        position: "absolute",
        right: "5%",
        top: "6%",
        width: 25,
        height: 25,
        zIndex: 3
    },
    title: {
        marginLeft: 20,
        marginTop: 30,
        fontSize: 22,
        fontFamily: "pt_sans-web-bold",
        color: "#fff"

    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        justifyContent: "center",
        marginTop: 40
    },
    rateBtn: {
        backgroundColor: "#2f0047",
        borderColor: "#c44fff",
        width: 110,
        height: 120,
        borderWidth: 1,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
    }
})

export default PopUp;