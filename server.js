const express = require('express');
const path = require('path');
const app = express();
const PORT = 7020;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n🔬 Balboa Academy Science Club`);
  console.log(`🚀 Server running at: http://localhost:${PORT}`);
  console.log(`📡 Press Ctrl+C to stop.\n`);
});
