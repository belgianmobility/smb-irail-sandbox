// eslint-disable-next-line import/no-extraneous-dependencies
import { Selector } from 'testcafe';

const { APP_URL_TESTCAFE = 'http://localhost:3000/' } = process.env;

console.log('APP_URL_TESTCAFE', APP_URL_TESTCAFE);

fixture`It renders`
  .page`${APP_URL_TESTCAFE}`;


test('Homepage', async (t) => {
  const content = await Selector('#root p');
  const reactDocLink = await Selector('#root .App-link');

  await t
    .expect(content.innerText)
    .eql('Edit src/App.js and save to reload.');

  await t
    .expect(reactDocLink.innerText)
    .eql('Learn React');
});
