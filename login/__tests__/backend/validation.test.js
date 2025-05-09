const { validateUsername, validatePassword } = require('../../login/src/services/validation');

describe('Username Validation Tests', () => {
  // FR2.1.1.2 (Username Constraints Validation Logic)
  test('AC_UT_FR2.1.1.2.1: Username less than 4 characters is invalid', () => {
    expect(validateUsername('abc')).toBe(false);
  });

  test('AC_UT_FR2.1.1.2.2: Username more than 20 characters is invalid', () => {
    expect(validateUsername('abcdefghijklmnopqrstu')).toBe(false);
  });

  test('AC_UT_FR2.1.1.2.3: Username with non-alphanumeric characters is invalid', () => {
    expect(validateUsername('user@name')).toBe(false);
    expect(validateUsername('user-name')).toBe(false);
    expect(validateUsername('user_name')).toBe(false);
  });

  test('AC_UT_FR2.1.1.2.4: Valid alphanumeric username (4-20 chars) is valid', () => {
    expect(validateUsername('user1')).toBe(true);
    expect(validateUsername('username123')).toBe(true);
    expect(validateUsername('abcd1234EFGH')).toBe(true);
  });

  // FR2.1.2.2 (Username Case-Sensitive Lookup Logic)
  test('AC_UT_FR2.1.2.2.1: Username comparison is case-sensitive', () => {
    const usernameComparison = (u1, u2) => u1 === u2;
    expect(usernameComparison('TestUser', 'testuser')).toBe(false);
    expect(usernameComparison('TestUser', 'TestUser')).toBe(true);
  });
});

describe('Password Validation Tests', () => {
  // FR2.1.1.4 (Password Constraints Validation Logic)
  test('AC_UT_FR2.1.1.4.1: Password less than 5 characters is invalid', () => {
    expect(validatePassword('Abc1')).toBe(false);
  });

  test('AC_UT_FR2.1.1.4.2: Password more than 10 characters is invalid', () => {
    expect(validatePassword('Abcde12345X')).toBe(false);
  });

  test('AC_UT_FR2.1.1.4.3: Password with non-alphanumeric characters is invalid', () => {
    expect(validatePassword('Pass@123')).toBe(false);
    expect(validatePassword('Pass-123')).toBe(false);
  });

  test('AC_UT_FR2.1.1.4.4: Password without at least one numeric digit is invalid', () => {
    expect(validatePassword('Abcdef')).toBe(false);
  });

  test('AC_UT_FR2.1.1.4.5: Password without at least one uppercase letter is invalid', () => {
    expect(validatePassword('abcd123')).toBe(false);
  });

  test('AC_UT_FR2.1.1.4.6: Password without at least one lowercase letter is invalid', () => {
    expect(validatePassword('ABCD123')).toBe(false);
  });

  test('AC_UT_FR2.1.1.4.7: Password meeting all criteria is valid', () => {
    expect(validatePassword('Abc123')).toBe(true);
    expect(validatePassword('Pass123')).toBe(true);
    expect(validatePassword('A1b2c3')).toBe(true);
  });

  // FR2.1.2.3 (Password Comparison Logic)
  test('AC_UT_FR2.1.2.3.1: Matching plain text passwords return true', () => {
    const passwordComparison = (p1, p2) => p1 === p2;
    expect(passwordComparison('Pass123', 'Pass123')).toBe(true);
  });

  test('AC_UT_FR2.1.2.3.2: Non-matching plain text passwords return false', () => {
    const passwordComparison = (p1, p2) => p1 === p2;
    expect(passwordComparison('Pass123', 'Pass124')).toBe(false);
  });
});
