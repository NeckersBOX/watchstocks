import React from 'react';
import { connect } from 'react-redux';
import { getStockDataDaily, getStockDataWeekly, getStockDataMonthly, getStockDataYearly } from '../getStockData';

const colorAsService = [
  '#f44336', '#4CAF50', '#FF9800', '#00BCD4',
  '#607D8B', '#9C27B0', '#F4511E', '#5D4037',
  '#1A237E', '#1B5E20', '#d50000', '#AEEA00',
  '#E91E63', '#004D40', '#18FFFF', '#455A64'
];

const StockChart = React.createClass ({
  getInitialState () {
    return { width: 0, height: 400 };
  },
  addGridAndAxisDaily (stockChart, y, x) {
    stockChart.append ('g')
      .attr ('class', 'svg-chart-grid')
      .call (
        d3.axisLeft (y)
          .tickSize (-this.state.width)
          .tickFormat ("")
      );

    stockChart.append ('g')
      .attr ('class', 'svg-chart-grid')
      .call (
        d3.axisBottom (x)
          .ticks (d3.timeMonth)
          .tickSize (this.state.height)
          .tickFormat ("")
      );

    stockChart.append ("g")
      .attr ('class', 'svg-chart-axis-bottom')
      .attr ("transform", "translate(0," + (this.state.height - 1) + ")")
      .call (
        d3.axisBottom (x)
          .ticks (d3.timeDay)
          .tickFormat (d3.timeFormat ("%d"))
      );

    stockChart.append ("g")
      .attr ('class', 'svg-chart-axis-bottom')
      .attr ("transform", "translate(0," + (this.state.height + 20) + ")")
      .call (
        d3.axisBottom (x)
          .ticks (d3.timeMonth)
          .tickFormat (d3.timeFormat ("%B %Y"))
      );
  },
  addGridAndAxisWeekly (stockChart, y, x) {
    stockChart.append ('g')
      .attr ('class', 'svg-chart-grid')
      .call (
        d3.axisLeft (y)
          .tickSize (-this.state.width)
          .tickFormat ("")
      );

    stockChart.append ('g')
      .attr ('class', 'svg-chart-grid')
      .call (
        d3.axisBottom (x)
          .ticks (d3.timeMonth)
          .tickSize (this.state.height)
          .tickFormat ("")
      );

    stockChart.append ("g")
      .attr ('class', 'svg-chart-axis-bottom')
      .attr ("transform", "translate(0," + (this.state.height - 1) + ")")
      .call (
        d3.axisBottom (x)
          .ticks (d3.timeMonday)
          .tickFormat (d3.timeFormat ("%d"))
      );

    stockChart.append ("g")
      .attr ('class', 'svg-chart-axis-bottom')
      .attr ("transform", "translate(0," + (this.state.height + 20) + ")")
      .call (
        d3.axisBottom (x)
          .ticks (d3.timeMonth)
          .tickFormat (d3.timeFormat ("%B %Y"))
      );
  },
  drawChart () {
    let splitTime = 24 * 60 * 60 * 1000;
    let stocksValues = null;
    let tickSize = 15;

    switch (this.props.resolution) {
      case 'DAY':
        stocksValues = getStockDataDaily (this.props.stockList);
        break;
      case 'WEEK':
        splitTime *= 7;
        stocksValues = getStockDataWeekly (this.props.stockList);
        tickSize = 20;
        break;
      case 'MONTH':
        splitTime *= 7 * 30;
        stocksValues = getStockDataMonthly (this.props.stockList);
        break;
      case 'YEAR':
        splitTime *= 7 * 30 * 365;
        stocksValues = getStockDataYearly (this.props.stockList);
        break;
    }

    if ( !stocksValues.stats )
      return;

    let width = Math.round ((
      stocksValues.stats.maxDate.getTime () - stocksValues.stats.minDate.getTime ()
    ) / splitTime) * tickSize;

    if ( width != this.state.width )
      this.setState ({ width: width });

    let svgNode = document.getElementsByClassName ("stockChart");
    while (svgNode[0].firstChild)
      svgNode[0].removeChild (svgNode[0].firstChild);

    let svgAxisNode = document.getElementsByClassName ('stockChartYAxis')
    while (svgAxisNode[0].firstChild)
      svgAxisNode[0].removeChild (svgAxisNode[0].firstChild);

    let stockChart = d3.select ('.stockChart');

    const y = d3.scaleLinear ()
      .domain ([stocksValues.stats.maxVal, stocksValues.stats.minVal])
      .range ([0, this.state.height - 1]);

    const x = d3.scaleTime ()
      .domain ([stocksValues.stats.minDate, stocksValues.stats.maxDate])
      .range ([0, this.state.width]);

    const line = d3.line ().x (d => x (d.date)).y (d => y (d.close));

    switch (this.props.resolution) {
      case 'DAY':
        this.addGridAndAxisDaily (stockChart, y, x);
        break;
      case 'WEEK':
        this.addGridAndAxisWeekly (stockChart, y, x);
        break;
    }

    stocksValues.list.forEach ((stock, idx) => {
      let stockNode = stockChart.append ("path")
        .attr ('id', 'path' + stock.id)
        .attr ("fill", "none")
        .attr ("stroke", colorAsService[idx % colorAsService.length])
        .attr ("stroke-linejoin", "round")
        .attr ("stroke-linecap", "round")
        .attr ("stroke-width", 1.5);

      stockNode.datum (stock.data).attr("d", line);
    });

    d3.select ('.stockChartYAxis').append ("g")
      .attr ('class', 'svg-chart-axis-right')
      .call (d3.axisRight (y))
      .append("text")
        .attr ("y", 6)
        .attr ("dy", "0.71em")
        .attr ("text-anchor", "end")
        .text ("Price");
  },
  render () {
    this.drawChart ();

    return (
      <div>
        <div className="chart-container">
          <svg height={this.state.height + 50} width={this.state.width} className="stockChart"></svg>
        </div>
        <div className="chart-axis">
          <svg height={this.state.height + 50} width={50} className="stockChartYAxis"></svg>
        </div>

        {this.props.stockList.map ((stock, idx) =>
          <div className="legend-stock">
            <div style={{ backgroundColor: colorAsService[idx % colorAsService.length] }}></div>
            {stock.dataset_code}
          </div>
        )}
      </div>
    );
  }
});

const ConnectedStockChart = connect (state => state)(StockChart);

export default ConnectedStockChart;
