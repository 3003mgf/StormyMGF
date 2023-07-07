import AsyncStorage from "@react-native-async-storage/async-storage";

export const storeData = async(key, value) =>{
  try{
    await AsyncStorage.setItem(key, value);
  }catch(error){
    console.log("Error storing the value", error);
  }
};


export const getData = async(key) =>{
  try{
    const getValue = await AsyncStorage.getItem(key);
    return getValue;
  }catch(error){
    console.log("Error retrieving the value", error);
  }
}