const stockListStats = (stockList) => stockList.reduce ((prev, curr) => {
  let statOnStock = curr.data.reduce ((prevData, currData) => {
    if ( !prevData )
      return {
        minVal: currData.close,
        maxVal: currData.close,
        minDate: currData.date,
        maxDate: currData.date
      };

    return {
      minVal: Math.min (currData.close, prevData.minVal),
      maxVal: Math.max (currData.close, prevData.maxVal),
      minDate: new Date (Math.min (currData.date, prevData.minDate)),
      maxDate: new Date (Math.max (currData.date, prevData.maxDate))
    };
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

export const getStockDataDaily = (stockList) => {
  let stockListDaily = stockList.map (stock => Object.assign ({}, stock, {
    data: stock.data.map (
      data => ({
        date: new Date (data[0]),
        close: +data[4]
      })
    )
  }));

  return {
    stats: stockListStats (stockListDaily),
    list: stockListDaily
  };
};

export const getStockDataWeekly = (stockList) => {
  let stockListWeekly = stockList.map (stock => {
    let weekData = [{
      date: null,
      close: 0,
      records: 0,
      last_date: null
    }];

    const dayTime = 24 * 60 * 60 * 1000;
    const weekTime = 7 * dayTime;

    stock.data = stock.data.sort ((a, b) => new Date (a[0]) - new Date (b[0]));

    for ( let idx in stock.data ) {
      let currDate = new Date (stock.data[idx][0]);

      if ( idx == 0 ) {
        weekData[weekData.length - 1].close += +stock.data[idx][4];
        weekData[weekData.length - 1].records++;
        weekData[weekData.length - 1].last_date = currDate;
        continue;
      }

      if ( currDate.getDay () != 1 && (+idx + 1) < stock.data.length
        && Math.abs (weekData[weekData.length - 1].last_date.getTime () - currDate.getTime ()) < weekTime ) {
        weekData[weekData.length - 1].close += +stock.data[idx][4];
        weekData[weekData.length - 1].records++;
        continue;
      }

      weekData[weekData.length - 1].date = currDate;
      if ( weekData[weekData.length - 1].records ) {
        weekData[weekData.length - 1].close += +stock.data[idx][4];
        weekData[weekData.length - 1].close /= weekData[weekData.length - 1].records;
      }
      else weekData[weekData.length - 1].close = weekData[weekData.length - 2].close;

      if ( (+idx + 1) < stock.data.length ) {
        weekData.push ({
          date: null,
          close: 0,
          records: 0,
          last_date: new Date (currDate.getTime () - dayTime)
        });
      }
    }

    return Object.assign ({}, stock, { data: weekData });
  });

  console.log ({
    stats: stockListStats (stockListWeekly),
    list: stockListWeekly
  });

  return {
    stats: stockListStats (stockListWeekly),
    list: stockListWeekly
  };
};

export const getStockDataMonthly = () => ({});
export const getStockDataYearly = () => ({});
