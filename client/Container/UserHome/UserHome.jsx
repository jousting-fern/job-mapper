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
    Materialize.toast('Your job has been saved!', 1000, 'rounded green');
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
    console.log('hi');
    let geocodeOptions = {
      method: 'POST'
    };

    let myHeaders = new Headers({'Content-Type': 'application/json; charset=utf-8'});
    var options = {};
    var city = document.getElementById('city').value;
    var state = document.getElementById('state').value;
    var address = document.getElementById('address').value;
    var longitude = 0;
    var latitude = 0;
    var query = address.split(' ').join('+') + ',+' + city.split(' ').join('+') + ',+' + state.split(' ').join('+');
    console.log('address', query);

    $.ajax({
      method: 'POST',
      url: `https://maps.googleapis.com/maps/api/geocode/json?address=${query}key=${window.geoKey}`,
      success: function(data) {
        console.log('google returns: ', data);
        latitude = data.results[0].geometry.location.lat;
        longitude = data.results[0].geometry.location.lng;

        $.ajax({
          method: 'POST',
          url: '/addUserJob',
          datatype: 'json',
          data: {
            latitude: data.results[0].geometry.location.lat,
            longitude: data.results[0].geometry.location.lng,
            jobTitle: document.getElementById('jobTitle').value,
            company: document.getElementById('company').value,
            city: document.getElementById('city').value,
            state: document.getElementById('state').value,
            snippet: document.getElementById('snippet').value,
            url: document.getElementById('url').value,
            user: document.getElementById('email'.value)
          },
          success: function(data) {
            var newMarkers = this.props.markers.slice();
            newMarkers.push({
              lat: latitude,
              lng: longitude,
              company: document.getElementById('company').value,
              jobtitle: document.getElementById('jobTitle').value,
              snippet: document.getElementById('snippet').value,
              url: document.getElementById('url').value,
              user: document.getElementById('email').value, 
              jobkey: Math.ceil(Math.random() * 10000),
              showInfo: false
            });
            this.props.setMarkers(newMarkers);
          }.bind(this)
        });
      }.bind(this),
      error: function(error) {
        console.log(error);
      }
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
      <div className='sidebar z-depth-2'>
        <button className="seeWhole" onClick={this.props.wholeView}>See whole map</button>
        <div className='profileHead'>
          {this.state.username === '' ? null : 
          <div className="valign-wrapper">
            <img className="circle profileAvatar valign" src={this.state.avatar} />
            <h3 className="welcomeTxt valign">Welcome, {this.state.firstname}</h3>
          </div>
          } 
        </div>
      <LoginButton onSignIn={this.onSignIn.bind(this)}/>
           <button className="waves-effect waves-light btn postJob" onClick={() => this.refs.simpleDialog.show()}>Post a Job</button>
        <div className='sidebarheaders'>
            <a className="waves-effect waves-light btn saveSelected" onClick={this.addJob.bind(this)} href='#'>Save Selected Job</a>
          <div className="savedJobs head">
            <i className="material-icons">system_update_alt</i> <h2 className="savedJobs">Saved Jobs</h2>
          </div>
           <SkyLight hideOnOverlayClicked ref="simpleDialog" title="Job Listing Form">
          <form onSubmit={this.handleSubmit.bind(this)}>
            <input className='validate' id='jobTitle' type="text" name="job" placeholder='Job Title'/>
            <input id='company' type="text" name="job" placeholder='Company'/>
            <input id='address' type="text" name="job" placeholder='Address'/>
            <input id='city' type="text" name="job" placeholder='City'/>
            <input id='state' type="text" name="job" placeholder='State'/>
            <input id='snippet' type="text" name="job" placeholder='Description'/>
            <input id='url' type="text" name="job" placeholder='Url'/>
            <input id='email' type="text" name="job" placeholder='Email'/>
            <button className="waves-effect waves-light btn" onClick={this.handleSubmit.bind(this)}>Add job posting</button>
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


