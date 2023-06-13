const currentDate = () => {
  const now = new Date();

  //+2 hour to get cairo timezone without summer time modification
  now.setHours(now.getHours() + 2);

  const date = {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate(),
  };

  return date;
};

module.exports = currentDate;
