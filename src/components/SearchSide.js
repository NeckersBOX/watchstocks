import React from 'react';
import { connect } from 'react-redux';
import StockInfo from './StockInfo';

const SearchSide = React.createClass ({
  getInitialState () {
    return {
      searchStock: '',
      stockList: [],
      lastRequest: 0,
      loadingSuggest: false,
      loadingStock: false
    };
  },
  render () {
    return (
      <div className="search-side">
        <h1>SEARCH STOCK</h1>

        {this.state.loadingSuggest ?
          <small>Loading list for {this.state.searchStock}..</small> :
          <small>No suggestions, search for more</small>}
        <form className="search-form">
          <input type="text" list="stockList" onChange={this.editSearch}
            placeholder='Stock name' value={this.state.searchStock} />
          <datalist id="stockList">
            {this.state.stockList.map ((val, idx) => <option key={idx} value={val.dataset_code} />)}
          </datalist>

          <button type="submit" onClick={this.addStock}>
            <i className="material-icons">search</i>
          </button>
        </form>

        <hr />
        {this.state.loadingStock ? <small>Loading {this.state.searchStock}..</small> : ''}

        {this.props.stockList.map ((stock, idx) => <StockInfo key={idx} {...stock} />)}
      </div>
    )
  },
  editSearch (e) {
    let requestTime = new Date ().getTime ();
    let searchStock = e.target.value.toUpperCase ().split ('').filter (val => /[A-Za-z]/.test (val)).join ('');

    if ( searchStock.length < 1 )
      return this.setState ({ searchStock: searchStock, stockList: [] });
    else this.setState ({ searchStock: searchStock });

    if ( requestTime < (this.state.lastRequest + 300) )
      return;

    this.setState ({ lastRequest: requestTime, loadingSuggest: true });

    this.props.dispatch ({
      type: 'POST',
      url: '/search-stock',
      data: {
        query: searchStock
      },
      callback: (res) => {
        if ( res.error ) {
          this.setState ({ stockList: [], lastRequest: requestTime, loadingSuggest: false });
          return console.warn (res.error);
        }

        if ( res.query != this.state.searchStock ) {
          this.setState ({
            stockList: [],
            lastRequest: res.requestTime,
            loadingSuggest: false
          });
        }
        else {
          this.setState ({
            stockList: res.stockList,
            lastRequest: res.requestTime,
            loadingSuggest: false
          });
        }
      }
    });
  },
  addStock (e) {
    e.preventDefault ();

    if ( this.state.searchStock.length < 1 )
      return;

    if ( this.props.stockList.filter (stock => stock.dataset_code == this.state.searchStock).length )
      return;

    this.setState ({ loadingStock: true });

    this.props.dispatch ({
      type: 'POST',
      url: '/get-stock',
      data: {
        query: this.state.searchStock
      },
      callback: (res) => {
        this.setState ({ loadingStock: false });

        if ( res.error )
          return console.warn (res.error);

        this.props.dispatch ({
          type: 'ADD_STOCK',
          data: res.stockData
        });
      }
    });
  }
});

const ConnectedSearchSide = connect ((state) => state)(SearchSide);

export default ConnectedSearchSide;
