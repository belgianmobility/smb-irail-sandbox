import React from 'react';
import { Link } from 'react-router-dom';
import propTypes from 'prop-types';
import axios from 'axios';
import s from './style.module.scss';

class ConnectionsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      targetUrl: 'https://graph.irail.be/sncb/connections?departureTime=2019-05-06T14:39:00.000Z',
      graph: [],
      style: {
        'border-style': 'solid'
      }
    };
    this.getNextData = this.getNextData.bind(this);
    this.getPreviousData = this.getPreviousData.bind(this);
    this.fetchData = this.fetchData.bind(this);
  }

  componentDidMount() {
    this.fetchData();
  }

  getPreviousData() {
    this.setState({
      targetUrl: this.state.previousPage,
      graph: []
    });
    this.fetchData();
  }

  getNextData() {
    this.setState({
      targetUrl: this.state.previousPage,
      graph: []
    });
    this.fetchData();
  }

  fetchData() {
    axios.get(this.state.targetUrl)
      .then(res => {
        this.setState({ graph: res.data["@graph"], nextpage: res.data["hydra:next"], previousPage: res.data["hydra:previous"] });
      });
  }

  render() {
    const { graph, style } = this.state;
    const items = []

    for (const [index, connection] of graph.entries()) {
      items.push(<tr style={style} row={index}>
          <td style={style}><a href={connection["@id"]}>{connection["@id"].split("/").pop()}</a></td>
          <td style={style}>{connection["direction"]}</td>
          <td style={style}><a href={connection["departureStop"]}>{connection["departureStop"].split("/").pop()}</a></td>
          <td style={style}><a href={connection["arrivalStop"]}>{connection["arrivalStop"].split("/").pop()}</a></td>
          <td style={style}>{connection["departureTime"].split(".")[0].replace("T", "\n")}</td>
          <td style={style}>{connection["arrivalTime"].split(".")[0].replace("T", "\n")}</td>
          <td style={style}><a href={connection["gtfs:trip"]}>Trip</a> <a href={connection["gtfs:route"]}>Route</a></td>
          <td style={style}>{connection["departureDelay"] || "0"}</td>
          <td style={style}>{connection["arrivalDelay"] || "0"}</td>
        </tr>)
    }

    return (
      <div>
        <p>Selected time: {this.state.targetUrl.split("departureTime=")[1]}</p>
        <button type="button" onClick={this.getPreviousData}>←</button>
        <button type="button" onClick={this.getNextData}>→</button>
        <table>
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
        </table>
      </div>
    )
  }
}


export default ConnectionsPage;
