const axios = require('axios');
const cron = require('node-cron');

const webHookUrl = "https://hooks.slack.com/services/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";

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
  responses.forEach(async response => {
    const { status, config } = response;
    if(status > 400) {
      await sendAlert(config.url, status)
    }
  });
};



const sendAlert = async (site, statusCode) => {
  await axios.post(webHookUrl, {
      text: `*ERROR* : There is something wrong on ${site}, StatusCode ${statusCode}`,
      username: 'jelly-meter'
    }
  );
};

const sites = ['http://naver.com', 'http://naver.com/arstnhzxicvulhrzv'];

cron.schedule('*/1 * * * *', () => {
  try {
    checkSites(sites);
  } catch (error) {
    console.error(error);
  }
});