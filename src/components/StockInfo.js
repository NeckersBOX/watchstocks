import React from 'react';
import { connect } from 'react-redux';

const StockInfo = React.createClass ({
  render () {
    return (
      <div className="stock-info">
        <h2>
          {this.props.dataset_code} <small>{this.props.database_code}</small>
          <i onClick={this.removeStock} className="remove material-icons">close</i>
        </h2>
        <p>{this.props.name}</p>
      </div>
    );
  },
  removeStock () {
    this.props.dispatch ({
      type: 'REMOVE_STOCK',
      id: this.props.id
    });
  }
});

const ConnectedStockInfo = connect ((state) => ({}))(StockInfo);

export default ConnectedStockInfo;
