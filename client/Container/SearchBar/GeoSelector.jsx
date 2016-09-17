import React from 'react';
import CityOption from './CityOption.jsx';

class GeoSelector extends React.Component {
  constructor (props) {
    super (props);
    
    this.state = {
      value: 'select'
    };
  }

  handleSelection (event) {
    this.setState({value: event.target.value});
    this.props.handleCitySearch(event);
    console.log('selection changed!... and is now', this.state.value);
  }

  render () {
    let cities = this.props.cities;
    return (
      <div className="GeoSelectContainer"> 
          <select value={this.state.value} onChange={this.handleSelection.bind(this)}>
            {cities.map((city) => 
               <option id={city} value={city}>{city}</option>               
            )}
          </select>
      </div>
    );
  }
}

export default GeoSelector;