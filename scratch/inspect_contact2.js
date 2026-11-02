const https = require('https');

https.get('https://arventaventures.online/assets/index-grviRIgN.js', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    let idx = data.indexOf('Contact Arventa Ventures');
    if (idx !== -1) {
      console.log('Found Contact Arventa Ventures:');
      console.log(data.slice(idx - 1500, idx + 2500));
    }
  });
});
