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
    console.log('selection changed!... and is now', this.state.value);
  }

  render () {
    let cities = this.props.cities;
    console.log(cities, '<<CITIES ARE');
    return (
      <div className="GeoSelectContainer"> 
          <select>
            {cities.map((city) => 
               <option value={city}> {city}</option>               
            )}
          </select>
      </div>
    );
  }
}

export default GeoSelector;