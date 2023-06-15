const currentTime = () => {
  const now = new Date();
  now.setHours(now.getHours() + 3);

  // const options = { timeZone: "Africa/Cairo" };
  // const cairoTime = now.toLocaleString("en-US", options);
  // return cairoTime;
  return now;
};

module.exports = currentTime;
