import React, {PropTypes, Component} from 'react';
import GeoSelector from './GeoSelector.jsx';

export default class SearchBar extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentJob: '',
      currentCity: ''
    };

    this.handleJobSearch = this.handleJobSearch.bind(this);
    this.handleCitySearch = this.handleCitySearch.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // takes text from search bar and queries database for matching results
  // makes an array of markers that are to be passed to setMarkers
  handleSubmit(e) {
    console.log('RLLY SEARCHING FOR THIS VALUE RN', this.state.currentCity)
    e.preventDefault();
    let myHeaders = new Headers({'Content-Type': 'application/json; charset=utf-8'});
    let options = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify({job: this.state.currentJob, city: this.state.currentCity})
    };
    fetch('/indeed', options).then((response) => {
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
            date: job.date,
            jobkey: job.jobkey,
            showInfo: false
          };
          markers.push(marker);
        });
        console.log('fetching');
        this.props.setMarkers(markers);
      });
    }).catch((error) => {
      console.log('There has been a problem with your fetch operation: ' + error.message);
    });
    Materialize.toast('Fetching jobs!', 1000, 'rounded green');
  }
  
  handleJobSearch(e) {
    this.setState({currentJob: e.target.value});
    console.log('jobbing');
  }

  handleCitySearch(e) {
    console.log('searching');
    this.setState({currentCity: e.target.value});
    console.log('CURRENT CITY NOW SEARCHING FOR IS ', this.state.currentCity);
  }

  // handleSelectChange(event) {
  //   console.log(event.target.value);
  //   this.setState({currentCity: event.target.value});
  // }

  render() {
    return (
      <div id='search-bar'>
        <img className='log' src='./jobsIcon.png'/>
        <h1>JobMapper</h1>
        <div className='search-div'>
          <form onSubmit={this.handleSubmit.bind(this)} >
            <input className='search-box' type="text" name="job" value={this.state.currentJob} placeholder='Search Job
            ' onChange={this.handleJobSearch} />
          </form>
        </div>
        <div className='geoSelector'>
          <GeoSelector cities={this.props.cities} handleCitySearch={this.handleCitySearch.bind(this)} city={this.handleCitySearch}/>
        </div>
        {/* <div className='searchLabel'>
        City:<input type="text" name="city" value={this.state.currentCity} onChange={this.handleCitySearch} />
      </div> */}
      </div>
    );
  }
}
