import React from 'react';
import {render} from 'react-dom';
import Container from './Container/Container.jsx';
import SimpleMap from './Container/SimpleMap.jsx';
import ReactMap from './Container/ReactMap.jsx';
require('./main.css');

// renders Container componenet to index.html
render(<ReactMap/>, document.getElementById('app'));
