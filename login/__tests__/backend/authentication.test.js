const { validateLoginRequest, generateResponse } = require('../../login/src/services/auth');

describe('Backend Credential Validation Tests', () => {
  // FR2.3.2 (Backend Credential Validation Logic)
  test('AC_UT_FR2.3.2.1: Backend rejects requests with missing username', () => {
    const result = validateLoginRequest({ password: 'Pass123' });
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Username is required');
  });

  test('AC_UT_FR2.3.2.2: Backend rejects requests with missing password', () => {
    const result = validateLoginRequest({ username: 'testuser' });
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Password is required');
  });

  test('AC_UT_FR2.3.2.3: Backend applies format validation for username and password', () => {
    // Invalid username (too short)
    let result = validateLoginRequest({ username: 'abc', password: 'Pass123' });
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Invalid username format');

    // Invalid password (no uppercase)
    result = validateLoginRequest({ username: 'testuser', password: 'pass123' });
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Invalid password format');

    // Valid credentials
    result = validateLoginRequest({ username: 'testuser', password: 'Pass123' });
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });
});

describe('Backend Response Generation Tests', () => {
  // FR2.3.4 (Backend Response Generation Logic)
  test('AC_UT_FR2.3.4.1: Correct success response structure', () => {
    const response = generateResponse({ success: true, username: 'testuser' });
    expect(response.success).toBe(true);
    expect(response.data).toHaveProperty('username', 'testuser');
    expect(response).not.toHaveProperty('error');
  });

  test('AC_UT_FR2.3.4.2: Correct generic error response for authentication failures', () => {
    const response = generateResponse({ success: false, errorType: 'auth' });
    expect(response.success).toBe(false);
    expect(response.error).toBe('Invalid username or password');
    expect(response).not.toHaveProperty('data');
  });

  test('AC_UT_FR2.3.4.3: Correct error response for input validation failures', () => {
    const response = generateResponse({ 
      success: false, 
      errorType: 'validation',
      errors: ['Invalid username format', 'Invalid password format']
    });
    expect(response.success).toBe(false);
    expect(response.errors).toContain('Invalid username format');
    expect(response.errors).toContain('Invalid password format');
    expect(response).not.toHaveProperty('data');
  });
});
