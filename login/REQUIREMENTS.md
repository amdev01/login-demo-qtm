# Application Requirements

 This document outlines the functional, non-functional, and security requirements for the Login Demo application. The application is intended to provide a secure user authentication mechanism.

## 1. General Requirements

### 1.1. User Interface (UI)
-   **GR1.1.1:** The application must present a clear, intuitive, and user-friendly login interface.
    -   **GR1.1.1.1:** Assessment of "clear, intuitive, and user-friendly" will be based on heuristic evaluation and qualitative user feedback if formal usability testing is conducted.
-   **GR1.1.2:** The interface must include input fields for username and password.
-   **GR1.1.3:** The interface must include a "Login" button to initiate the authentication process.
-   **GR1.1.4:** Feedback messages (e.g., successful login, authentication failure, input errors) must be clearly, concisely, and safely displayed to the user.

### 1.2. User Experience (UX)
-   **GR1.2.1:** The login process must be straightforward and provide a good user experience.
    -   **GR1.2.1.1:** Assessment of "straightforward" and "good user experience" will be based on task completion success rates for login, heuristic evaluation, and qualitative user feedback if formal usability testing is conducted.
-   **GR1.2.2:** The application should provide appropriate loading indicators during backend communication.

## 2. Functional Requirements

### 2.1. User Authentication
-   **FR2.1.1:** User Login Attempt
    -   **FR2.1.1.1:** Users must be able to input their credentials, specifically a `username` and a `password`, into the designated fields on the login interface.
    -   **FR2.1.1.2:** The `username` should be treated as a unique identifier for the user.
        -   **FR2.1.1.2.1:** The `username` must only contain alphanumeric characters (a-z, A-Z, 0-9).
        -   **FR2.1.1.2.2:** The `username` must have a minimum length of 4 characters.
        -   **FR2.1.1.2.3:** The `username` must have a maximum length of 20 characters.
    -   **FR2.1.1.3:** The `password` field should mask input characters by default for security.
        -   **FR2.1.1.3.1:** The interface must provide an option (e.g., an icon or checkbox) to toggle the visibility of the password characters.
    -   **FR2.1.1.4:** Password Constraints:
        -   **FR2.1.1.4.1:** The `password` must have a minimum length of 5 characters.
        -   **FR2.1.1.4.2:** The `password` must have a maximum length of 10 characters.
        -   **FR2.1.1.4.3:** The `password` must only contain alphanumeric characters (a-z, A-Z, 0-9).
        -   **FR2.1.1.4.4:** The `password` must contain at least one numeric digit (0-9).
        -   **FR2.1.1.4.5:** The `password` must contain at least one uppercase letter (A-Z).
        -   **FR2.1.1.4.6:** The `password` must contain at least one lowercase letter (a-z).
-   **FR2.1.2:** Credential Verification Process
    -   **FR2.1.2.1:** The application must verify the submitted `username` and `password` against user records stored in a persistent data store (database).
    -   **FR2.1.2.2:** Username verification (lookup) should be case-sensensitive.
    -   **FR2.1.2.3:** Password verification will involve direct comparison of the provided password with the stored plain text password. (See **SR3.4** for details on demo-specific plain text password handling).
-   **FR2.1.3:** Post-Authentication Actions (Success)
    -   **FR2.1.3.1:** Upon successful verification of credentials, the user must be considered authenticated. The application must then display an authenticated-only page (i.e., a page not accessible without prior successful login). This page must include a welcome message personalized with the user's `username` retrieved from the database (ensuring **FR2.2.4** for XSS prevention).

### 2.2. Frontend
-   **FR2.2.1:** The frontend must capture the username and password entered by the user.
-   **FR2.2.2:** The frontend must send the captured credentials securely to the backend for verification.
-   **FR2.2.3:** The frontend must correctly interpret and display responses (success or error messages) from the backend.
-   **FR2.2.4:** All user-supplied input displayed back to the user (e.g., username in a welcome message) must be properly sanitized to prevent Cross-Site Scripting (XSS) vulnerabilities.

### 2.3. Backend
-   **FR2.3.1:** The backend must expose a secure API endpoint to receive login credentials from the frontend.
-   **FR2.3.2:** The backend must validate incoming credentials (e.g., check for presence, format if applicable before querying the database).
-   **FR2.3.3:** The backend must securely query the database to verify the username and password.
    -   For this demo, password verification will involve comparing the provided password directly with the plain text password stored in the database. **This is for demonstration purposes only and is insecure for production systems.** (Refer to **SR3.4**).
-   **FR2.3.4:** The backend must return a clear success or error status to the frontend. Error messages must be generic and not leak sensitive information.

## 3. Security Requirements

### 3.1. Input Validation and Sanitization
-   **SR3.1.1:** All user-supplied input (username, password) must be validated on the backend before processing and, where appropriate, on the frontend for better UX.
    -   **SR3.1.1.1:** Username validation must enforce the constraints defined in **FR2.1.1.2.1**, **FR2.1.1.2.2**, and **FR2.1.1.2.3**.
    -   **SR3.1.1.2:** Password validation must enforce the complexity constraints defined in **FR2.1.1.4.1** through **FR2.1.1.4.6**.
-   **SR3.1.2:** Input used in database queries must be parameterized or properly escaped to prevent SQL Injection (SQLi) vulnerabilities.
-   **SR3.1.3:** Output encoding must be applied when displaying user-supplied data on the frontend to prevent Cross-Site Scripting (XSS).

### 3.2. Protection Against Cross-Site Scripting (XSS)
-   **SR3.2.1:** The application must be protected against reflected, stored, and DOM-based XSS attacks.
-   **SR3.2.2:** All dynamic content, especially content derived from user input or database records influenced by user input, must be appropriately encoded/sanitized before being rendered in the browser.

### 3.3. Protection Against SQL Injection (SQLi)
-   **SR3.3.1:** The application must use parameterized queries (prepared statements) or a similar robust mechanism for all database interactions.
-   **SR3.3.2:** Dynamic query construction using string concatenation with user input is strictly prohibited.

### 3.4. Secure Password Handling
-   **SR3.4.1:** **Warning:** For the purpose of this demonstration application, passwords will be stored and handled in plain text. This approach is inherently insecure and **must never be used in a production environment** or any system handling real user data. In a real-world application, passwords must always be securely hashed (see original **SR3.4.2**).
-   **SR3.4.2:** (This requirement for secure hashing is intentionally omitted for this demo as per user request. In a real application: Passwords must be securely hashed using a strong, modern hashing algorithm (e.g., Argon2, bcrypt, scrypt) with a unique salt per user.)
-   **SR3.4.3:** For this demo, password comparison will be performed by directly comparing the user-provided password with the plain text password stored in the database.
-   **SR3.4.4:** The application must enforce the minimum password complexity requirements as defined in **FR2.1.1.4**.

### 3.5. Secure Error Handling
-   **SR3.5.1:** Error messages displayed to the user must not reveal sensitive system information, stack traces, or specific reasons for authentication failure that could aid an attacker (e.g., "User not found" vs "Password incorrect").
-   **SR3.5.2:** Detailed error information should be logged securely on the server-side for debugging purposes only.

## 4. Non-Functional Requirements

### 4.1. Data Persistence
-   **NFR4.1.1:** User credentials (username and plain text password, for demo purposes) must be stored in a database.

### 4.2. Technology
-   **NFR4.2.1:** The application will consist of a frontend (HTML, CSS, JavaScript) and a backend (e.g., Node.js/Express, Python/Flask, etc.).
-   **NFR4.2.2:** Communication between frontend and backend will occur over HTTP/S.

### 4.3. Performance Requirements
-   **NFR4.3.1:** Concurrent Logins
    -   **NFR4.3.1.1:** The application backend must be able to handle a spike of 100 concurrent users attempting to log in simultaneously.
    -   **NFR4.3.1.2:** Under such a load (100 concurrent login attempts), the average response time for a login request (from submission to frontend receiving a response) should not exceed 2 seconds.
    -   **NFR4.3.1.3:** Under such a load, the 95th percentile response time for a login request should not exceed 5 seconds.
    -   **NFR4.3.1.4:** The system should not produce errors for more than 1% of login attempts during this spike.
