function errorFormat(value, msg, param, location) {
  return {
    errors: [
      {
        value: value,
        msg: msg,
        param: param,
        location: location,
      },
    ],
  };
}

module.exports = errorFormat;
