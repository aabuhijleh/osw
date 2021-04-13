const { readFileSync } = require("fs");
const { join } = require("path");

const getAvailableOptions = () => {
  const readme = readFileSync(join(__dirname, "../..", "README.md"), "utf8");
  const options = readme.substring(
    readme.indexOf("Available options"),
    readme.length - 6
  );
  return options;
};

module.exports = getAvailableOptions;
