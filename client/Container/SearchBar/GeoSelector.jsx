import React from 'react';

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
    return (
      <div> 
        <select className="GeoSelector" onChange={this.handleSelection.bind(this)} value={this.state.value}>
         {/* {this.props.cities.map(function(city)){
            return (
              <CityOption city={city}/>
            )
          }}*/}
          }
        </select>
      </div>
    );
  }
}

export default GeoSelector;