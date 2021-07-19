#!/goinfre/slaanani/.brew/Cellar/node@14/14.17.3/bin/node
const errors = require("./errors.json");
const args = process.argv.slice(2);

/**
 * Fetch the error in the json file and prints
 * @param {string} error_id
 */

const throw_error = (error_id) => {
	Object.entries(errors).map((el) => {
		const [id, err] = el;
		if (id === error_id) {
			console.log(err.message);
			process.exit(err.code);
		}
	});
	process.exit(-1);
};

/**
 * Checking if we got exactly one argument.
 */
if (args.length !== 1) throw_error("error_1");

const equation_string = args[0];
const [operand1, operand2] = equation_string.split("=").map((e) => e.trim());

/**
 * Checking if the two operands are both present.
 */
if (!operand1 || !operand2) throw_error("error_2");

console.log(operand1);
console.log(operand2);
