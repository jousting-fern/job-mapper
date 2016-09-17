import { default as React, Component } from "react";
//import { default as update } from "react-addons-update";

//import { default as canUseDOM } from "can-use-dom";
import { default as _ } from "lodash";

import { GoogleMapLoader, GoogleMap, InfoWindow, Marker } from "react-google-maps";
import { triggerEvent } from "react-google-maps/lib/utils";
import SearchBar from './SearchBar/SearchBar.jsx';
import UserSideBar from './UserSideBar/UserSideBar.jsx';
import UserHome from './UserHome/UserHome.jsx';
// import D3Window from './D3Window.jsx';
import InfoBox from "react-google-maps/lib/addons/InfoBox";
import Chart from './Chart/Chart.jsx';
/* 
 * This is the modify version of:
 * https://developers.google.com/maps/documentation/javascript/examples/event-arguments
 *
 * Add <script src="https://maps.googleapis.com/maps/api/js"></script> to your HTML to provide google.maps reference
 */
export default class ReactMap extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      activeMarker: {},
      selectedPlace: {},
      markers: [],
      register: false,
      loggedIn: false,
      username: '',
      cities: [],
      chartData: [
        {name: 'Page A', uv: 4000, pv: 1398, amt: 2400},
        {name: 'Page B', uv: 3000, pv: 1398, amt: 2210},
        {name: 'Page C', uv: 2000, pv: 9800, amt: 2290},
        {name: 'Page D', uv: 2780, pv: 3908, amt: 2000},
        {name: 'Page E', uv: 1890, pv: 4800, amt: 2181},
        {name: 'Page F', uv: 2390, pv: 3800, amt: 2500},
        {name: 'Page G', uv: 3490, pv: 4300, amt: 2100},
      ],
      cities: [],
    };

    this.setMarkers = this.setMarkers.bind(this);
    this.LogInUser = this.LogInUser.bind(this);
    this.LogOutUser = this.LogOutUser.bind(this);
  }
  
  // this fetches city list, dynamically populating dropdown selector with options
  componentWillMount () {
    let options = {
      method: 'GET',
    };
    var cities = [];
    
    $.ajax({
      method: 'GET',
      url: '/cities',
      success: function (data) {
        console.log(data);
        this.setState({cities: JSON.parse(data)});
      }.bind(this)
    });
    

  }


    



  /*
   * This is called when you click on the map.
   * Go and try click now.
   */
  handleMapClick(event) {
    let { markers } = this.state;
    markers = update(markers, {
      $push: [
        {
          position: event.latLng,
          defaultAnimation: 2,
          key: Date.now(), // Add a key property for: http://fb.me/react-warning-keys
        },
      ],
    });
    this.setState({ markers });

    if (markers.length === 3) {
      this.props.toast(
        `Right click on the marker to remove it`,
        `Also check the code!`
      );
    }
  }

  handleMarkerClick(marker) {
    marker.showInfo = true;
    this.setState(this.state);
    this.setSelected(marker);
  }
  
  handleMarkerClose(marker) {
    marker.showInfo = false;
    this.setState(this.state);
  }

  setMarkers(markerArray) {
    this.setState({
      markers: markerArray,
    });
    
    // create dateObj to increment counters by day
    var dateObj = {};
    
    // loop through each job and set counters and first and last
    markerArray.forEach(function(job) {
      job.date = new Date(job.date);
      var jobString = job.date.toDateString();
      // create counters for each day a job was created
      dateObj[jobString] = dateObj[jobString] + 1 || 1;  
      // console.log('day: ', jobString, " ", dateObj[jobString]);
    });
    
    // loop through dateObj to create chartData
      var newChartData = [];
      for (var jobDate in dateObj) {
          newChartData.push({
            name: jobDate, 
            uv: dateObj[jobDate], 
            pv: dateObj[jobDate], 
            amt: dateObj[jobDate]
          });
      }

      console.log('newChartData: ', newChartData);
      console.log( 'sorted: ', newChartData.sortBy(newChartData, function(a, b){
        return a.date - b.date;
      }) );
      
    // add chartData to SetState
      this.setState({
        chartData: newChartData,
      });
  }

  setSelected(marker) { 
    this.setState({
      selectedPlace: marker
    });
  }

  LogInUser(username) {
    this.setState({username: username});
    this.setState({loggedIn: true});
  }

  LogOutUser() {
    this.setState({loggedIn: false});
    this.setState({username: ''});
  }

  renderInfoWindow(ref, marker) {
    return (
      //You can nest components inside of InfoWindow!
      <InfoWindow 
        key={`${ref}_info_window`}
        onCloseclick={this.handleMarkerClose.bind(this, marker)} >
          <div className='infowindow'>
              <h3>{marker.company}</h3>
              <h4>{marker.jobtitle}</h4>
              <p>{marker.snippet}</p>
              <div><a href={marker.url}>Click to View</a></div> 
          </div>        
      </InfoWindow>
      );
  }



  render() {
    return (
      <div>
        <div className='chartDiv'>
          <Chart chartData={this.state.chartData}/>
        </div>
      <SearchBar setMarkers={this.setMarkers} cities={this.state.cities}/>
      <div className='overallContainer'>
      <UserHome selected={this.state.selectedPlace} username={this.state.username} LogOutUser={this.LogOutUser} setMarkers={this.setMarkers} markers={this.state.markers}/>
      <GoogleMapLoader
        query={{ libraries: "geometry,drawing,places,visualization" }}
        containerElement={
          <div className="mapContainer"
            {...this.props}
            style={{
              height: `100%`,
            }}
          />
        }
        googleMapElement={
          <GoogleMap
            ref={(map) => (this._googleMapComponent = map) && console.log(map.getZoom())}
            defaultZoom={4}
            defaultCenter={{ lat:  39.5, lng: -98.35 }}
            onClick={this.handleMapClick.bind(this)}
            defaultOptions={{
              styles: [{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#7f2200"},{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"visibility":"on"},{"color":"#87ae79"}]},{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#495421"}]},{"featureType":"administrative","elementType":"labels.text.stroke","stylers":[{"color":"#ffffff"},{"visibility":"on"},{"weight":4.1}]},{"featureType":"administrative.neighborhood","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"landscape","elementType":"geometry.fill","stylers":[{"color":"#abce83"}]},{"featureType":"landscape.man_made","elementType":"geometry.fill","stylers":[{"visibility":"off"}]},{"featureType":"landscape.man_made","elementType":"geometry.stroke","stylers":[{"lightness":"25"}]},{"featureType":"poi","elementType":"geometry.fill","stylers":[{"color":"#97b771"}]},{"featureType":"poi","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"labels.text.fill","stylers":[{"color":"#7B8758"}]},{"featureType":"poi","elementType":"labels.text.stroke","stylers":[{"color":"#EBF4A4"}]},{"featureType":"poi.attraction","elementType":"labels","stylers":[{"visibility":"on"}]},{"featureType":"poi.business","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"poi.government","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"visibility":"simplified"},{"color":"#8dab68"}]},{"featureType":"road","elementType":"geometry.fill","stylers":[{"visibility":"simplified"}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"color":"#5B5B3F"}]},{"featureType":"road","elementType":"labels.text.stroke","stylers":[{"color":"#ABCE83"}]},{"featureType":"road","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"color":"#EBF4A4"}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#9BBF72"}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#A4C67D"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"geometry","stylers":[{"visibility":"on"},{"color":"#aee2e0"}]}],
              mapTypeId: 'terrain'
            }}
          >
            {this.state.markers.map((marker, index) => {
              const ref = `marker_${index}`;

              return (
                <Marker
                  key={index}
                  onClick={this.handleMarkerClick.bind(this, marker)}
                  key={index}
                  ref={ref}
                  position={{lat: marker['lat'], lng: marker['lng']}}
                  {...marker}
                >
                {marker.showInfo ? this.renderInfoWindow(ref, marker) : null}
                
                </Marker>
              );
            })}
          </GoogleMap>
        }
      />
      </div>
      </div>
    );
  }
}







