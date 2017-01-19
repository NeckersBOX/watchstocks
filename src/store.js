const reducer = (state, action) => {
  if ( typeof state === 'undefined' )
    return {
      stockList: []
    };

  let newState = state;

  switch (action.type) {
    case 'ADD_STOCK':
      newState = Object.assign ({}, state, {
        stockList: state.stockList.concat (action.data)
      });
      break;
    case 'REMOVE_STOCK':
      newState = Object.assign ({}, state, {
        stockList: state.stockList.filter (stock => stock.id != action.id )
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

export default reducer;
