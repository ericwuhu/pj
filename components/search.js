import React, { useEffect, useState } from 'react';
import { Text, View, TextInput, ActivityIndicator, FlatList, Button, SafeAreaView, Image } from 'react-native'; // 
import styles from '../Style';
import * as Location from 'expo-location'; // Used to ask user for location

const Search = () => {

    // Variables
    // API data
    const [weather, setWeather] = useState([])
    const [resturants, setResturants] = useState([])

    // API keys
    const yelpFustionAPIKey = 'dobn60rTc2HtHN-N6qf5EQUd2fiKCrW4KOCYJPJKfWh6r9zlZ-VENmJDyTRjl3NAN5ZOgbsU3LWk7K8Q420YsV6YlYJ8wgobns1Puy3l8EXi45tEwZWrq99riFqzYnYx'
    const weatherAPIKey = 'dab7f57ce9c6486e983182326211606'

    // Loading and error checking for the api
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    
    // tempLocation allows user to type, while location is what is searched
    const [tempLocation, setTempLocation] = useState([])
    const [location, setLocation] = useState('waltham')

    const getWeather = async () => {
        try {
            const response = await fetch("http://api.weatherapi.com/v1/current.json?key=" + weatherAPIKey + "&q="+location+"&aqi=no");
            const json = await response.json();
            setWeather(json); // Setting the weather data

            setError(false)
        } catch (error) {
            console.error(error);
            setError(true)
        } finally {
            setLoading(false);
        }
    }

    const getResturants = async () => {
        try {
            const response = await fetch("https://yelp-backend.netlify.app/.netlify/functions/search?location=" + location + "&term=food");
            const json = await response.json();
            setResturants(json.businesses); // Setting the resturant data

            setError(false)
        } catch (error) {
            console.error(error);
            setError(true)
        } finally {
            setLoading(false);
        }
    }

    // // Get resturants, code taken from postman
    // const getResturants = async () => {
    //     var myHeaders = new Headers();
    //     myHeaders.append("Authorization", "Bearer " + yelpFustionAPIKey);

    //     var requestOptions = {
    //     method: 'GET',
    //     headers: myHeaders,
    //     redirect: 'follow'
    //     };

    //     try{
    //     const response = await fetch("https://api.yelp.com/v3/businesses/search?latitude=" + latitude + "&longitude=" + longitude, requestOptions)
    //     .then(response => response.text())
    //     .then(result => console.log(result))
    //     .catch(error => console.log('error', error));

    //     const json = await response.json();
    //     setResturants(json); // Setting the resturant data
    //     setError(false)

    //     }catch (error) {
    //         console.error(error);
    //         setError(true)
    //     } finally {
    //         setLoading(false);
    //     }
    // }

    // Ask user for location
    useEffect(() => {
        (async () => {
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
            return;
          }
    
          let phoneLocation = await Location.getCurrentPositionAsync({});
          console.log(phoneLocation);
          setLocation(phoneLocation.coords.latitude + "," + phoneLocation.coords.longitude)
        })();
      }, []);

    useEffect(() => { getWeather() }, [location]) // Update weather when location is changed

    useEffect(() => {getResturants()}, [weather])
    return (

        <SafeAreaView style = {styles.container}>
            <Text>Welcome to Explorer!</Text>
            <Text>Enter a location to find the weather</Text>
            <TextInput
                style={{ height: 80 }}
                placeholder="Enter your location"
                onChangeText={
                    newText => setTempLocation(newText)
                }
            />

            <Button
                title="Search"
                onPress={() => {
                    setLocation(tempLocation);
                }}
            />

            
            {/* <Text>{location}</Text> */}
            <Text>In {JSON.stringify(weather.location?.name)}, it's currently {JSON.stringify(weather.current?.temp_f)} °F ({JSON.stringify(weather.current?.temp_c)} °C) and {JSON.stringify(weather.current?.condition.text)}</Text>
            
            {console.log("Display Flatlist")}
            
            <FlatList
                data={resturants}
                keyExtractor={({ id }, index) => id}
                renderItem={({ item }) => (
                    // Safe view to show image on right
                    <SafeAreaView style = {styles.splitscreen}> 
                        
                        <View>
                            <a href={item.url}>{item.name}</a>
                            <Text>{item.location.address1} {item.location.city} {item.location.state}</Text>
                        </View>
                            

                        <Image 
                            style={styles.pic}
                            source={{uri: item.image_url}} 
                        />
                        
                        
                    </SafeAreaView>
                    
                )}
            /> 
            

            {/* <Text>{JSON.stringify(resturants)}</Text> */}
        </SafeAreaView>
    )
}

export default Search