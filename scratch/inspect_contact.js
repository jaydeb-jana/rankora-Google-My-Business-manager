const https = require('https');

https.get('https://arventaventures.online/assets/index-grviRIgN.js', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    let idx = data.indexOf('/contact"');
    if (idx !== -1) {
      console.log('Found /contact":');
      console.log(data.slice(idx - 100, idx + 3500));
    }
  });
});
