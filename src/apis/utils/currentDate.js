const currentDate = () => {
  const now = new Date();

  //+3 hour to get cairo timezone with summer time modification
  // now.setHours(now.getHours() + 3);

  const date = {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate(),
  };

  return date;
};

module.exports = currentDate;
