const currentDate = () => {
  const now = new Date();

  //+3 hour to get cairo timezone with summer time modification
  now.setHours(now.getHours() + 3);

  const date = {
    year: now.getUTCFullYear(),
    month: now.getUTCMonth() + 1,
    day: now.getUTCDate(),
    now,
  };

  return date;
};

module.exports = currentDate;
