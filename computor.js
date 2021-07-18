#!/goinfre/slaanani/.brew/Cellar/node@14/14.17.3/bin/node
const errors = require("./errors.json");
const args = process.argv.slice(2);

/**
 * Fetch the error in the json file and prints
 * @param {string} error_id
 */

const throw_error = (error_id) => {
  // console.log("\n" + message + "\n");
  // process.exit(code);
  errors.error_id;
};

/**
 * Checking if we got exactly one argument.
 */
if (args.length !== 1) throw_error(1, "Usage: ./computor.js <equation>");

const equation_string = args[0];
const [operand1, operand2] = equation_string.split("=").map((e) => e.trim());

/**
 * Checking if the two operands are both present.
 */
if (!operand1 || !operand2) throw_error(2, "Syntax error");
