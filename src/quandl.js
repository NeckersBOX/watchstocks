import https from 'https';

export const searchQuandlDatasets = (page_id, query, callback) => {
  https.request ({
    hostname: 'www.quandl.com',
    path: '/api/v3/datasets.json?query=' + query + '&database_code=WIKI&api_key=' + process.env.quandlToken
  }, (apiRes) => {
    let quandlPage = '';

    apiRes.on ('data', (chunk) => quandlPage += chunk);
    apiRes.on ('end', () => callback (JSON.parse (quandlPage)))
  }).end ();
};

export const getQuandlDatasetData = (query, callback) => {
  https.request ({
    hostname: 'www.quandl.com',
    path: '/api/v3/datasets/WIKI/' + query + '.json?api_key=' + process.env.quandlToken
  }, (apiRes) => {
    let quandlPage = '';

    apiRes.on ('data', (chunk) => quandlPage += chunk);
    apiRes.on ('end', () => callback (JSON.parse (quandlPage)))
  }).end ();
};
