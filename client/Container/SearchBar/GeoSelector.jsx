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
    return (
      <div className="GeoSelectContainer"> 
        <form>
          <select>
            {cities.map((city)=>
               <CityOption city={city} />
            )}
          </select>
        </form>
      </div>
    );
  }
}

export default GeoSelector;