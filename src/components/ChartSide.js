import React from 'react';
import { connect } from 'react-redux';
import { Chart } from 'react-google-charts';

const ChartSide = React.createClass ({
  getInitialState () {
    return { resize: 0, chartData: [] };
  },
  componentDidMount () {
    if ( typeof window === 'undefined' )
      return;

    window.addEventListener ('resize', this.toggleState);
  },
  componentWillUnmount () {
    if ( typeof window === 'undefined' )
      return;

    window.removeEventListener ('resize', this.toggleState);
  },
  toggleState () {
    this.setState ({ resize: 1 - this.state.resize });
  },
  componentWillReceiveProps () {
    this.setState ({ chartData: this.props.chartData });
  },
  render () {
    console.log (this.props);

    return (
      <div className="chart-side">
        <Chart chartType="LineChart" graph_id={"StockChart" + this.state.resize}
          width="100%" height="600px" data={this.state.chartData} />
        <small><i style={{
          fontSize: '12px',
          position: 'relative',
          top: '1px'
        }} className="material-icons">copyright</i> Written by <a href="http://neckersbox.eu">Davide Francesco Merico</a></small>
      </div>
    );
  }
});

const ConnectedChartSide = connect (state => {
  let dateList = [];

  for ( let stockId in state.stockList ) {
    for ( let dataId in state.stockList[stockId].data ) {
      if ( dateList.indexOf (state.stockList[stockId].data[dataId][0]) === -1 )
        dateList.push (state.stockList[stockId].data[dataId][0]);
    }
  }

  let newState = {
    dataset_codes: state.stockList.map (stock => stock.dataset_code),
    data: dateList.sort ().map (date => {
      let records = [];

      for ( let stockId in state.stockList ) {
        for ( let dataId in state.stockList[stockId].data ) {
          if ( state.stockList[stockId].data[dataId][0] === date ) {
            records.push ({
              name: state.stockList[stockId].dataset_code,
              value: state.stockList[stockId].data[dataId][4]
            });
            break;
          }
        }
      }

      return {
        date: date,
        values: records
      };
    })
  };

  const getArraySorted = (codes, values) => {
    let codeToVal = [];

    for ( let codeId in codes ) {
      let found = false;
      for ( let valueId in values ) {
        if ( values[valueId].name == codes[codeId] ) {
          found = values[valueId].value;
          break;
        }
      }

      codeToVal.push ((found === false) ? 0 : found);
    }

    return codeToVal;
  };

  return Object.assign ({}, newState, {
    chartData: [[ 'Date' ].concat (newState.dataset_codes)].concat (newState.data.map (
      date => [ date.date ].concat (getArraySorted (newState.dataset_codes, date.values))
    ))
  });
})(ChartSide);

export default ConnectedChartSide;
