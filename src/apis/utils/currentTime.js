const currentTime = () => {
  const now = new Date();
  const options = { timeZone: "Africa/Cairo" };
  const cairoTime = now.toLocaleString("en-US", options);
  return cairoTime;
};

module.exports = currentTime;
