const path = require('path');
const HistoryProvider = require(path.resolve('js', 'model', 'HistoryProvider'));

module.exports = function(app) {
  app.get('/api/history/list', async (req, res) => {
    try {
      const history = await new HistoryProvider().find(req.query);
      res.json({ history });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
};
