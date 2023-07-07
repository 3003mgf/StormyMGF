import React from 'react';
import axios from "axios";
import { apiKey } from '../constants';

const forecastEndpoint = (params) => `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${params.city}&days=7&aqi=no&alerts=no`
const locationsEndpoint = (params) => `https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${params.city}`


const apiCall = async(endpoint) =>{
  const options = {
    method: "GET",
    url: endpoint
  };

  try{
    const response = await axios.request(options);

    return response.data;

  }catch(error){
    console.log("ErrorMGF", error);
    return null;
  }
}



export const fetchWeather = (params) =>{
  return apiCall(forecastEndpoint(params));
}


export const fetchLocations = (params) =>{
  return apiCall(locationsEndpoint(params));
}