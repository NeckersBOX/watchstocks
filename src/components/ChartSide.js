import React from 'react';
import { connect } from 'react-redux';

const ChartSide = React.createClass ({
  render () {
    return (
      <div className="chart-side">
        <small><i style={{
          fontSize: '12px',
          position: 'relative',
          top: '1px'
        }} className="material-icons">copyright</i> Written by <a href="http://neckersbox.eu">Davide Francesco Merico</a></small>
      </div>
    );
  }
});

const ConnectedChartSide = connect ((state) => state)(ChartSide);

export default ConnectedChartSide;
