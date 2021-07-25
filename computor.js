#!/goinfre/slaanani/.brew/Cellar/node@14/14.17.3/bin/node
/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   computor.js                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: slaanani <slaanani@student.1337.ma>        +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/07/22 21:14:41 by slaanani          #+#    #+#             */
/*   Updated: 2021/07/22 21:14:41 by slaanani         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const errors = require("./errors.json");
const myMath = require("./myMath");
const { stdout, exit, argv } = require("process");
const args = argv.slice(2);

/**
 * Fetch the error in the json file and writes
 * @param {string} error_id
 */

const throw_error = (error_id) => {
  Object.entries(errors).map((el) => {
    const [id, err] = el;
    if (id === error_id) {
      stdout.write(err.message + "\n");
      // stdout.write("Error code: " + err.code);
      exit(err.code);
    }
  });
  stdout.write(errors.default + "\n");
  exit(-1);
};

/**
 * Refine the equation by adding an extra + to the negative terms.
 * @param {string} equation_string
 * @returns
 */

const refine_operand = (equation_string) => {
  for (let i = 0; equation_string[i]; i++) {
    if (
      equation_string[i] === "-" &&
      equation_string[i - 1] !== "^" &&
      i !== 0
    ) {
      equation_string =
        equation_string.substr(0, i) +
        "+" +
        equation_string.substr(i, equation_string.length - i);
      i++;
    }
  }
  return equation_string;
};

/**
 * Parse an operand string into a stack of {coefficient, power} objects,
 * sorted from the smallest power to the biggest.
 * @param {string} operand_string
 */

const parse_operand = (operand_string) => {
  let ret = [];
  const operand_array = operand_string.split("+").map((e) => e.trim());
  operand_array.map((el) => {
    let sign = 1;
    if (el[0] === "-") {
      sign = -1;
      el = el.substr(1);
    }
    let term_splited = el.split("*").map((e) => e.trim());
    if (term_splited.length > 2) throw_error("error_8");
    let [coefficient, power] = term_splited;
    if (!coefficient && !power) throw_error("error_5");
    if (!power) {
      if (isNaN(coefficient)) {
        if (coefficient === "X") {
          coefficient = 1;
          power = 1;
        } else {
          power = coefficient.replace("X^", "");
          coefficient = 1;
          if (isNaN(power)) throw_error("error_4");
          if (Number(power) % 1 !== 0) throw_error("error_6");
          if (Number(power) < 0) throw_error("error_7");
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
      if (Number(power) < 0) throw_error("error_7");
    }

    [power, coefficient] = [Number(power), Number(coefficient)];
    const index = ret.findIndex((el) => el.power === power);
    if (index === -1) ret.push({ coefficient: sign * coefficient, power });
    else {
      ret[index].coefficient += sign * coefficient;
      if (ret[index].coefficient === 0)
        ret = ret.filter((el, i) => i !== index);
    }
  });

  ret.sort((a, b) => {
    if (a.power <= b.power) return -1;
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

const get_reduced_form = (operand1, operand2) => {
  const ret = operand1;
  const sign =
    (operand1.length === 1 &&
      operand1[0].coefficient === 0 &&
      operand1[0].power === 0) ||
    operand1.length === 0
      ? 1
      : -1;

  for (let i = 0; operand2[i]; i++) {
    const index = operand1.findIndex((el) => el.power === operand2[i].power);
    if (index === -1) {
      ret.push({
        coefficient: sign * operand2[i].coefficient,
        power: operand2[i].power,
      });
    } else {
      ret[index].coefficient -= operand2[i].coefficient;
    }
  }
  return ret
    .filter((el) => el.coefficient !== 0)
    .sort((a, b) => {
      if (a.power <= b.power) return -1;
      return 1;
    });
};

/**
 * Get the degree of the equation
 * @param {array} equation
 */

const get_degree = (equation) => {
  if (equation.length === 0) return 0;
  else return equation[equation.length - 1].power;
};

/**
 * Write the equation in its reduced form as a string.
 * @param {array} equation
 */

const write_reduced_form = (equation) => {
  stdout.write("Reduced form: ");
  if (equation.length === 0) stdout.write("0");
  else
    for (let i = 0; equation[i]; i++) {
      let { coefficient, power } = equation[i];
      if (i !== 0)
        if (coefficient < 0) {
          stdout.write(" - ");
          coefficient *= -1;
        } else {
          stdout.write(" + ");
        }
      stdout.write(`${coefficient} * X^${power}`);
    }
  stdout.write(" = 0\n");
};

/**
 * Calculate and write the solution of the first degree equation.
 * @param {array} equation
 */

const write_first_degree_solution = (equation) => {
  const b = equation.find((el) => el.power === 1)?.coefficient || 0;
  const c = equation.find((el) => el.power === 0)?.coefficient || 0;

  stdout.write(`The solution is:\n${-c / b}\n`);
};

/**
 * Calculate the discriminant of the second degree polynomial.
 * @param {array} equation
 * @returns {number} The discriminant
 */

const calculate_discriminant = (equation) => {
  const a = equation.find((el) => el.power === 2)?.coefficient || 0;
  const b = equation.find((el) => el.power === 1)?.coefficient || 0;
  const c = equation.find((el) => el.power === 0)?.coefficient || 0;

  return b * b - 4 * a * c;
};

/**
 * Calculate and write the solution(s) of the second degree equation based
 * on the discriminant.
 * @param {array} equation
 * @param {number} discriminant
 */

const write_second_degree_solutions = (equation, discriminant) => {
  const a = equation.find((el) => el.power === 2)?.coefficient || 0;
  const b = equation.find((el) => el.power === 1)?.coefficient || 0;
  const c = equation.find((el) => el.power === 0)?.coefficient || 0;

  if (discriminant === 0) {
    stdout.write(`Discriminant is null, the solution is:\n`);
    stdout.write(`${-b / (2 * a)}\n`);
  }
  if (discriminant > 0) {
    stdout.write(`Discriminant is strictly positive, the two solutions are:\n`);
    stdout.write(`${(-b - myMath.sqrt(discriminant)) / (2 * a)}\n`);
    stdout.write(`${(-b + myMath.sqrt(discriminant)) / (2 * a)}\n`);
  } else {
    stdout.write(`Discriminant is strictly negative, the two solutions are:\n`);
    stdout.write(
      `${-b / (2 * a)} + i * ${myMath.sqrt(-discriminant) / (2 * a)}\n`
    );
    stdout.write(
      `${-b / (2 * a)} - i * ${myMath.sqrt(-discriminant) / (2 * a)}\n`
    );
  }
};

/**
 * Checking if we got exactly one argument.
 */
if (args.length !== 1) throw_error("error_1");

const equation_string = args[0].replace(/\s/g, "");

if (equation_string.length === 0) throw_error("error_2");

equation_string_splited = equation_string.split("=").map((e) => e.trim());
if (equation_string_splited.length !== 2) throw_error("error_2");
let [operand1_string, operand2_string] = equation_string_splited;

/**
 * Checking if the two operands are both present.
 */
if (!operand1_string || !operand2_string) throw_error("error_2");

[operand1_string, operand2_string] = [
  refine_operand(operand1_string),
  refine_operand(operand2_string),
];
const operand1 = parse_operand(operand1_string);
const operand2 = parse_operand(operand2_string);

const reducedForm = get_reduced_form(operand1, operand2);

const degree = get_degree(reducedForm);

write_reduced_form(reducedForm);
stdout.write(`Polynomial degree: ${degree}\n`);
if (degree > 2) {
  stdout.write(
    "The polynomial degree is strictly greater than 2, I can't solve.\n"
  );
  process.exit();
}

/**
 * Calculate Solutions
 */
if (degree === 0) {
  /**
   * In case of degree 0, that would be a number = 0 which is either impossible
   * or always true.
   */
  if (reducedForm.length === 0 || reducedForm[0].coefficient === 0) {
    stdout.write("This equation is always correct.\n");
  } else {
    stdout.write("This equation has no solution.\n");
  }
} else if (degree === 1) {
  /**
   * In case of degree 1, we'll have one solution (X = -C / B) (B * X + C = 0)
   */
  write_first_degree_solution(reducedForm);
} else {
  /**
   * In case of degree 2, we'll calculate the discriminant and extract the
   * solutions.
   */
  const discriminant = calculate_discriminant(reducedForm);
  write_second_degree_solutions(reducedForm, discriminant);
}
