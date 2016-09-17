import React, {PropTypes, Component} from 'react';

export default class SavedJob extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="savedJobInstance">
        <h3>{this.props.company}</h3>
        <h4>{this.props.jobtitle}</h4>
        <br/>
        <div>{this.props.snippet}</div>
        <div className="Links">
          <a href={this.props.url}>Link</a>
          <a className="removeJob" onClick={() => this.props.removeJob(this.props.jobkey)} href='#'>Remove job</a>
        </div>
        <hr></hr>
      </div>
    );
  }
}
