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
  console.log(errors.default);
  process.exit(-1);
};

/**
 * Parse an operand string into a stack of {coefficient, power} objects,
 * sorted from the biggest power to the smallest.
 * @param {string} operand_string
 */

const parse_operand = (operand_string) => {
  const ret = [];
  const operand_array = operand_string.split(/[+-]/).map((e) => e.trim());
  operand_array.map((el) => {
    let [coefficient, power] = el.split("*").map((e) => e.trim());
    if (!coefficient && !power) throw_error("error_5");
    if (!power) {
      if (isNaN(coefficient)) {
        if (coefficient === "X") {
          coefficient = 1;
          power = 1;
        } else {
          coefficient = 1;
          power = coefficient.replace("X^", "");
          if (Number(power) % 1 !== 0) throw_error("error_6");
        }
      } else {
        power = 0;
      }
    } else {
      if (isNaN(coefficient)) throw_error("error_3");
      if (power === "X") {
        power = 1;
      } else {
        power = power.replace("X^", "");
        if (isNaN(power)) throw_error("error_4");
      }
      if (Number(power) % 1 !== 0) throw_error("error_6");
    }

    [power, coefficient] = [Number(power), Number(coefficient)];
    const index = ret.findIndex((el) => el.power === power);
    if (index === -1) ret.push({ coefficient, power });
    else ret[index].coefficient += coefficient;
  });

  ret.sort((a, b) => {
    if (a.power > b.power) return -1;
    return 1;
  });

  return ret;
};

/**
 * Extract the reduced form of the equation by substracting the second operand
 * from the first.
 * @param {array} operand1
 * @param {array} operand2
 */

const get_reduced_form = (operand1, operand2) => {};

/**
 * Checking if we got exactly one argument.
 */
if (args.length !== 1) throw_error("error_1");

const equation_string = args[0];
const [operand1_string, operand2_string] = equation_string
  .split("=")
  .map((e) => e.trim());

/**
 * Checking if the two operands are both present.
 */
if (!operand1_string || !operand2_string) throw_error("error_2");

const operand1 = parse_operand(operand1_string);
const operand2 = parse_operand(operand2_string);
const degree =
  operand1[0].power > operand2[0].power ? operand1[0].power : operand2[0].power;

// const reducedForm = get_reduced_form(operand1, operand2);
