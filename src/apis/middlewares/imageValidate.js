const constrains = (req, res, next) => {
  if (!req.body.image) {
    return next();
  }

  const contentLength = parseInt(req.get("Content-Length"));
  const contentLengthMB = (contentLength / (1024 * 1024)).toFixed(3);

  if (contentLengthMB > 10) {
    return res.send(400).json({ msg: "Too large payload size" });
  }

  //   console.log("Payload size:", contentLengthMB, "MB");

  if (
    req.body.image.toString().startsWith("data:image/png") ||
    req.body.image.toString().startsWith("data:image/jpeg") ||
    req.body.image.toString().startsWith("data:image/jpg")
  ) {
    next();
  } else {
    return res.status(400).json({ msg: "Wrong image formate" });
  }
};

module.exports = constrains;
