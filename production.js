// https features for production/server environment

'use strict';

module.exports = (app, port) => {
  app.enable('trust proxy');

  app.use ((req, res, next) => {
    if (req.secure) {
      next();
    } else {
      const proxypath = process.env.PROXY_PASS || ''
      // redirecting to https
      res.redirect(301, `https://${req.headers.host}${proxypath}${req.url}`);
    }
  });

  app.listen(port, () => console.log(`Smartsoft web app listening on port ${port}!`));
};