const reducer = (state, action) => {
  if ( typeof state === 'undefined' )
    return {
      stockList: [],
      socket_io: null
    };

  let newState = state;
  let newStockList = null;

  switch (action.type) {
    case 'ADD_STOCK':
      newStockList = state.stockList.slice ();
      newStockList.push (action.data);

      if ( state.socket_io )
        state.socket_io.emit ('add_stock', action.data);

      newState = Object.assign ({}, state, {
        stockList: newStockList
      });
      break;
    case 'REMOVE_STOCK':
      newStockList = state.stockList.filter (stock => stock.id != action.id);

      if ( state.socket_io )
        state.socket_io.emit ('rm_stock', action.id);
        
      newState = Object.assign ({}, state, {
        stockList: newStockList
      });
      break;
    case 'INIT_SOCKET.IO':
      newState = Object.assign ({}, state, { socket_io: action.data });
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

export default reducer;
