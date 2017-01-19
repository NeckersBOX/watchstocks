import React from 'react';
import SearchSide from './SearchSide';

const ChartSide = React.createClass ({ render () { return <span></span>; } });

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
