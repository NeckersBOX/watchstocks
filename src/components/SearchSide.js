import React from 'react';
import { connect } from 'react-redux';

const SearchSide = React.createClass ({
  render () {
    return (
      <div className="search-side">
        <h1>SEARCH STOCK</h1>

        <form className="search-form">
          <input type="text" placeholder='Stock name' />
          <button type="submit">
            <i className="material-icons">search</i>
          </button>
        </form>

        <p>Stock list... in progress</p>
      </div>
    )
  }
});

const ConnectedSearchSide = connect ((state) => state)(SearchSide);

export default ConnectedSearchSide;
