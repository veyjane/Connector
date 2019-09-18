const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req, res, next) {
  // Get token from header
  const token = req.header('x-auth-token');

  //Check if not token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verify token
  try {
    const decode = jwt.verify(token, config.get('jwtSecret'));
    //decode后从payload中得到user对象，并将其赋值给req.user
    req.user = decode.user;
    //next函数主要负责将控制权交给下一个中间件，如果当前中间件没有终结请求，并且next没有被调///用，那么请求将被挂起，后边定义的中间件将得不到被执行的机会。
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
