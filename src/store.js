const reducer = (state, action) => {
  if ( typeof state === 'undefined' )
    return {
      stockList: [],
      statValues: {
        minVal: 0,
        maxVal: 0,
        minDate: new Date (),
        maxDate: new Date ()
      }
    };

  let newState = state;
  let newStockList = null;

  switch (action.type) {
    case 'ADD_STOCK':
      newStockList = state.stockList.slice ();
      newStockList.push (action.data);

      newState = Object.assign ({}, state, {
        stockList: newStockList,
        statValues: doStatOnStock (newStockList)
      });
      break;
    case 'REMOVE_STOCK':
      newStockList = state.stockList.filter (stock => stock.id != action.id);

      newState = Object.assign ({}, state, {
        stockList: newStockList,
        statValues: doStatOnStock (newStockList)
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

const doStatOnStock = (stockList) => stockList.reduce ((prev, curr) => {
  let statOnStock = curr.data.reduce ((prevData, currData) => {
    let date = new Date (currData[0]);

    if ( !prevData )
      return { minVal: currData[4], maxVal: currData[4], minDate: date, maxDate: date };

    return {
      minVal: Math.min (currData[4], prevData.minVal),
      maxVal: Math.max (currData[4], prevData.maxVal),
      minDate: new Date (Math.min (date, prevData.minDate)),
      maxDate: new Date (Math.max (date, prevData.maxDate))
    }
  }, null);

  if ( !prev )
    return statOnStock;

  return {
    minVal: Math.min (statOnStock.minVal, prev.minVal),
    maxVal: Math.max (statOnStock.maxVal, prev.maxVal),
    minDate: new Date (Math.min (statOnStock.minDate, prev.minDate)),
    maxDate: new Date (Math.max (statOnStock.maxDate, prev.maxDate))
  };
}, null);

export default reducer;
