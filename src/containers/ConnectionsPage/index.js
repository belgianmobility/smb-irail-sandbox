import React from 'react';
import { Link } from 'react-router-dom';
import propTypes from 'prop-types';
import axios from 'axios';
import s from './style.module.scss';

class ConnectionsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      graph: [],
      style: {
        'border-style': 'solid'
      }
    };
  }

  componentDidMount() {
    axios.get(`https://graph.irail.be/sncb/connections?departureTime=2019-05-06T14:39:00.000Z`)
      .then(res => {
        const nextPage = res.data["hydra:next"];
        const previousPage = res.data["hydra:previous"];
        this.setState({ graph: res.data["@graph"] });
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
    )
  }
}


export default ConnectionsPage;
