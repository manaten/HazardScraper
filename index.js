import cheerio from 'cheerio';
import axios from 'axios';
import moment from 'moment';
import _ from 'lodash';

async function wait(msec) {
  return new Promise(resolve => setTimeout(resolve, msec));
}

async function main() {
  const entries = [];
  for (const page of _.range(1, 83)) {
    const res = await axios.get(`http://www.hazardlab.jp/know/topics/category.php?page=${page}&cd=3`);
    const $ = cheerio.load(res.data);

    $('.box-topics')
      .map((i, topic) => ({
        title   : _.trim($(topic).find('h3 > a').text()),
        url     : 'http://www.hazardlab.jp/know/topics/' + $(topic).find('h3 > a').attr('href'),
        category: _.trim($(topic).find('.category').text()),
        time    : moment(_.trim($(topic).find('.txt-time').text()), 'YYYY年MM月DD日 hh時mm分˙').toDate().toISOString()
      }))
      .get()
      .filter(topic => topic.category === '防犯')
      .forEach(topic => entries.push(topic));
    await wait(500);
  }
  console.log(JSON.stringify(entries));
};
main().catch(e => console.error(e));
