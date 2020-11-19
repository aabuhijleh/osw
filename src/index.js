#!/usr/bin/env node
const inquirer = require("inquirer");
const dateFormat = require("dateformat");
const getAppDataPath = require("appdata-path");
const path = require("path");
const fs = require("fs");
const chalk = require("chalk");
const makeOSWRequest = require("./request.js");

const configFile = path.join(getAppDataPath(), "osw.json");

(async () => {
  const today = () => dateFormat(new Date(), "dd/mm/yyyy");
  const configFileExists = () => fs.existsSync(configFile);
  const readValue = (value) => JSON.parse(fs.readFileSync(configFile))[value];

  if (!configFileExists()) {
    fs.writeFileSync(configFile, "{}");
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
  if (!inputData.employeeCode || !inputData.password) {
    inputData.employeeCode = readValue("employeeCode");
    inputData.password = readValue("password");
  }

  fs.writeFileSync(configFile, JSON.stringify(inputData));

  console.log(chalk.yellow("Making the request..."));

  await makeOSWRequest(inputData);

  console.log(chalk.green("MenaME OSW request successfully made"));
})();
