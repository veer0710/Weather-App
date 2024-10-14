import React, { Component } from 'react'
// import Leafletlibrary from 'leaflet'
import { MapContainer, TileLayer } from 'react-leaflet'
import Spinnner from './Spinnner'

export default class Weather extends Component {

  constructor(props) {
    super(props)
    this.state = {
      weatherData: {}, /*setting state to fetch data from main api*/
      date: new Date(), /*setting state to get current date and time*/
      loading: false, /*setting state for spinner*/
      AirpollutionData: [], /*setting state to fetch AQI*/
      apiRaw: null, /*setting state to convert AQI into EPA value*/
      EPAAQI: null, /*setting state to convert AQI into EPA value*/

    }
  }

  async componentDidMount() {
    // Fetching Main API
    let api = 'https://api.openweathermap.org/data/2.5/weather?q=New Delhi,07,IN&units=metric&APPID=5e35f40b4b7e3f73fcbdc9bbb6d1be87'
    this.setState({ loading: true })
    let data = await fetch(api)
    let parsedata = await data.json()
    // console.log(parsedata)
    this.setState({
      weatherData: parsedata,
      loading: false,
    })
    // This is for current date & time
    this.timerID = setInterval(() => this.tick(), 1000)

    // AIR POLLUTION CODE START
    const latitude = parsedata.coord.lat;
    const longitude = parsedata.coord.lon;
    // Api of air pollution
    let pollutionapi = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${latitude}&lon=${longitude}&appid=5e35f40b4b7e3f73fcbdc9bbb6d1be87`
    let pollutiondata = await fetch(pollutionapi)
    let pollutionparsedata = await pollutiondata.json()
    console.log(pollutionparsedata)
    this.setState({
      AirpollutionData: pollutionparsedata.list,
    })

    //API conversion
    const apiRaw = pollutionparsedata.list[0] && pollutionparsedata.list[0].main && pollutionparsedata.list[0].main.aqi
    const EPAAQI = this.convertToEPA(apiRaw)
    this.setState({ apiRaw, EPAAQI })

  }

  // This is for current date & time
  tick() {
    this.setState({
      date: new Date()
    })
  }

  /*function to convert AQI into EPA value*/
  convertToEPA(apiRaw) {
    let EPAAQI;
    switch (apiRaw) {
      case 1:
        EPAAQI = Math.floor(Math.random() * (50 - 0 + 1)) + 0;  // Range: 0-50)
        break;

      case 2:
        EPAAQI = Math.floor(Math.random() * (100 - 51 + 1)) + 51;  // Range: 51-100)
        break;

      case 3:
        EPAAQI = Math.floor(Math.random() * (150 - 101 + 1)) + 101;  // Range: 101-150)
        break;

      case 4:
        EPAAQI = Math.floor(Math.random() * (200 - 151 + 1)) + 151;  // Range: 151-200)
        break;

      case 5:
        EPAAQI = Math.floor(Math.random() * (500 - 201 + 1)) + 201;  // Range: 151-200)
        break;

      default:
        EPAAQI = "Unavailable";
    }
    return EPAAQI;
  }

  
  handleprev(){
    let box = document.querySelector('.carousel')
    let width = box.clientWidth
    box.scrollLeft = box.scrollLeft - width
  }

  handlenext(){
    let box = document.querySelector('.carousel')
    let width = box.clientWidth
    box.scrollLeft = box.scrollLeft + width
  }

  render() {
    const { weatherData } = this.state
    const iconUrl = `https://openweathermap.org/img/wn/${weatherData.weather && weatherData.weather[0].icon}@4x.png`;
    const { EPAAQI } = this.state

    return (
      <>
        {this.state.loading && <Spinnner />} {/* Implementing spinner*/}

        <div className='container' id='bodystyle' >
          <h1 className='text-center my-5' id='todayweather'>Today's Weather</h1>

          {/* WEATHERCARD START */}
          <div className='row my-5' id='weathercardstart'>
            {/* leftside card(all the info card of weather) */}
            <div className='' id='Weathercarddiv'>
              <p id='current-weather'>Current weather</p>
              <div id='date-time' className='d-flex justify-content-between'>
                <p id='city-country'>{weatherData.name}, {" "}
                  {weatherData.sys && weatherData.sys.country}</p>
                <p id='date-time-css'>{this.state.date.toLocaleDateString()}
                  <p>{this.state.date.toLocaleTimeString()}</p>
                </p>
              </div>

              {/* This div is for weather icon, temperature and feels-like */}
              <div id='image-heading'>
                <img src={iconUrl} alt='Weathericon' id='iconcss' />
                <p id='main-temperature'>{Math.round(weatherData.main && weatherData.main.temp)}&deg;c</p>
                <div>
                  <p id='weather-condition'><strong>{weatherData.weather && weatherData.weather[0].main}</strong></p>
                  <p id='feels-like'>Feels like <strong id='feels-like-temp'>{Math.round(weatherData.main && weatherData.main.feels_like)}&deg;</strong></p>
                </div>
              </div>

              {/* This div is for bottom elements like wind and humidity etc */}
              <div id='bottom-elements' className='d-flex justify-content-between'>
                <p id='bottom-element-individual'>Wind
                  <sub><span className="material-symbols-outlined" id='wind-icon'>air</span></sub>
                  <p id='km-hour'><strong>{weatherData.wind && weatherData.wind.speed} km/h</strong></p>
                </p>

                <p id='bottom-element-individual'>Humidity
                  <sub><span className="material-symbols-outlined" id='humidity-icon'>humidity_high</span></sub>
                  <p id='humidity-percentage'><strong>{weatherData.main && weatherData.main.humidity} %</strong></p>
                </p>

                <p id='bottom-element-individual'>Visibility
                  <sub><span className="material-symbols-outlined" id='visibility-icon'>visibility</span></sub>
                  <p id='visibility'><strong>{weatherData.visibility / 1000} km</strong></p>
                </p>

                <p id='bottom-element-individual'>Pressure
                  <sub><span className="material-symbols-outlined" id='pressure-icon'>readiness_score</span></sub>
                  <p id='pressure'><strong>{weatherData.main && weatherData.main.pressure} mb</strong></p>
                </p>

              </div>
            </div>
            {/* WEATHERCARD ENDED */}

            {/*Map started*/}
            <div className="" id='Map-card'>

              <div className="row">
                <div className="">
                  <MapContainer center={[28.6128, 77.2311]} id='map-container' zoom={4}>
                    <TileLayer
                      url={`https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}?appid=5e35f40b4b7e3f73fcbdc9bbb6d1be87`}
                    />
                  </MapContainer>
                </div>
              </div>
            </div>
            {/*Map ended*/}
          </div>

        </div>

        {/* Slider for AQI and other gases start*/}
        <div className="container" id='body-of-slider'>
        
        <span className="material-symbols-outlined" id="arrow-left" onClick={this.handleprev}>arrow_back_ios</span>
          <div className='wrapper'>
          <p id='AQI-headline'>Air quality index & other polluting gases</p>
            <div className='carousel'>

              <div className="aqi-card d-flex justify-content-between">
                <p id='aqi-fontsize'>AQI</p>
                <p id='aqi-number-fontsize'>{EPAAQI}</p>
              </div>

              <div className="other-gases-card">
                {this.state.AirpollutionData.map((aqiComponents) => {
                  return <>
                    <p id='other-gases-css'>CO</p>
                    <p id='other-gases-number-css'><strong>{(aqiComponents.components.co / 1000).toFixed(2)}</strong> <p id='other-gases-numbers-property-css'>mg/m&sup3;</p> </p>
                  </>
                })}
              </div>

              <div className="other-gases-card">
                {this.state.AirpollutionData.map((aqiComponents) => {
                  return <>
                    <p id='other-gases-css'>NH<sub style={{ fontSize: "12px" }}>3</sub></p>
                    <p id='other-gases-number-css'><strong>{aqiComponents.components.nh3}</strong> <p id='other-gases-numbers-property-css'>mg/m&sup3;</p> </p>
                  </>
                })}
              </div>

              <div className="other-gases-card">
                {this.state.AirpollutionData.map((aqiComponents) => {
                  return <>
                    <p id='other-gases-css'>NO</p>
                  <p id='other-gases-number-css'><strong>{aqiComponents.components.no}</strong> <p id='other-gases-numbers-property-css'>mg/m&sup3;</p> </p>
                </>
                })}
              </div>

              <div className="other-gases-card">
                {this.state.AirpollutionData.map((aqiComponents) => {
                  return <>
                    <p id='other-gases-css'>NO<sub style={{ fontSize: "12px" }}>2</sub></p>
                  <p id='other-gases-number-css'><strong>{aqiComponents.components.no2}</strong> <p id='other-gases-numbers-property-css'>mg/m&sup3;</p> </p>
                </>
                })}
              </div>

              <div className="other-gases-card">
                {this.state.AirpollutionData.map((aqiComponents) => {
                  return <>
                    <p id='other-gases-css'>O<sub style={{ fontSize: "12px" }}>3</sub></p>
                  <p id='other-gases-number-css'><strong>{aqiComponents.components.o3}</strong> <p id='other-gases-numbers-property-css'>mg/m&sup3;</p> </p>
                </>
                })}
              </div>

              <div className="other-gases-card">
                {this.state.AirpollutionData.map((aqiComponents) => {
                  return <>
                    <p id='other-gases-css'>PM<sub style={{ fontSize: "12px" }}>2.5</sub></p>
                  <p id='other-gases-number-css'><strong>{aqiComponents.components.pm2_5}</strong> <p id='other-gases-numbers-property-css'>mg/m&sup3;</p> </p>
                </>
                })}
              </div>

              <div className="other-gases-card">
                {this.state.AirpollutionData.map((aqiComponents) => {
                  return <>
                    <p id='other-gases-css'>PM<sub style={{ fontSize: "12px" }}>2.5</sub></p>
                  <p id='other-gases-number-css'><strong>{aqiComponents.components.pm2_5}</strong> <p id='other-gases-numbers-property-css'>mg/m&sup3;</p> </p>
                </>
                })}
              </div>

              <div className="other-gases-card">
                {this.state.AirpollutionData.map((aqiComponents) => {
                  return <>
                    <p id='other-gases-css'>SO<sub style={{ fontSize: "12px" }}>2</sub></p>
                  <p id='other-gases-number-css'><strong>{aqiComponents.components.so2}</strong> <p id='other-gases-numbers-property-css'>mg/m&sup3;</p> </p>
                </>
                })}
              </div>

            </div>
          </div>
          <span className="material-symbols-outlined" id="arrow-right" onClick={this.handlenext}>arrow_forward_ios</span>
        </div>
        {/* Slider for AQI and other gases end*/}
      </>
    )
  }
}
