import inquirer from "inquirer";
import colors from "colors";

// Main question
const questionList = [
  {
    type: "list",
    name: "option",
    message: "What do you want to do?",
    choices: [
      {
        value: 1,
        name: `${"1.".green} Search city`,
      },
      {
        value: 2,
        name: `${"2.".green} History`,
      },
      {
        value: 0,
        name: `${"0.".green} Close`,
      },
    ],
  },
];

// function that prints the questions on the console and returns chosen option
const inquirerMenu = async () => {
  console.clear();

  console.log("==================================".green);
  console.log("           WEATHER APP".white);
  console.log("==================================\n".green);

  const { option } = await inquirer.prompt(questionList);

  // We return the user's option
  return option;
};

// function to create a pause in the console
const pause = async () => {
  const question = [
    {
      type: "input",
      name: "enter",
      message: `Press ${"ENTER".green} to continue`,
    },
  ];

  // spacing
  console.log(`\n`);

  await inquirer.prompt(question);
};

// function to enter a value
const readInput = async (message) => {
  const question = [
    {
      type: "input",
      name: "desc",
      message,
      validate(value) {
        if (value.length === 0) {
          return "Please type an option";
        }

        return true;
      },
    },
  ];

  const { desc } = await inquirer.prompt(question);

  // return user's input
  return desc;
};

// return user's place option id
const listPlaces = async (places = []) => {
  // map places in array and return an array of objects with the id and option
  const choices = places.map((place, i) => {
    //
    const idx = `${i + 1}.`.green;

    return {
      value: place.id,
      name: `${idx} ${place.name}`,
    };
  });

  // Add close option
  choices.unshift({
    value: "0",
    name: "0.".green + " Close",
  });

  // Questions prompt
  const question = [
    {
      type: "list",
      name: "id",
      message: "Select place: ",
      choices,
    },
  ];

  // print in the console questions
  const { id } = await inquirer.prompt(question);

  return id;
};

export { inquirerMenu, pause, readInput, listPlaces };
