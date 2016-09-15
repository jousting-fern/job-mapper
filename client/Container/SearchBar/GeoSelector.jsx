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
          <option value="Select">Select</option>
          <option value="Los Angeles">Los Angeles</option>
          <option value="San Francisco">San Francisco</option>
        </select>
      </div>
    );
  }
}

export default GeoSelector;