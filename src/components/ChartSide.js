import React from 'react';
import StockChart from './StockChart';

const ChartSide = React.createClass ({
  render () {
    return (
      <div className="chart-side">
        <div className="resolutionPanel">
          Resolution:

          <button>Year</button>
          <button>Month</button>
          <button>Week</button>
          <button>Day</button>
        </div>

        <StockChart />

        <small><i style={{
          fontSize: '12px',
          position: 'relative',
          top: '1px'
        }} className="material-icons">copyright</i> Written by <a href="http://neckersbox.eu">Davide Francesco Merico</a></small>
      </div>
    );
  }
});

export default ChartSide;
