import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useState } from 'react';
import { Image, LogBox, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { theme } from '../theme';
import { AntDesign } from '@expo/vector-icons'; 
import { FontAwesome5 } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { debounce } from "lodash";
import { fetchLocations, fetchWeather } from '../api/weather';
import { weatherImages } from '../constants';
import * as Progress from "react-native-progress";
import { getData, storeData } from '../utils/asyncStorage';

export default function HomeScreen () {

  const [showSearch, setShowSearch] = useState(false);
  const [locations, setLocations] = useState([]);
  const [weather, setWeather] = useState([]);
  const [loading, setLoading] = useState(false);


  const handleLocation = (loc) =>{
    setShowSearch(false);
    setLoading(true);
    fetchWeather({city: loc}).then(data =>{
      setWeather(data);
      setLoading(false);
      storeData("city", loc)
    })
  };
  
  const handleSearch = (value) =>{
    if(value.length > 2){
      fetchLocations({city: value}).then(data => {
        setLocations(data);
      })
    };
    if(value.length === 0){
      setLocations([]);
    }
  };

  useEffect(() => {
    if(!showSearch){
      setLocations([]);
    }
  }, [showSearch]);

  useEffect(() => {
    setLoading(true);
    firstFetchWeather();
  }, []);


  const firstFetchWeather = async()=>{
    let cityFromStorage = await getData("city");
    let city = "Tucuman, Argentina";
    if(cityFromStorage && cityFromStorage.length > 0) city = cityFromStorage;

      fetchWeather({city})
      .then(data =>{
        setWeather(data);
        setLoading(false)
      })
  };
  
  const handleTextDebounce  = useCallback(debounce(handleSearch, 700), []); 
  // Empty array so its triggered only one time

  const { current, location, forecast } = weather;

  return ( 
    <View className="flex-1 relative">
      <StatusBar style="light"/>
      <Image
        blurRadius={70} 
        source={require('../assets/images/bg.png')}
        className="absolute h-full w-full"
      />
      {loading ?
        <View className="flex-1 flex-row justify-center items-center">
          <Progress.CircleSnail thickness={10} size={70} color={"whitesmoke"}/>
        </View>
        :
        <SafeAreaView className="flex flex-1">
          {/* NavBar */}
          <View style={{height:"7%"}} className="mx-4 mt-14 relative z-50">
            <View 
              className="flex-row justify-end items-center rounded-full"
              style={{backgroundColor: showSearch ? theme.bgWhite(0.2) : "transparent"}}>
                {
                  showSearch ? (
                    <TextInput 
                      onChangeText={handleTextDebounce}
                      placeholder='Search City' 
                      placeholderTextColor={"lightgray"}
                      className="pl-6 pb-1 h-10 flex-1 text-base text-white"
                    />
                  )
                  :
                  null
                }
              <TouchableOpacity 
                style={{backgroundColor: theme.bgWhite(0.3)}} 
                className="rounded-full p-2 m-1"
                onPress={()=> setShowSearch(!showSearch)}
                >
                <AntDesign name="search1" size={25} color="white" />
              </TouchableOpacity>
            </View>
              {
                (locations.length > 0 && showSearch) ? (
                  <View className="absolute w-full bg-gray-300 top-16 rounded-3xl">
                    {
                      locations.map((el, index) =>{
                        return (
                          <TouchableOpacity 
                            onPress={()=> handleLocation(`${el.name}, ${el.country}`)}
                            key={index} 
                            className={`flex-row items-center border-0 p-3 px-4 mb-1 ${index + 1 < locations.length && "border-b-2 border-b-gray-400"}`}
                          >
                            <FontAwesome5 name="map-marker-alt" size={20} color="gray" />
                            <Text name="cityValue" className="text-black ml-2">{`${el?.name}, ${el?.country}`}</Text>
                          </TouchableOpacity>
                        )
                      })
                    }
                  </View>
                )
                :
                null
              }
          </View>

          {/* FORECAST */}
          <View className="mx-4 flex justify-around flex-1 mb-2">
              {/* Location */}
              <View className="flex gap-2">
                <Text className="text-2xl font-bold text-white text-center">
                  {location?.name && location.name}
                </Text>
                <Text className="text-lg text-center font-semibold text-gray-300">
                  {location?.country && location?.country}
                </Text>
              </View>

              {/* Image */}
              <View className="flex-row justify-center">
                <Image
                  source={weatherImages[current?.condition?.text] || weatherImages.other}
                  className="w-52 h-52"
                />
              </View>

              {/* Degrees */}
              <View className="space-y-2">
                <Text className="text-center font-bold text-white text-6xl ml-5">
                  {current?.temp_f && Math.round(((current?.temp_f - 32)*5) / 9)}&#176;
                </Text>
                <Text className="text-center text-white text-xl ml-5 tracking-widest">
                  {current?.condition?.text && current.condition.text}
                </Text>
              </View>

              {/* Other */}
              <View className="flex-row justify-between mx-4">
                <View className="flex-row space-x-2 items-center">
                  <Image
                    source={require("../assets/icons/wind.png")}
                    className="h-6 w-6"
                  />
                  <Text className="text-white font-semibold text-base">
                    {current?.wind_kph + " km"}
                  </Text>
                </View>
                <View className="flex-row space-x-2 items-center">
                  <Image
                    source={require("../assets/icons/drop.png")}
                    className="h-6 w-6"
                  />
                  <Text className="text-white font-semibold text-base">
                    {current?.humidity + "%"}
                  </Text>
                </View>
                <View className="flex-row space-x-2 items-center">
                  <Image
                    source={require("../assets/icons/sun.png")}
                    className="h-6 w-6"
                  />
                  <Text className="text-white font-semibold text-base">
                    {forecast?.forecastday[0].astro.sunrise}
                  </Text>
                </View>
              </View>
          </View>

          {/* Next Days */}
          <View className="mb-2 space-y-3">
            <View className="flex-row items-center mx-5 space-x-2">
              <Ionicons name="ios-calendar" size={24} color="white" />
              <Text className="text-white text-base">Daily Forecast</Text>
            </View>
            <ScrollView
              horizontal
              contentContainerStyle={{paddingHorizontal:15}}
              showsHorizontalScrollIndicator={false}
            >
              {
                weather?.forecast?.forecastday?.map((el, index) => {
                  
                  let date = new Date(el.date);
                  let options = {weekday: "long"};
                  let getDay = date.toLocaleDateString("en-US", options);
                  let dayName = getDay.split(",")[0];
                  if(index > 1){
                    return (
                      <View
                        key={index}
                        className="flex justify-center items-center w-24 rounded-3xl py-3 space-y-1 mr-4"
                        style={{backgroundColor: theme.bgWhite(0.15)}}
                        >
                        <Image source={weatherImages[el.day.condition.text] || weatherImages.other} className="h-11 w-11"/>
                        <Text className="text-white">{dayName}</Text>
                        <Text className="text-white text-xl font-semibold">
                          {Math.round(((el.day.avgtemp_f - 32) * 5) / 9)}&#176;
                        </Text>
                      </View>
                    )
                  }
                })
              }
        
            </ScrollView>
          </View>
        </SafeAreaView>
      }
    </View>
   );
}
 