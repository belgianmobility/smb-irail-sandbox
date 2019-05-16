import React from 'react';
import axios from 'axios';
import queryString from 'query-string';
import './style.module.scss';

class ConnectionsPage extends React.Component {
  constructor(props) {
    super(props);
    const value = queryString.parse(props.location.search);
    const departureTime = value.token || "2019-05-06T14:39:00.000Z";
    const url = "https://graph.irail.be/sncb/connections?departureTime=" + departureTime;
    this.state = {
      targetUrl: url,
      graph: []
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
        const newURL = "?departureTime=" + this.state.targetUrl.split("?departureTime=")[1];
        window.history.pushState({}, null, newURL);
        this.setState({ graph: res.data["@graph"], nextpage: res.data["hydra:next"], previousPage: res.data["hydra:previous"] });
      });
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
          <td>{connection["departureTime"].split(".")[0].replace("T", "\n")}</td>
          <td>{connection["arrivalTime"].split(".")[0].replace("T", "\n")}</td>
          <td><a href={connection["gtfs:trip"]}>Trip</a><br/><a href={connection["gtfs:route"]}>Route</a></td>
          <td>{connection["departureDelay"] || "0"}</td>
          <td>{connection["arrivalDelay"] || "0"}</td>
        </tr>)
    }

    return (
      <div>
        <p>Selected time: {this.state.targetUrl.split("departureTime=")[1]}</p>
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
