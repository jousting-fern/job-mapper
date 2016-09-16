import { default as React, Component } from "react";
//import { default as update } from "react-addons-update";

//import { default as canUseDOM } from "can-use-dom";
import { default as _ } from "lodash";

import { GoogleMapLoader, GoogleMap, InfoWindow, Marker } from "react-google-maps";
import { triggerEvent } from "react-google-maps/lib/utils";
import SearchBar from './SearchBar/SearchBar.jsx';
import UserSideBar from './UserSideBar/UserSideBar.jsx';
import UserHome from './UserHome/UserHome.jsx';
import D3Window from './D3Window.jsx';
import InfoBox from "react-google-maps/lib/addons/InfoBox";

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
      username: ''
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
    fetch('/cities', options).then((response) => {
      console.log('RESPONSE HERE IS, response');
      return response.json().then((data) => {
        var cities = [];
        data.forEach((city) => {
          console.log('AND HERE IS ANOTHER CITY', city);
          cities.push(city);
        });
      });
    }).catch((error) => {
      console.log('There has been a problem with your fetch operation: ' + error.message);
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
      markers: markerArray
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
      <SearchBar setMarkers={this.setMarkers}/>
      <div className='overallContainer'>
      <UserHome selected={this.state.selectedPlace} username={this.state.username} LogOutUser={this.LogOutUser}/>
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







