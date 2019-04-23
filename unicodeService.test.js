import {
  validate,
  noInputError,
  categoryNotFoundError,
  noCategoriesProvidedError
} from './unicodeService';

describe('unicodeService', () => {

  test('Requires valid input', () => {
    expect(() => validate(null)).toThrow(noInputError());
    expect(() => validate('')).toThrow(noInputError());
    expect(() => validate('Hi', null)).toThrow(noCategoriesProvidedError());
    const unknownCategory = 'Blue_Cheeses';
    expect(() => validate('Hi', unknownCategory)).toThrow(categoryNotFoundError(unknownCategory));
  });

  test('Cased_Letter', () => {
    ['Cased_Letter', 'LC'].forEach(category => {
      // Positive cases
      let match = validate('a', category);
      expect(match).toBe(true);
      match = validate('Z', category);
      expect(match).toBe(true);

      // Negative cases
      match = validate(',', category);
      expect(match).toBe(false);
      match = validate('a b c.....qZ', category);
      expect(match).toBe(false);
      // Japanese characters are not cased
      match = validate('平', category);
      expect(match).toBe(false);
    });
  });

  test('Letter', () => {
    ['Letter', 'L'].forEach(category => {
      // Positive cases
      let match = validate('a', category);
      expect(match).toBe(true);
      match = validate('Z', category);
      expect(match).toBe(true);
      match = validate('平平平', category);
      expect(match).toBe(true);
      // Ajinomoto, a Japanese company
      match = validate('味の素株式会社', 'Letter');
      expect(match).toBe(true);
      // Lenovo, a Chinese company
      match = validate('联想', 'Letter');
      expect(match).toBe(true);

      // Negative cases
      match = validate(',', category);
      expect(match).toBe(false);
      match = validate('a b c.....平平', category);
      expect(match).toBe(false);
    });
  });

  test('Mark', () => {
    const accentGrave    = '\u0300';
    const doubleOverline = '\u033F';

    ['Mark', 'M'].forEach(category => {
      // Positive cases
      let match = validate(accentGrave, category);
      expect(match).toBe(true);
      match = validate(`${doubleOverline}${accentGrave}`, category);
      expect(match).toBe(true);

      // Negative cases
      match = validate(',', category);
      expect(match).toBe(false);
      match = validate('a b c.....平平', category);
      expect(match).toBe(false);
      match = validate(`a${accentGrave}`, category);
      expect(match).toBe(false);
    });
  });

  test('Number', () => {
    ['Number', 'N'].forEach(category => {
      // Positive cases
      let match = validate('1', category);
      expect(match).toBe(true);
      match = validate('12', category);
      expect(match).toBe(true);

      // Negative cases
      match = validate(',', category);
      expect(match).toBe(false);
      match = validate('a', category);
      expect(match).toBe(false);
      match = validate('a1', category);
      expect(match).toBe(false);
    });
  });

  test('Punctuation', () => {
    ['Punctuation', 'P'].forEach(category => {
      // Positive cases
      let match = validate('{,"\'', category);
      expect(match).toBe(true);
      match = validate('...', category);
      expect(match).toBe(true);

      // Negative cases
      match = validate('a,b', category);
      expect(match).toBe(false);
      match = validate('a1', category);
      expect(match).toBe(false);
      match = validate(',+,', category);
      expect(match).toBe(false);
    });
  });

  test('Symbol', () => {
    ['Symbol', 'S'].forEach(category => {
      // Positive cases
      let match = validate('±⁒⅀∞', category);
      expect(match).toBe(true);

      // Negative cases
      match = validate('a,b', category);
      expect(match).toBe(false);
      match = validate('a∞1', category);
      expect(match).toBe(false);
      match = validate('∰ ,', category);
      expect(match).toBe(false);
    });
  });

  test('Separator', () => {
    const line      = '\u2028';
    const paragraph = '\u2029';
    const ogham     = '\u1680';
    ['Separator', 'Z'].forEach(category => {
      // Positive cases
      let match = validate(`${line}${paragraph}${ogham}`, category);
      expect(match).toBe(true);

      // Negative cases
      match = validate('a,b', category);
      expect(match).toBe(false);
      match = validate(`${ogham}a`, category);
      expect(match).toBe(false);
    });
  });

  test('Other', () => {
    ['Other', 'C'].forEach(category => {
      // Positive cases
      let match = validate('۝؀', category);
      expect(match).toBe(true);

      // Negative cases
      match = validate('a,b', category);
      expect(match).toBe(false);
      match = validate('a', category);
      expect(match).toBe(false);
    });
  });

  test('Multiple Categories', () => {
    // Positive case
    let match = validate('۝؀±⁒⅀∞', 'Other', 'Symbol');
    expect(match).toBe(true);
    match = validate(
      'MuleSoft, a Salesforce Company',
      'Letter', 'Number', 'Punctuation', 'Separator'
    );
    expect(match).toBe(true);

    // Negative case
    match = validate('A1', 'Other', 'Symbol');
    expect(match).toBe(false);
    match = validate(
      'MuleSoft, a Salesforce Company',
      'Letter', 'Symbol', 'Mark'
    );
    expect(match).toBe(false);
  });

});
