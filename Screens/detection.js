import { StatusBar } from "expo-status-bar";
import * as React from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import{Camera} from 'expo-camera'

export default class Detection extends React.Component {
  state = {
    image: null,
  };

  getPermission = async () => {
    if (Platform.OS !== "web") {
      const { status } = await Camera.requestPermissionsAsync();
      if (status != "granted") {
        alert("Permission Denied");
      }
    }
  };

  componentDidMount() {
    this.getPermission();
  }

  pickimage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.cancelled) {
        this.setState({
          image: result.data,
        });
        this.uploadImage(result.uri);
      }
    } catch (E) {
      console.log(E);
    }
  };

  uploadImage = async (uri) => {
    const data = new FormData();
    let fileName = uri.split("/")[uri.split("/").length - 1];
    let type = `image/${uri.split(".")[uri.split(".").length - 1]}`;
    const fileToUpload = {
      uri: uri,
      fileName: fileName,
      type: type,
    };
    data.append("digit", fileToUpload);
    fetch("http://8142-2405-201-2-40f4-309b-edc7-1968-2430.ngrok.io", {
      method: "POST",
      body: data,
      headers: {
        "content-type": "multipart/form-data",
      },
    })
      .then((response) => {
        response.json();
      })
      .then((result) => {
        alert("Image Uploaded")
      })
      .catch((error) => {
        console.log(error);
      });
  };
  render() {
    let { image } = this.state;
    return (
      <View style={styles.container}>
        <Text>PICK AN IMAGE</Text>
        <TouchableOpacity style={{backgroundcolor:"Blue"}} onPress={()=>{this.pickimage()}}>
          <Text style={{color:"Black"}}>Select</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});