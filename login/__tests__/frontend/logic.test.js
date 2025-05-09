const { 
  captureCredentials, 
  togglePasswordVisibility,
  validateUsernameFormat,
  validatePasswordFormat 
} = require('../../login/src/frontend/login');

describe('Frontend Credential Capture Tests', () => {
  // FR2.2.1 (Capture Credentials)
  test('AC_UT_FR2.2.1.1: Frontend logic correctly captures entered username', () => {
    // Mock DOM element
    document.body.innerHTML = `<input id="username" value="testuser" />`;
    
    const credentials = captureCredentials();
    expect(credentials.username).toBe('testuser');
  });

  test('AC_UT_FR2.2.1.2: Frontend logic correctly captures entered password', () => {
    // Mock DOM element
    document.body.innerHTML = `
      <input id="username" value="testuser" />
      <input id="password" value="Pass123" />
    `;
    
    const credentials = captureCredentials();
    expect(credentials.password).toBe('Pass123');
  });
});

describe('Password Visibility Toggle Tests', () => {
  // FR2.1.1.3.1 (Password Visibility Toggle)
  test('AC_UT_FR2.1.1.3.1.1: Frontend logic correctly toggles password field visibility', () => {
    // Mock DOM element
    document.body.innerHTML = `<input id="password" type="password" value="Pass123" />`;
    const passwordField = document.getElementById('password');
    
    // Initial state is password (masked)
    expect(passwordField.type).toBe('password');
    
    // Toggle to text (visible)
    togglePasswordVisibility();
    expect(passwordField.type).toBe('text');
    
    // Toggle back to password (masked)
    togglePasswordVisibility();
    expect(passwordField.type).toBe('password');
  });
});

describe('Frontend Input Validation Tests', () => {
  // SR3.1.1 (Frontend Input Validation)
  test('AC_UT_SR3.1.1.1: Frontend validation logic identifies invalid username formats', () => {
    expect(validateUsernameFormat('abc')).toBe(false); // Too short
    expect(validateUsernameFormat('user@name')).toBe(false); // Invalid characters
    expect(validateUsernameFormat('testuser')).toBe(true); // Valid
  });
  
  test('AC_UT_SR3.1.1.2: Frontend validation logic identifies invalid password formats', () => {
    expect(validatePasswordFormat('pass')).toBe(false); // Too short
    expect(validatePasswordFormat('password')).toBe(false); // No uppercase or numbers
    expect(validatePasswordFormat('Pass@123')).toBe(false); // Special character
    expect(validatePasswordFormat('Pass123')).toBe(true); // Valid
  });
});
