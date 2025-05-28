var express = require('express');
var router = express.Router();
var axios = require('axios');
var moment = require('moment');

router.get('/', async function (req, res, next) {
  try {
    res.render('index', {
      title: 'Market Prices',
      lName: "",
      sName: "",
      currentPrice: 0,
      lastDayClose: 0,
      lastDayOpen: 0,
      lastDayHigh: 0,
      lastDayLow: 0,
      startDate: moment().format('YYYY-MM-DD'),
      endDate: moment().format('YYYY-MM-DD')
    });
  } catch (errr) {
    console.log(error);
  }
})
router.post('/', async function (req, res, next) {
  try {
    // Get query parameters
    let shName = req.body.shareName || 'SUZLON.NS';
    const startDate = req.body.startDate || moment().format('YYYY-MM-DD'); // Default start date
    const endDate = req.body.endDate || moment().format('YYYY-MM-DD'); // Default end date
    const shareName = shName + ".NS";
    console.log(shareName);
    const startDateObj = moment(startDate, 'YYYY-MM-DD').startOf('day').toDate();
    const td = new Date();
    td.setHours(0, 0, 0, 0);
    // console.log(td)
    // console.log(startDateObj)
    // console.log(startDateObj <= td);

    if (startDateObj < td) {
      // Convert the dates to Unix timestamp format
      const startTimestamp = moment(startDate, 'YYYY-MM-DD').unix();
      const endTimestamp = moment(endDate, 'YYYY-MM-DD').unix();

      // Construct the API URL
      const apiUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${shareName}?period1=${startTimestamp}&period2=${endTimestamp}&interval=1d`;

      // Fetch the API data
      const response = await axios.get(apiUrl);
      const data = response.data;

      // Log the entire response for debugging
      //console.log('API Response:', JSON.stringify(data, null, 2));

      // Extract the required values
      const longName = data.chart.result[0].meta.longName;
      const symbol = data.chart.result[0].meta.symbol;
      const currentPrice = (data.chart.result[0].meta.regularMarketPrice).toFixed(2);
      const quote = (data.chart.result[0].indicators.quote[0]);
      const lastDayClose = (quote.close[quote.close.length - 1]).toFixed(2);
      const lastDayOpen = (quote.open[quote.open.length - 1]).toFixed(2);
      const lastDayHigh = (quote.high[quote.high.length - 1]).toFixed(2);
      const lastDayLow = (quote.low[quote.low.length - 1]).toFixed(2);

      // Pass the values to the EJS template
      res.render('index', {
        title: 'Market Prices',
        lName: longName,
        sName: shName,
        currentPrice: currentPrice,
        lastDayClose: lastDayClose,
        lastDayOpen: lastDayOpen,
        lastDayHigh: lastDayHigh,
        lastDayLow: lastDayLow,
        startDate: startDate,
        endDate: endDate
      });
    } else {
      res.render('error', {
        message: 'Check the start date',
        title: "Error Page"
      })
    }

  } catch (error) {
    console.error('Error fetching data:', error);
    res.render('index', {
      title: 'Market Prices',
      sName: 'Error fetching data',
      lName: 'Error fetching data',
      currentPrice: 'Error fetching data',
      lastDayClose: 'Error fetching data',
      lastDayOpen: 'Error fetching data',
      lastDayHigh: 'Error fetching data',
      lastDayLow: 'Error fetching data',
      startDate: moment().format('YYYY-MM-DD'),
      endDate: moment().format('YYYY-MM-DD')
    });
  }
});

module.exports = router;
