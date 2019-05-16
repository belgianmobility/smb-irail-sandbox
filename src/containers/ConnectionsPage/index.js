import React from 'react';
import axios from 'axios';
import queryString from 'query-string';
import Datetime from 'react-datetime';
import ConnectionsHeader from '../../components/ConnectionsHeader/index';

import s from './style.module.scss';

class ConnectionsPage extends React.Component {
  constructor(props) {
    super(props);
    const value = queryString.parse(props.location.search);
    const departureTime = value.token || "2019-05-06T14:39:00.000Z";
    const url = "https://graph.irail.be/sncb/connections?departureTime=" + departureTime;
    this.state = {
      targetUrl: url,
      timestamp: departureTime,
      graph: []
    };
    this.datePicker = React.createRef();
  }

  componentDidMount() {
    document.title = "Linked Connections | Sandbox";
    this.fetchData(this.state.targetUrl);
  }

  getPreviousData = () => {
    this.fetchData(this.state.previousPage);
  }

  getNextData = () => {
    this.fetchData(this.state.nextPage);
  }

  fetchData = (targetUrl) => {
    const timestamp = targetUrl.split("?departureTime=")[1];

    this.setState({
      targetUrl: targetUrl,
      timestamp: timestamp,
      graph: []
    });

    axios.get(targetUrl)
      .then(res => {
        const newURL = "?departureTime=" + timestamp;
        window.history.pushState({}, null, newURL);
        this.setState({ graph: res.data["@graph"], nextPage: res.data["hydra:next"], previousPage: res.data["hydra:previous"] });
      });
  }

  onDateSelected = (date) => {
    const url = "https://graph.irail.be/sncb/connections?departureTime=" + date.toISOString();
    this.fetchData(url);
  }

  render() {
    const { graph } = this.state;
    const items = []

    for (const [index, connection] of graph.entries()) {
      items.push(<tr row={index}>
          <td><a href={connection["@id"]}>{connection["@id"].split("/").pop()}</a></td>
          <td>{connection["direction"]}</td>
          <td><a href={connection["departureStop"]}>{connection["departureStop"].split("/").pop()}</a></td>
          <td><a href={connection["arrivalStop"]}>{connection["arrivalStop"].split("/").pop()}</a></td>
          <td>{new Date(connection["departureTime"]).toString()}</td>
          <td>{new Date(connection["arrivalTime"]).toString()}</td>
          <td><a href={connection["gtfs:trip"]}>Trip</a><br/><a href={connection["gtfs:route"]}>Route</a></td>
          <td>{connection["departureDelay"] || "0"}</td>
          <td>{connection["arrivalDelay"] || "0"}</td>
        </tr>)
    }

    return (
      <div>
        <ConnectionsHeader timestamp={this.state.timestamp} targetUrl={this.state.targetUrl} />
        <p>Selected date: <b>{new Date(this.state.timestamp).toString()}</b></p>
        <Datetime className={s.datePicker} ref={this.datePicker} input={false} defaultValue={new Date(this.state.timestamp)} onChange={this.onDateSelected}/>
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
    )
  }
}


export default ConnectionsPage;
