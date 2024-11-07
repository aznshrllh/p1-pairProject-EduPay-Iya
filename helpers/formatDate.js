const moment = require("moment");

function formatDateRelative(date) {
  return moment(date).fromNow();
}

module.exports = { formatDateRelative };
