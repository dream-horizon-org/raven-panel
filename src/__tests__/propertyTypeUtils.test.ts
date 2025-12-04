import {
  isNumericType,
  isBooleanType,
  isStringType,
  getInputType,
  convertComparisonValue,
  normalizePropertyType,
} from '../app/dashboard/create/utils/propertyTypeUtils';

describe('propertyTypeUtils', () => {
  describe('isNumericType', () => {
    it('should return true for numeric types', () => {
      expect(isNumericType('integer')).toBe(true);
      expect(isNumericType('long')).toBe(true);
      expect(isNumericType('double')).toBe(true);
      expect(isNumericType('decimal')).toBe(true);
      expect(isNumericType('float')).toBe(true);
    });

    it('should be case-insensitive', () => {
      expect(isNumericType('INTEGER')).toBe(true);
      expect(isNumericType('Double')).toBe(true);
    });

    it('should return false for non-numeric types', () => {
      expect(isNumericType('string')).toBe(false);
      expect(isNumericType('boolean')).toBe(false);
      expect(isNumericType('object')).toBe(false);
    });
  });

  describe('isBooleanType', () => {
    it('should return true for boolean type', () => {
      expect(isBooleanType('boolean')).toBe(true);
    });

    it('should be case-insensitive', () => {
      expect(isBooleanType('BOOLEAN')).toBe(true);
      expect(isBooleanType('Boolean')).toBe(true);
    });

    it('should return false for non-boolean types', () => {
      expect(isBooleanType('string')).toBe(false);
      expect(isBooleanType('integer')).toBe(false);
    });
  });

  describe('isStringType', () => {
    it('should return true for string type', () => {
      expect(isStringType('string')).toBe(true);
    });

    it('should be case-insensitive', () => {
      expect(isStringType('STRING')).toBe(true);
      expect(isStringType('String')).toBe(true);
    });

    it('should return false for non-string types', () => {
      expect(isStringType('integer')).toBe(false);
      expect(isStringType('boolean')).toBe(false);
    });
  });

  describe('getInputType', () => {
    it('should return "number" for numeric types', () => {
      expect(getInputType('integer')).toBe('number');
      expect(getInputType('float')).toBe('number');
      expect(getInputType('double')).toBe('number');
    });

    it('should return "select" for boolean type', () => {
      expect(getInputType('boolean')).toBe('select');
    });

    it('should return "text" for string and other types', () => {
      expect(getInputType('string')).toBe('text');
      expect(getInputType('unknown')).toBe('text');
    });
  });

  describe('convertComparisonValue', () => {
    it('should convert string to number for numeric types', () => {
      expect(convertComparisonValue('42', 'integer')).toBe(42);
      expect(convertComparisonValue('3.14', 'float')).toBe(3.14);
    });

    it('should keep number as number for numeric types', () => {
      expect(convertComparisonValue(100, 'integer')).toBe(100);
    });

    it('should keep string as string for non-numeric types', () => {
      expect(convertComparisonValue('hello', 'string')).toBe('hello');
    });

    it('should convert number to string for non-numeric types', () => {
      expect(convertComparisonValue(42, 'string')).toBe('42');
    });

    it('should return original value if conversion fails', () => {
      expect(convertComparisonValue('not-a-number', 'integer')).toBe('not-a-number');
    });
  });

  describe('normalizePropertyType', () => {
    it('should normalize numeric types to "number"', () => {
      expect(normalizePropertyType('integer')).toBe('number');
      expect(normalizePropertyType('float')).toBe('number');
      expect(normalizePropertyType('DOUBLE')).toBe('number');
    });

    it('should normalize boolean type to "boolean"', () => {
      expect(normalizePropertyType('boolean')).toBe('boolean');
      expect(normalizePropertyType('BOOLEAN')).toBe('boolean');
    });

    it('should normalize other types to "string"', () => {
      expect(normalizePropertyType('string')).toBe('string');
      expect(normalizePropertyType('unknown')).toBe('string');
    });
  });
});

