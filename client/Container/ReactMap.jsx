import { default as React, Component } from "react";
//import { default as update } from "react-addons-update";

import { default as canUseDOM } from "can-use-dom";
import { default as _ } from "lodash";

import { GoogleMapLoader, GoogleMap, Marker } from "react-google-maps";
import { triggerEvent } from "react-google-maps/lib/utils";
import SearchBar from './SearchBar/SearchBar.jsx';
import UserSideBar from './UserSideBar/UserSideBar.jsx';
import UserHome from './UserHome/UserHome.jsx';
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
      showingInfoWindow: false,
      activeMarker: {},
      selectedPlace: {},
      markers: [],
      register: false,
      loggedIn: false,
      username: ''
    };

    this.onMarkerClick = this.onMarkerClick.bind(this);
    this.setMarkers = this.setMarkers.bind(this);
    this.LogInUser = this.LogInUser.bind(this);
    this.LogOutUser = this.LogOutUser.bind(this);
  }

  componentDidMount() {
    if (!canUseDOM) {
      return;
    }
    window.addEventListener(`resize`, this.handleWindowResize);
  }

  componentWillUnmount() {
    if (!canUseDOM) {
      return;
    }
    window.removeEventListener(`resize`, this.handleWindowResize);
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

  onMarkerClick(props, marker, e) {
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    });
  }

  setMarkers(markerArray) {
    this.setState({
      markers: markerArray
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

  handleMarkerRightclick(index, event) {
    /*
     * All you modify is data, and the view is driven by data.
     * This is so called data-driven-development. (And yes, it's now in
     * web front end and even with google maps API.)
     */
    let { markers } = this.state;
    markers = update(markers, {
      $splice: [
        [index, 1],
      ],
    });
    this.setState({ markers });
  }

  render() {


    return (
      <div>
      <SearchBar setMarkers={this.setMarkers}/>
      <div className='overallContainer'>
      {this.state.loggedIn ? <UserHome selected={this.state.selectedPlace} username={this.state.username} LogOutUser={this.LogOutUser}/> : <UserSideBar LogInUser={this.LogInUser}/> }
      </div>
      <GoogleMapLoader
        query={{ libraries: "geometry,drawing,places,visualization" }}
        containerElement={
          <div
            {...this.props}
            style={{
              height: `100%`,
            }}
          />
        }
        googleMapElement={
          <GoogleMap
            ref={(map) => (this._googleMapComponent = map) && console.log(map.getZoom())}
            defaultZoom={3}
            defaultCenter={{ lat: -25.363882, lng: 131.044922 }}
            onClick={this.handleMapClick.bind(this)}
          >
            {this.state.markers.map((marker, index) => {
              return (
                <Marker
                  key={index}
                  onClick={this.onMarkerClick}
                  company={marker['company']}
                  jobtitle={marker['jobtitle']}
                  snippet={marker['snippet']}
                  url={marker['url']}
                  jobkey={marker['jobkey']}
                  position={{lat: marker['lat'], lng: marker['lng']}}
                  {...marker}
                  onRightclick={this.handleMarkerRightclick.bind(this, index)}
                />
              );
            })}
          </GoogleMap>
        }
      />
      </div>
    );
  }
}