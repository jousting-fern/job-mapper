import React, {PropTypes, Component} from 'react';
import SavedJob from './SavedJob.jsx';
import LoginButton from './Login.jsx';
import SkyLight from 'react-skylight';




export default class UserHome extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      jobs: [],
      username: '',
      avatar: '',
      firstname: '',
      jobTitle: '',
      company: '',
      city: '',
      state: '',
      snippet: '',
      url: '',
      user: ''
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
      username: profile.getEmail(),
      avatar: profile.getImageUrl(),
      firstname: profile.getName().split(' ').slice(0, -1).join(' ')
    });    
    console.log(this.state.username);
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
  handleSubmit(e) {
    e.preventDefault();
    let myHeaders = new Headers({'Content-Type': 'application/json; charset=utf-8'});

    //'http://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=APIKEYHERE';
    let options = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify({
        jobTitle: document.getElementById('jobTitle'),
        company: document.getElementById('company'),
        address: document.getElementById('address'),
        city: document.getElementById('city'),
        state: document.getElementById('state'),
        snippet: document.getElementById('snippet'),
        url: document.getElementById('url'),
        user: document.getElementById('email')
      })
    };
    fetch('/addUserJob', options).then((response) => {
      return response.json().then((data) => {
        var markers = [];
        data.forEach((job) => {
          var marker = {
            lat: job.latitude,
            lng: job.longitude,
            company: job.company,
            jobtitle: job.jobtitle,
            snippet: job.snippet,
            url: job.url,
            jobkey: job.jobkey,
            showInfo: false
          };
          markers.push(marker);
        });
        console.log('fetching')
        this.props.setMarkers(markers);
      });
    }).catch((error) => {
      console.log('There has been a problem with your fetch operation: ' + error.message);
    });
  }

  handleJobSearch(e) {
    this.setState({currentJob: e.target.value});
    console.log('jobbing')
  }

  handleCitySearch(e) {
    console.log('searching')
    this.setState({currentCity: e.target.value});
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
        <div className='profileHead valign-wrapper'>
          <img className="circle profileAvatar valign" src={this.state.avatar} />
          <h3 className="welcomeTxt valign">Welcome, {this.state.firstname}</h3>
        </div>
      <LoginButton onSignIn={this.onSignIn.bind(this)}/>
        <div className='sidebarheaders'>
            <a onClick={this.addJob.bind(this)} href='#'>Save Selected Job</a>
          <hr></hr>
          <h2>Saved Jobs</h2>
          <hr></hr>
          <button onClick={() => this.refs.simpleDialog.show()}>Open Modal</button>
           <SkyLight hideOnOverlayClicked ref="simpleDialog" title="Hi, I'm a simple modal">
          <form onSubmit={this.handleSubmit.bind(this)}>
            <input id='jobTitle' type="text" name="job" placeholder='Job Title'/>
            <input id='company' type="text" name="job" placeholder='Company'/>
            <input id='address' type="text" name="job" placeholder='Address'/>
            <input id='city' type="text" name="job" placeholder='City'/>
            <input id='state' type="text" name="job" placeholder='State'/>
            <input id='snippet' type="text" name="job" placeholder='Description'/>
            <input id='url' type="text" name="job" placeholder='Url'/>
            <input id='email' type="text" name="job" placeholder='Email'/>
          </form>
           </SkyLight>
        </div>
        <div className='savedjobs'>
          {Jobs}
        </div>
      </div>
    );
  }
}


