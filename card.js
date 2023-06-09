#!/usr/bin/env node

"use strict";

const boxen = require("boxen");
const chalk = require("chalk");
const inquirer = require("inquirer");
const clear = require("clear");
const open = require("open");
const fs = require("fs");
const request = require("request");
const path = require("path");
const ora = require("ora");
const cliSpinners = require("cli-spinners");

clear();

//! importing User Data from data.json
const res = fs.readFileSync(path.resolve(__dirname, "data.json"));
const user_data = JSON.parse(res);
const {
    user_name,
    user_email,
    twitter_username,
    github_username,
    npx_card_handle,
    job_title,
    skills,
    resume_url,
} = user_data;

const prompt = inquirer.createPromptModule();

const questions = [
    {
        type: "list",
        name: "action",
        message: "What you want to do?",
        choices: [
            //// Send an email
            {
                name: `Send me an ${chalk.green.bold("email")}?`,
                value: () => {
                    open(`mailto:${user_email}`);
                    console.log("\nDone, see you soon at inbox.\n");
                },
            },
            //// Download Resume
            {
                name: `Download my ${chalk.magentaBright.bold("Resume")}?`,
                value: () => {
                    // cliSpinners.dots;
                    const loader = ora({
                        text: " Downloading Resume",
                        spinner: cliSpinners.material,
                    }).start();
                    let pipe = request(`${resume_url}`).pipe(
                        fs.createWriteStream(`./${npx_card_handle}-resume.html`)
                    );
                    pipe.on("finish", function () {
                        let downloadPath = path.join(
                            process.cwd(),
                            `${npx_card_handle}-resume.html`
                        );
                        console.log(`\nResume Downloaded at ${downloadPath} \n`);
                        open(downloadPath);
                        loader.stop();
                    });
                },
            },
            //// Quit
            {
                name: "Just quit.",
                value: () => {
                    console.log("Be happy :)\n");
                },
            },
        ],
    },
];

const data = {
    name: chalk.bold.green(`                  ${user_name}`),
    // work: `${chalk.white("Software Engineer at")} ${chalk.hex("#2b82b2").bold("ClearTax")}`,
    work: `${chalk.white(`${job_title}`)}`,
    skills: `${chalk.white(`${skills}`)}`,
    twitter: chalk.gray("https://twitter.com/") + chalk.cyan(`${twitter_username}`),
    github: chalk.gray("https://github.com/") + chalk.green(`${github_username}`),
    npx: chalk.red("npx") + " " + chalk.white(`${npx_card_handle}`),

    labelWork: chalk.white.bold("       Work:"),
    labelSkills: chalk.white.bold("     Skills:"),
    labelTwitter: chalk.white.bold("    Twitter:"),
    labelGitHub: chalk.white.bold("     GitHub:"),
    labelCard: chalk.white.bold("       Card:"),
};

const me = boxen(
    [
        `${data.name}`,
        ``,
        `${data.labelWork}  ${data.work}`,
        ``,
        `${data.labelSkills}  ${data.skills}`,
        ``,
        `${data.labelTwitter}  ${data.twitter}`,
        `${data.labelGitHub}  ${data.github}`,
        ``,
        `${data.labelCard}  ${data.npx}`,
        ``,
        `${chalk.italic("I am a teenager who loves the computer world")}`,
        `${chalk.italic(" and software D: I am happy to work together")}`,
        `${chalk.italic(" and gain experience. ")}`,
    ].join("\n"),
    {
        margin: 1,
        float: "center",
        padding: 1,
        borderStyle: "single",
        borderColor: "green",
    }
);

console.log(me);

prompt(questions).then(answer => answer.action());
