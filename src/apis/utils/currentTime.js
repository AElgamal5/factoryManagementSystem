const currentTime = () => {
  const now = new Date();
  now.setHours(now.getUTCHours() + 3);
  return now;
};

module.exports = currentTime;
