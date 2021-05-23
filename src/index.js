#!/usr/bin/env node
const inquirer = require("inquirer");
const dateFormat = require("dateformat");
const getAppDataPath = require("appdata-path");
const path = require("path");
const fs = require("fs");
const chalk = require("chalk").bold;
const yargs = require("yargs/yargs");
const getWorkingHours = require("./utils/getWorkingHours.js");
const makeOSWRequest = require("./api/mename.js");

const configFile = path.join(getAppDataPath(), "osw.json");
const { clear, reason, start, end } = yargs(process.argv)
  .option("clear", {
    alias: "c",
    type: "boolean",
    description: "Clear stored credentials",
  })
  .option("reason", {
    alias: "r",
    type: "string",
    description: "Add OSW request notes",
    default: "Rotation",
  })
  .option("start", {
    alias: "s",
    type: "string",
    description: "Add start time",
    defaultDescription: "ASAL start working hour",
  })
  .option("end", {
    alias: "e",
    type: "string",
    description: "Add end time",
    defaultDescription: "ASAL end working hour",
  }).argv;

(async () => {
  const today = () => dateFormat(new Date(), "dd/mm/yyyy");
  const configFileExists = () => fs.existsSync(configFile);
  const readValue = (value) => JSON.parse(fs.readFileSync(configFile))[value];

  if (!configFileExists() || clear) {
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
  inputData.employeeCode = inputData.employeeCode || readValue("employeeCode");
  inputData.password = inputData.password || readValue("password");

  fs.writeFileSync(configFile, JSON.stringify(inputData));

  console.log(chalk.yellow("Making the request..."));

  const workPeriod = getWorkingHours(inputData.oswDate);

  try {
    await makeOSWRequest({
      ...inputData,
      reason,
      start: start || workPeriod.start,
      end: end || workPeriod.end,
    });
    console.log(chalk.green("MenaME OSW request successfully made"));
  } catch (err) {
    console.error(chalk.red("Something went wrong"), err);
  }
})();
