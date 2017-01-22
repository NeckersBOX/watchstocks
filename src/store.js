const reducer = (state, action) => {
  if ( typeof state === 'undefined' )
    return {
      stockList: [],
      dateList: [],
    };

  let newState = state;

  switch (action.type) {
    case 'ADD_STOCK':
      let newStockList = state.stockList.concat (action.data);

      newState = Object.assign ({}, state, {
        stockList: newStockList,
        dateList: getDateList (newStockList, state.dateList)
      });
      break;
    case 'REMOVE_STOCK':
      let newStockList = state.stockList.filter (stock => stock.id != action.id);

      newState = Object.assign ({}, state, {
        stockList: newStockList,
        dateList: getDateList (newStockList, state.dateList);
      });
      break;
    case 'CHART_RES_DAY':
      let stateData = {
        dataset_codes: state.stockList.map (stock => stock.dataset_code),
        data: state.dateList.map (date => {
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
            date: new Date (date),
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

      newState = Object.assign ({}, newState, {
        chartData: [[ 'Date' ].concat (stateData.dataset_codes)].concat (stateData.data.map (
          date => [ date.date ].concat (getArraySorted (stateData.dataset_codes, date.values))
        ))
      });
      break;
    case 'POST':
      postRequest (action.url, action.data, action.callback);
      break;
  }

  return newState;
};

const postRequest = (url, data, callback) => {
  let request = new XMLHttpRequest ();
  request.open ('POST', url, true);
  request.setRequestHeader ('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');

  request.onload = () => {
    if ( request.status != 200 )
      return callback ({ error: request.status + ' ' + request.statusText });

    callback (JSON.parse (request.responseText));
  };

  request.onerror = () => console.error ('POST ' + url + '. Request failed.');

  let postData = [];
  for ( let key in data ) {
    if ( !data.hasOwnProperty (key) ) continue;

    postData.push (key + '=' + data[key]);
  }

  request.send (postData.join ('&'));
};

const getDateList = (stockList, dateList) => {
  return [];
  let newDateList = [];

  for ( let stockId in stockList ) {
    for ( let dataId in stockList[stockId].data ) {
      if ( dateList.indexOf (stockList[stockId].data[dataId][0]) === -1 )
        newDateList.push (stockList[stockId].data[dataId][0]);
    }
  }

  return dateList.concat (newDateList).sort ();
};

export default reducer;
