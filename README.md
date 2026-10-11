# Employee Management System

Full-stack Employee Management System based on the UI references provided.

## Technologies
- Frontend: React JS + Vite + Axios
- Backend: Java 17 + Spring Boot + Spring Data JPA
- Database: MySQL
- Authentication: Login + Sign Up with BCrypt password hashing

## Features
1. Login page
2. Sign Up page
3. Dashboard
4. Add New Employee button opens an employee modal
5. Clicking Employee ID/Code opens the same modal with pre-populated data
6. Update employee
7. Delete employee
8. Search employees
9. Responsive dashboard UI

## 1. Create MySQL database

Run:

```sql
CREATE DATABASE employee_management;
```

The application creates the tables automatically using JPA.

Default MySQL settings in `backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/employee_management
spring.datasource.username=root
spring.datasource.password=root
```

Change the username/password if your MySQL installation is different.

## 2. Run Backend

Open the `backend` folder:

```bash
mvn spring-boot:run
```

Backend:
`http://localhost:8080`

## 3. Run Frontend

Open another terminal in the `frontend` folder:

```bash
npm install
npm run dev
```

Frontend:
`http://localhost:5173`

## First use

Open Sign Up and create an account. Then login.

The authentication is intended as a simple project/demo authentication flow. For a production application, use JWT/session authentication and stronger authorization controls.
