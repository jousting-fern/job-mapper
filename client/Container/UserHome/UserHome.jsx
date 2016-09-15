import React, {PropTypes, Component} from 'react';
import SavedJob from './SavedJob.jsx';
import LoginButton from './Login.jsx';

export default class UserHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jobs: [],
      username: ''
    };
    this.removeJob = this.removeJob.bind(this);
  }
  
  onSignIn (googleUser) {
    console.log('trying');
    var profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail());
    this.setState({
      username: profile.getEmail()
    })
    console.log(this.state.username)
  }
  
  // displays saved jobs on login
  componentDidMount() {
    window.addEventListener('google-loaded', this.getJobs.bind(this));
  }

  // display saved jobs for logged in user
  getJobs() {
    console.log('get jobs');
    let myHeaders = new Headers({
      'Content-Type': 'application/json; charset=utf-8'
    });
    console.log(this.state.username)
    let options = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify({ username: this.state.username}),
    };
    fetch('/getJobs', options).
    then((response) => {
      console.log(response.body)
      return response.json().then((data) => {
        // creates array of job objects from returned data
        var jobs = [];
        data.forEach(function(item) {
          var job = {
            company: item.company,
            jobtitle: item.jobtitle,
            snippet: item.snippet,
            url: item.url,
            jobkey: item.jobkey
          };
          jobs.push(job);
        });
        // sets state of displayed saved jobs
        this.setState({jobs: jobs});
      });
    })
    .catch((error) => {
      console.log('There has been a problem with your fetch operation: ' + error.message);
    });
  }

  // adds currently selected job on map to user's saved jobs
  addJob() {
    var job = {
      company: this.props.selected.company,
      jobtitle: this.props.selected.jobtitle,
      snippet: this.props.selected.snippet,
      url: this.props.selected.url,
      jobkey: this.props.selected.jobkey
    };
    let myHeaders = new Headers({
      'Content-Type': 'application/json; charset=utf-8'
    });
    let options = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify({ job: job, username: this.state.username}),
    };
    fetch('/addJob', options)
    .then(() => {
      this.getJobs();
    })
    .catch((error) => {
      console.log('There has been a problem with your fetch operation: ' + error.message);
    });
  }

  // removes selected job from user's saved jobs
  removeJob(jobkey) {
    let myHeaders = new Headers({
      'Content-Type': 'application/json; charset=utf-8'
    });
    let options = {
      method: 'POST',
      headers: myHeaders,
      // jobkey is passed in to find correct job in savedjobs array
      body: JSON.stringify({jobkey: jobkey, username: this.state.username})
    };
    fetch('/removeJob', options)
    .then(() => {
      this.getJobs();
    })
    .catch((error) => {
      console.log('There has been a problem with your fetch operation: ' + error.message);
    });
  }


  render() {
    // puts the current state of map markers into an array that can be rendered
    const Jobs =
        this.state.jobs
        .map((job, index) => (
          <SavedJob
            key={index}
            company={job.company}
            jobtitle={job.jobtitle}
            snippet={job.snippet}
            url={job.url}
            jobkey={job.jobkey}
            removeJob={this.removeJob} />
        ));
    return (
      <div className='sidebar'>
      <LoginButton onSignIn={this.onSignIn.bind(this)}/>
        <div className='sidebarheaders'>
            <a onClick={this.addJob.bind(this)} href='#'>Save Selected Job</a>
          <hr></hr>
          <h2>Saved Jobs</h2>
          <hr></hr>
        </div>
        <div className='savedjobs'>
          {Jobs}
        </div>
      </div>
    );
  }
}
