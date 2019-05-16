import React from 'react';

import s from './style.module.scss';

class ConnectionsHeader extends React.Component {
  render() {
    return (
      <div>
        <h1>Quick showcase</h1>
        <p>This page loads all the data for the connections departing at a given time and displays it all in a table.</p>
        <h3>See the API request</h3>
        <div id="urlDiv" className={s.inputDiv}>
          <div className={s.inputDiv__key}>URL</div>
          <div className={s.requestUrl}>
            <a href={this.props.targetUrl}>
              <span className={s.api}>https://graph.irail.be</span>
              <span className={s.path}>/sncb</span>
              <span className={s.feature}>/connections</span>
              <span className={s.parameters}>{"?departureTime=" + this.props.timestamp}</span>
            </a>
          </div>
        </div>
      </div>
    )
  }
}


export default ConnectionsHeader;
