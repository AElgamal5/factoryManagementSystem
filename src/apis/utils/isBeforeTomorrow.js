function isBeforeTomorrow(date) {
  const test = new Date(date);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const cairoTime = tomorrow.toLocaleString("en-US", {
    timeZone: "Africa/Cairo",
  });

  return new Date(cairoTime) < tomorrow;
}

module.exports = isBeforeTomorrow;
