const axios = require('axios');
const cron = require('node-cron');


const getResponse = async (site) => {
  try {
    return await axios.get(site);
  } catch (error) {
    return error.response;
  }
};

const checkSites = async (sites) => {
  const getResponseRequests = sites.map(site => getResponse(site));
  const responses = await Promise.all(getResponseRequests);
  responses.forEach(response => {
    const { status, config } = response;
    if(status > 400) {
      sendAlert(config.url, status)
    }
  });
};



const sendAlert = (site, statusCode) => {
  console.log(`There is something wrong on ${site}, StatusCode ${statusCode}`)
};


const sites = ['http://naver.com', 'http://naver.com/arstnhzxicvulhrzv'];

cron.schedule('*/1 * * * *', () => {
  try {
    checkSites(sites);
  } catch (error) {
    console.error(error);
  }
});



