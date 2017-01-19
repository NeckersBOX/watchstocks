import React from 'react';
import SearchSide from './SearchSide';
import ChartSide from './ChartSide';

const Layout = React.createClass ({
  render () {
    return (
      <div className="layout">
        <SearchSide />
        <ChartSide />
      </div>
    );
  }
})


export default Layout;
