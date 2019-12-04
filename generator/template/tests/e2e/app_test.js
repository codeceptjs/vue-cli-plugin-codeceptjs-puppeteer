Feature('App');

Scenario('Open app', (I) => {
  I.amOnPage('/');
  I.see('Vue');
});
