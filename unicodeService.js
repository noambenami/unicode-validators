// Unicode data from: https://github.com/mathiasbynens/unicode-11.0.0
import regexes from './unicode11Regexes';

export const noCategoriesProvidedError = () =>
  new Error('No unicode general categories provided. See http://unicode.org/reports/tr44/#GC_Values_Table.');

export const categoryNotFoundError = (category) =>
  new Error(`Cannot find a unicode general category named '${category}'`);

export const noInputError = () =>
  new Error('No input provided');

/**
 * @param {string} input The input to check
 * @param {...string} allowedCategories E.g. 'Letter', 'Number', 'Symbol', &c. Note that
 * only the major unioned categories are supported. E.g. 'Letters' is supported, but
 * 'Lowercase_Letter' is not. If you need additional support, issue a PR here, or just pull
 * the needed regex from https://github.com/mathiasbynens/unicode-11.0.0.
 *
 * @return {boolean} Whether every character in the input matches one of the allowed unicode categories.
 *         See tests for examples.
 * @throws
 *  - If input is false or empty
 *  - If no categories were provided
 *  - If invalid categories were entered
 */
export const validate = (input, ...allowedCategories) => {
  const noInputProvided = !input || input.length === 0;
  if (noInputProvided) {
    throw noInputError();
  }
  const noCategoriesProvided = !allowedCategories || !allowedCategories[0];
  if (noCategoriesProvided) {
    throw noCategoriesProvidedError();
  }
  // If all characters are valid then the number of matched characters will be equal to
  // the length of the string:
  const matchLength = allowedCategories.reduce(
    (sum, category) => {
      const categoryRegex = regexes[category];
      if (!categoryRegex) {
        // If any category is invalid, then the call will throw
        throw categoryNotFoundError(category);
      }
      const matches = input.match(categoryRegex);
      return sum + (matches ? matches.length : 0);
    }, 0);
  return matchLength === input.length;

};
