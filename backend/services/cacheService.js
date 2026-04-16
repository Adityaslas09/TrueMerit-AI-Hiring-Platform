const NodeCache = require('node-cache');
// TTL of 5 minutes by default
const myCache = new NodeCache({ stdTTL: 300, checkperiod: 320 });

const getFromCache = (key) => {
  return myCache.get(key);
};

const setToCache = (key, data, ttl = 300) => {
  myCache.set(key, data, ttl);
};

const invalidateCacheByPrefix = (prefix) => {
  const keys = myCache.keys();
  const toDel = keys.filter(k => k.startsWith(prefix));
  if(toDel.length > 0) {
      myCache.del(toDel);
  }
};

module.exports = {
  getFromCache,
  setToCache,
  invalidateCacheByPrefix
};
