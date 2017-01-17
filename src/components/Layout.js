import React from 'react';
import { connect } from 'react-redux';
import SearchSide from './SearchSide';

const ChartSide = React.createClass ({ render: () { return <span></span>; } });

const Layout = React.createClass ({
  render () {
    console.log (this.props);

    return (
      <div className="layout">
        <SearchSide />
        <ChartSide />
      </div>
    );
  }
})

const ConnectedLayout = connect ((state) => state)(Layout);
export default ConnectedLayout;
