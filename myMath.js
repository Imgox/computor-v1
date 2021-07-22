const square = (n, i, j) => {
	let mid = (i + j) / 2;
	let mul = mid * mid;
	if (mul === n || abs(mul - n) < 0.00001) {
		return mid;
	} else if (mul < n) {
		return square(n, mid, j);
	} else {
		return square(n, i, mid);
	}
};
// Function to find the square root of n
const sqrt = (num) => {
	let i = 1;
	const found = false;
	while (!found) {
		// If n is a perfect square
		if (i * i === num) {
			return i;
		} else if (i * i > num) {
			let res = square(num, i - 1, i);
			return res;
		}
		i++;
	}
};

const abs = (num) => (num < 0 ? -num : num);

module.exports = { sqrt, abs };
