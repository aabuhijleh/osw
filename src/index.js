#!/usr/bin/env node
const inquirer = require("inquirer");
const dateFormat = require("dateformat");
const getAppDataPath = require("appdata-path");
const path = require("path");
const fs = require("fs");
const chalk = require("chalk").bold;
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const argv = yargs(hideBin(process.argv)).argv;
const makeOSWRequest = require("./api/mename.js");

const configFile = path.join(getAppDataPath(), "osw.json");

(async () => {
  const today = () => dateFormat(new Date(), "dd/mm/yyyy");
  const configFileExists = () => fs.existsSync(configFile);
  const readValue = (value) => JSON.parse(fs.readFileSync(configFile))[value];

  if (!configFileExists() || argv.clear) {
    fs.writeFileSync(configFile, "{}");
  } else {
    console.log(chalk.magenta(`Config file detected: ${configFile}`));
    console.log(
      chalk.magenta(`You can use "--clear" to delete stored credentials`)
    );
  }

  const inputData = await inquirer.prompt([
    {
      type: "input",
      name: "employeeCode",
      message: "What's your MenaME employee code",
      when: () => !readValue("employeeCode"),
    },
    {
      type: "password",
      name: "password",
      message: "What's your MenaME password",
      when: () => !readValue("password"),
    },
    {
      type: "input",
      name: "oswDate",
      message: "What's the date of this OSW request",
      default: today,
    },
  ]);

  // add values from config file
  inputData.employeeCode = inputData.employeeCode || readValue("employeeCode");
  inputData.password = inputData.password || readValue("password");

  fs.writeFileSync(configFile, JSON.stringify(inputData));

  console.log(chalk.yellow("Making the request..."));

  try {
    await makeOSWRequest({ ...inputData, reason: argv.reason || "Rotation" });
    console.log(chalk.green("MenaME OSW request successfully made"));
  } catch (err) {
    console.error(
      chalk.red("Request possibly failed, make sure your credentials are valid")
    );
    console.error(err);
  }
})();
