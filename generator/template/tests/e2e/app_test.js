Feature('App');

Scenario('Open app', (I) => {
  I.amOnPage('/');

  I.say('This test will pass if you enabled demo component');
  I.see('Demo Component', 'h1');
  I.fillField('First name', 'tester'); // using semantic locators
  I.fillField('Last name', 'end2end');
  I.fillField('#username', 'codecept'); // using CSS locators
  I.fillField('Email', 'tester@codecept.io');
  I.fillField('Address', 'some street');
  I.click('Submit');
  I.see('"first_name":"tester"','#result');
  I.see('"last_name":"end2end"','#result');
  I.say("Now, it's your turn! Use this pause mode to write test on your own!");
  pause(); // TODO: Add more assertions when paused!
});
