import React, { Component } from 'react';
import {Button, Platform, StyleSheet, Text, View , Image } from 'react-native';
import * as Location from "expo-location";
import { Constants } from 'react-native-unimodules';
import * as Permissions from "expo-permissions";
import axios from "axios";

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' + 'Shake or press menu button for dev menu',
});

export default class App extends Component {
  
  constructor(props){
    super(props);
    this.state = {
      latitude: null,
      longitude: null,
      errorMessage: null,
      locationName: "loading...",
      locationTempeature: "",
      temperatureIcon: "http://openweathermap.org/img/wn/01d@2x.png",
      lastReport: "..."
    }
  }

  getWeather = () => {
    let api= "https://api.openweathermap.org/data/2.5/weather?";
    let appid = "a294e99fa4b91f5545b30867425ea426";
    let lat = "lat="+ this.state.latitude;
    let long = "&lon="+ this.state.longitude;
    let uri = api + lat + long + "&units=metric" + "&appid=" + appid;

    let date = new Date();
    let currentTime = date.getHours() + ":" + date.getMinutes()

    axios.get(uri).then(res => {
      let weather = res.data;
      this.setState({locationName: weather.name,locationTempeature: weather.main.temp,
        temperatureIcon: "http://openweathermap.org/img/wn/" + weather.weather[0].icon + "@2x.png",
        lastReport: currentTime
      });
        
      }).catch((err)=> {console.log(err);
        this.setState({locationName:"could not fetch data"})});
    
    

  }

  async componentDidMount(){
      if(Platform.OS ==="android" && !Constants.isDevice){
        this.setState({
          errorMessage: "Oops you have to try in web!"
        });
      }else{
        await this._getLocationAsync();
        this.getWeather();

      }
  }
  
  _getLocationAsync = async () => {
    let {status} = await Permissions.askAsync(Permissions.LOCATION);
    if(status !== "granted"){
      this.setState({
        errorMessage:"You have to enable location permissions for the app to work"
      })
    }

    let location = await Location.getCurrentPositionAsync({});
    this.setState({latitude: location.coords.latitude,longitude: location.coords.longitude});
    
  }

  render() {
    let location = "";
    let currentTemp = Math.round(this.state.locationTempeature);
    if(this.state.errorMessage){
      location = this.state.errorMessage;
    }

    return (
      <View style={styles.container}>
        <Image style={{width:150,height:150}} source={{uri:this.state.temperatureIcon}}></Image>
        <Text style={styles.temperature}>{currentTemp} °C</Text>
        <Text>{location}{this.state.locationName}</Text>
        <View style={styles.btn}>
          <Button onPress={this.getWeather} color="#B2C9AB"  title="Refresh"/>
          <Text style={{marginTop: 10, width: 200,marginLeft: -10}}>Last Report: {this.state.lastReport}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#92B6B1',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  temperature: {
    textAlign: 'center',
    color: '#333333',
    fontSize: 50,
    marginBottom: 5,
  },
  btn:{
    marginTop: 20,
    width: 100
  }
});
