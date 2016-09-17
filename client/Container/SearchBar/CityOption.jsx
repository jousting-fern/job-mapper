import React from 'react';


const CityOption = (props) => (
  <option className="cityOpt" value={props.city}>{props.city}</option>
);


export default CityOption;