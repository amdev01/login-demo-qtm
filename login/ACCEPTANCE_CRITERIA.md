# Acceptance Criteria

This document outlines the acceptance criteria for the Login Demo application, derived from the requirements. The criteria are grouped by test levels and relevant test types to ensure comprehensive verification of the application's functionality, security, and performance.

## 1. Unit Testing

### 1.1. Functional Validation (Backend Logic)

-   **FR2.1.1.2 (Username Constraints Validation Logic)**
    -   **AC_UT_FR2.1.1.2.1:** Verify the username validation logic correctly identifies usernames shorter than 4 characters as invalid.
    -   **AC_UT_FR2.1.1.2.2:** Verify the username validation logic correctly identifies usernames longer than 20 characters as invalid.
    -   **AC_UT_FR2.1.1.2.3:** Verify the username validation logic correctly identifies usernames with non-alphanumeric characters as invalid.
    -   **AC_UT_FR2.1.1.2.4:** Verify the username validation logic correctly identifies valid alphanumeric usernames (4-20 chars) as valid.
-   **FR2.1.1.4 (Password Constraints Validation Logic)**
    -   **AC_UT_FR2.1.1.4.1:** Verify the password validation logic correctly identifies passwords shorter than 5 characters as invalid.
    -   **AC_UT_FR2.1.1.4.2:** Verify the password validation logic correctly identifies passwords longer than 10 characters as invalid.
    -   **AC_UT_FR2.1.1.4.3:** Verify the password validation logic correctly identifies passwords with non-alphanumeric characters as invalid.
    -   **AC_UT_FR2.1.1.4.4:** Verify the password validation logic correctly identifies passwords without at least one numeric digit as invalid.
    -   **AC_UT_FR2.1.1.4.5:** Verify the password validation logic correctly identifies passwords without at least one uppercase letter as invalid.
    -   **AC_UT_FR2.1.1.4.6:** Verify the password validation logic correctly identifies passwords without at least one lowercase letter as invalid.
    -   **AC_UT_FR2.1.1.4.7:** Verify the password validation logic correctly identifies passwords meeting all criteria as valid.
-   **FR2.1.2.2 (Username Case-Sensitive Lookup Logic)**
    -   **AC_UT_FR2.1.2.2.1:** Verify that username comparison logic correctly implements case-sensitive comparison.
-   **FR2.1.2.3 (Password Comparison Logic)**
    -   **AC_UT_FR2.1.2.3.1:** Verify the password comparison logic correctly identifies matching plain text passwords as true.
    -   **AC_UT_FR2.1.2.3.2:** Verify the password comparison logic correctly identifies non-matching plain text passwords as false.
-   **FR2.3.2 (Backend Credential Validation Logic)**
    -   **AC_UT_FR2.3.2.1:** Verify backend logic rejects requests with missing username.
    -   **AC_UT_FR2.3.2.2:** Verify backend logic rejects requests with missing password.
    -   **AC_UT_FR2.3.2.3:** Verify backend logic correctly applies format validation as per FR2.1.1.2 and FR2.1.1.4.
-   **FR2.3.4 (Backend Response Generation Logic)**
    -   **AC_UT_FR2.3.4.1:** Verify logic correctly forms a success response structure.
    -   **AC_UT_FR2.3.4.2:** Verify logic correctly forms a generic error response structure for authentication failures.
    -   **AC_UT_FR2.3.4.3:** Verify logic correctly forms an error response structure for input validation failures.

### 1.2. Security Validation (Backend Logic)

-   **SR3.1.2 (SQLi Prevention)**
    -   **AC_UT_SR3.1.2.1:** Code review confirms that database query functions utilize parameterized queries/prepared statements.
    -   **AC_UT_SR3.1.2.2:** Verify that no part of the SQL query is constructed using direct string concatenation of user inputs.
-   **SR3.1.3 (Output Encoding for XSS)**
    -   **AC_UT_SR3.1.3.1:** Verify that any data preparation functions properly sanitize or encode user inputs before display.

### 1.3. Functional Validation (Frontend Logic)

-   **FR2.2.1 (Capture Credentials)**
    -   **AC_UT_FR2.2.1.1:** Verify frontend logic correctly captures entered username.
    -   **AC_UT_FR2.2.1.2:** Verify frontend logic correctly captures entered password.
-   **FR2.1.1.3.1 (Password Visibility Toggle)**
    -   **AC_UT_FR2.1.1.3.1.1:** Verify frontend logic correctly toggles the password field visibility.
-   **SR3.1.1 (Frontend Input Validation)**
    -   **AC_UT_SR3.1.1.1:** Verify frontend validation logic for username correctly identifies and flags invalid formats.
    -   **AC_UT_SR3.1.1.2:** Verify frontend validation logic for password correctly identifies and flags invalid formats.

## 2. Integration Testing

### 2.1. Frontend-Backend Integration

-   **FR2.2.2 & FR2.3.1 (Credential Submission & API Endpoint)**
    -   **AC_IT_FR2.2.2.1:** Verify the frontend successfully sends username and password to the backend API endpoint.
    -   **AC_IT_FR2.2.2.2:** Verify the backend API endpoint successfully receives credentials from the frontend.
    -   **AC_IT_FR2.2.2.3:** Verify communication occurs over HTTPS as per NFR4.2.2.
-   **FR2.2.3 & FR2.3.4 (Response Handling)**
    -   **AC_IT_FR2.2.3.1:** Verify the frontend correctly interprets a success response from the backend.
    -   **AC_IT_FR2.2.3.2:** Verify the frontend correctly interprets an authentication failure response.
    -   **AC_IT_FR2.2.3.3:** Verify the frontend correctly interprets an input validation error response.

### 2.2. Backend-Database Integration

-   **FR2.1.2.1 & FR2.3.3 (Credential Verification against DB)**
    -   **AC_IT_FR2.1.2.1.1:** Verify the backend successfully queries the database with the provided username.
    -   **AC_IT_FR2.1.2.1.2:** Verify the backend correctly retrieves user data for a valid username.
    -   **AC_IT_FR2.1.2.1.3:** Verify the backend handles cases where the username does not exist in the database.
-   **FR2.1.2.2 (Username Case-Sensitive Lookup in DB)**
    -   **AC_IT_FR2.1.2.2.1:** Verify that querying with 'testuser' does NOT find a user stored as 'TestUser' due to case-sensitive requirements.
-   **NFR4.1.1 (Data Persistence)**
    -   **AC_IT_NFR4.1.1.1:** Verify that user credentials (username, plain text password) are correctly stored and retrieved from the database.
-   **SR3.5.2 (Server-Side Logging)**
    -   **AC_IT_SR3.5.2.1:** Verify that errors during login attempts are logged to the server-side log.
    -   **AC_IT_SR3.5.2.2:** Verify that detailed authentication failure reasons are logged for debugging.

## 3. System Testing

### 3.1. End-to-End Functional Testing

-   **Login Success Scenario**
    -   **AC_ST_LS.1:** Given a valid username and password, when the user attempts login, then the authenticated page is displayed with a welcome message including their username.
-   **Login Failure Scenarios**
    -   **AC_ST_LF.1:** Given a non-existent username, when the user attempts login, then a generic error message is displayed.
    -   **AC_ST_LF.2:** Given a valid username but incorrect password, when the user attempts login, then a generic error message is displayed.
    -   **AC_ST_LF.3:** Given invalid username format, when the user attempts login, then an appropriate error message is displayed.
    -   **AC_ST_LF.4:** Given invalid password format, when the user attempts login, then an appropriate error message is displayed.
-   **UI Elements Verification**
    -   **AC_ST_GR1.1.2.1:** Verify the login page displays an input field for username.
    -   **AC_ST_GR1.1.2.2:** Verify the login page displays an input field for password.
    -   **AC_ST_GR1.1.3.1:** Verify the login page displays a "Login" button.
-   **Password Masking & Toggle**
    -   **AC_ST_FR2.1.1.3.1:** Verify the password field masks input characters by default.
    -   **AC_ST_FR2.1.1.3.2:** Verify the visibility toggle option reveals/hides password characters when activated.
-   **Feedback Messages**
    -   **AC_ST_GR1.1.4.1:** Verify successful login feedback is clear and contains the username.
    -   **AC_ST_GR1.1.4.2:** Verify failure messages are clear, concise, and don't leak sensitive information.
-   **Loading Indicators**
    -   **AC_ST_GR1.2.2.1:** Verify loading indicators are displayed during authentication processing.
    -   **AC_ST_GR1.2.2.2:** Verify loading indicators disappear once the response is processed.

### 3.2. Security Testing

-   **Input Validation**
    -   **AC_ST_SR3.1.1.1-9:** Attempt login with various invalid input formats; verify appropriate rejection.
-   **XSS Protection**
    -   **AC_ST_SR3.2.1:** Attempt to inject script tags in the username; verify they are not executed.
    -   **AC_ST_SR3.2.2:** Test for reflected XSS vulnerabilities in error messages or URL parameters.
-   **SQL Injection Protection**
    -   **AC_ST_SR3.3.1:** Attempt login using SQL injection payloads; verify they fail to bypass authentication.
-   **Password Handling**
    -   **AC_ST_SR3.4.1:** Verify passwords are stored in plain text as required for the demo.
-   **Error Handling**
    -   **AC_ST_SR3.5.1.1:** Verify authentication failures return generic messages without specific details.
    -   **AC_ST_SR3.5.1.2:** Verify no stack traces or system errors are exposed to users.
-   **Communication Security**
    -   **AC_ST_NFR4.2.2.1:** Verify login communication uses HTTPS.

### 3.3. Performance Testing

-   **Concurrent Logins**
    -   **AC_ST_NFR4.3.1.1:** Verify the application handles 100 concurrent login attempts.
    -   **AC_ST_NFR4.3.1.2:** Verify average response time under load is ≤ 2 seconds.
    -   **AC_ST_NFR4.3.1.3:** Verify 95th percentile response time under load is ≤ 5 seconds.
    -   **AC_ST_NFR4.3.1.4:** Verify error rate during load test is < 1%.

## 4. User Acceptance Testing (UAT)

### 4.1. Usability & User Experience

-   **UI Clarity & Intuitiveness**
    -   **AC_UAT_GR1.1.1.1:** Users can navigate and understand the login interface without instruction.
    -   **AC_UAT_GR1.1.1.2:** Users find the layout clear and element purposes obvious.
-   **Login Process**
    -   **AC_UAT_GR1.2.1.1:** Users can complete login processes with minimal confusion or errors.
    -   **AC_UAT_GR1.2.1.2:** Users report positive experiences with the login process.
-   **Feedback Messages**
    -   **AC_UAT_GR1.1.4.1:** Users understand the meaning of all messages displayed during login.
-   **Password Visibility Feature**
    -   **AC_UAT_FR2.1.1.3.1.1:** Users can easily find and use the password visibility toggle.
    -   **AC_UAT_FR2.1.1.3.1.2:** Users find the password visibility toggle helpful.

### 4.2. Functional Scenarios

-   **AC_UAT_FS.1:** Users can successfully log in with valid credentials.
-   **AC_UAT_FS.2:** Users understand error feedback when authentication fails.
-   **AC_UAT_FS.3:** Users understand error feedback when input format requirements are not met.
