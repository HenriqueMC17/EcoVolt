const r = require('./pw-diag.json');
r.forEach((t, i) => {
  const err = t.error.replace(/\x1b\[[0-9;]*m/g, '').slice(0, 120);
  console.log(`${i+1}. [${t.status.toUpperCase()}] ${t.test}`);
  if (err) console.log(`   ERR: ${err}`);
});
