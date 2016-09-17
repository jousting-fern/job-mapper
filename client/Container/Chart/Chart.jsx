import { default as React, Component } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, ReferenceLine,
  ReferenceDot, Tooltip, CartesianGrid, Legend, Brush } from 'recharts';





export default class Chart extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {};
  }

  render () {
    return (
      <LineChart width={600} height={100} data={this.props.chartData} margin={{ top: 5, right: 35, left: 20, bottom: 5 }}>
        <XAxis dataKey="name" />
        <YAxis />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Line type='monotone' dataKey='pv' stroke='#8884d8' strokeWidth={2} />
      </LineChart>
    );
  }

}