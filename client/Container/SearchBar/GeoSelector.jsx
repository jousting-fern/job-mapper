import React from 'react';
import CityOption from './CityOption.jsx';

class GeoSelector extends React.Component {
  constructor (props) {
    super(props);
  }

  change() {
    var selectBox = document.getElementById("selectBox");
    var selectedValue = selectBox.options[selectBox.selectedIndex].value;
    console.log(selectedValue,  'value maybe');
    this.props.city(selectedValue);
    this.props.change(selectedValue);
  }

  render () {
    let cities = this.props.cities;
    return (
      <div className="GeoSelectContainer"> 
          <select id='selectBox' onChange={this.change.bind(this)}>
            {cities.map((city) => 
               <CityOption city={city} />
            )}
          </select>
      </div>
    );
  }
}

export default GeoSelector;