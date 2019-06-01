import React from 'react';
import propTypes from 'prop-types';
import axios from 'axios';
import queryString from 'query-string';
import Datetime from 'react-datetime';
import ConnectionsHeader from '../../components/ConnectionsHeader';

import s from './style.module.scss';

class ConnectionsPage extends React.Component {
  constructor(props) {
    super(props);
    const value = queryString.parse(props.location.search);
    const departureTime = value.token || '2019-05-06T14:39:00.000Z';
    const url = `https://graph.irail.be/sncb/connections?departureTime=${departureTime}`;
    this.state = {
      targetUrl: url,
      timestamp: departureTime,
      graph: [],
    };
  }

  componentDidMount() {
    document.title = 'Linked Connections | Sandbox';
    this.fetchData();
  }

  onDateSelected = (moment) => {
    const timestamp = moment.format('Y-MM-DDTHH:MM:SS.000\\Z');
    this.setState({
      timestamp,
      targetUrl: `https://graph.irail.be/sncb/connections?departureTime=${timestamp}`,
    }, this.fetchData);
  }

  getPreviousData = () => {
    const { previousPage } = this.state;
    this.setState({
      targetUrl: previousPage,
      graph: [],
    });
    this.fetchData();
  }

  getNextData = () => {
    const { nextpage } = this.state;
    this.setState({
      targetUrl: nextpage,
      graph: [],
    });
    this.fetchData();
  }

  fetchData = () => {
    const { targetUrl } = this.state;
    axios.get(targetUrl)
      .then((res) => {
        const newURL = `?departureTime=${targetUrl.split('?departureTime=')[1]}`;
        window.history.pushState({}, null, newURL);
        this.setState({ graph: res.data['@graph'], nextpage: res.data['hydra:next'], previousPage: res.data['hydra:previous'] });
      });
  }

  render() {
    const { graph, targetUrl, timestamp } = this.state;
    const items = [];

    /* eslint-disable no-restricted-syntax */
    for (const [index, connection] of graph.entries()) {
      items.push(
        <tr row={index}>
          <td><a href={connection['@id']}>{connection['@id'].split('/').pop()}</a></td>
          <td>{connection.direction}</td>
          <td><a href={connection.departureStop}>{connection.departureStop.split('/').pop()}</a></td>
          <td><a href={connection.arrivalStop}>{connection.arrivalStop.split('/').pop()}</a></td>
          <td>{connection.departureTime.split('.')[0].replace('T', '\n')}</td>
          <td>{connection.arrivalTime.split('.')[0].replace('T', '\n')}</td>
          <td>
            <a href={connection['gtfs:trip']}>Trip</a>
            <br />
            <a href={connection['gtfs:route']}>Route</a>
          </td>
          <td>{connection.departureDelay || '0'}</td>
          <td>{connection.arrivalDelay || '0'}</td>
        </tr>,
      );
    }

    return (
      <div>
        <ConnectionsHeader targetUrl={targetUrl} timestamp={timestamp} />
        <p>
Selected date:
          <b>
            {' '}
            {new Date(timestamp).toString()}
          </b>
        </p>
        <Datetime
          className={s.datePicker}
          ref={this.datePicker}
          input={false}
          defaultValue={new Date(timestamp)}
          onChange={this.onDateSelected}
        />
        <h2>Loaded results</h2>
        <button type="button" onClick={this.getPreviousData}>←</button>
        <button type="button" onClick={this.getNextData}>→</button>
        <table>
          <tbody>
            <tr>
              <th>Connection ID</th>
              <th>Direction</th>
              <th>Departure Stop</th>
              <th>Arrival Stop</th>
              <th>Departure Time</th>
              <th>Arrival Time</th>
              <th>GTFS</th>
              <th>Departure Delay</th>
              <th>Arrival Delay</th>
            </tr>
            {items}
          </tbody>
        </table>
      </div>
    );
  }
}

ConnectionsPage.propTypes = {
  location: propTypes.instanceOf(Object).isRequired,
};


export default ConnectionsPage;
