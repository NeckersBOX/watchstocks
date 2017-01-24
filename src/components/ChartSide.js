import React from 'react';
import StockChart from './StockChart';

const ChartSide = React.createClass ({
  getInitialState () {
    return { resolution: 'WEEK' };
  },
  render () {
    let activeStyle = {
      backgroundColor: '#eee'
    };

    let style = {
      YEAR: ( this.state.resolution == 'YEAR' ) ? activeStyle : null,
      MONTH: ( this.state.resolution == 'MONTH' ) ? activeStyle : null,
      WEEK: ( this.state.resolution == 'WEEK' ) ? activeStyle : null,
      DAY: ( this.state.resolution == 'DAY' ) ? activeStyle : null
    };

    return (
      <div className="chart-side">
        <div className="resolutionPanel">
          Resolution:

          <button style={style.YEAR} onClick={() => this.setState ({ resolution: 'YEAR' })}>Year</button>
          <button style={style.MONTH} onClick={() => this.setState ({ resolution: 'MONTH' })}>Month</button>
          <button style={style.WEEK} onClick={() => this.setState ({ resolution: 'WEEK' })}>Week</button>
          <button style={style.DAY} onClick={() => this.setState ({ resolution: 'DAY' })}>Day</button>
        </div>

        <StockChart resolution={this.state.resolution} />

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
