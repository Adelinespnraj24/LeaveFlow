# LeaveFlow — Enterprise Employee Leave Management System

LeaveFlow is a full-stack web application designed to simplify employee leave management through a structured request submission and administrative approval workflow. Built using **Spring Boot 3.5, Angular 20, and MySQL 8**, the application demonstrates RESTful API development, database integration, object-relational mapping, and modern frontend development.

## Features

- **Leave Request Submission:** Submit leave applications with employee details, leave type, start date, end date, and reason.
- **Form Validation:** Validate required fields and ensure the end date is not earlier than the start date.
- **Administrative Dashboard:** View and manage submitted leave requests from a centralized dashboard.
- **Leave Approval Workflow:** Approve or reject pending leave applications.
- **Persistent Data Storage:** Store leave application records in MySQL using Spring Data JPA and Hibernate.
- **RESTful API Integration:** Connect the Angular frontend to Spring Boot REST API endpoints.
- **Responsive User Interface:** Access leave management functionality through a modern web interface.

## Technology Stack

| Technology | Purpose |
|---|---|
| Java 17 | Backend programming language |
| Spring Boot 3.5 | Backend framework and REST API development |
| Spring Data JPA | Database access and persistence |
| Hibernate ORM | Object-relational mapping |
| MySQL 8 | Relational database |
| Angular 20 | Frontend framework |
| TypeScript | Frontend programming language |
| RxJS | Reactive programming and asynchronous data handling |
| Maven | Backend dependency management and build |
| npm | Frontend package management |

## System Architecture

LeaveFlow follows a layered architecture that separates the frontend, backend business logic, and database operations.

1. **Frontend — Angular:** Provides the user interface, form validation, dashboard, and API communication.
2. **Backend — Spring Boot:** Handles HTTP requests, business logic, leave approval operations, and data validation.
3. **Persistence Layer — Spring Data JPA:** Manages communication between Java entities and the database.
4. **Database — MySQL:** Stores leave requests and their current approval statuses.

### Project Structure

```text
LeaveFlow/
├── backend/
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       │   └── com/leaveflow/
│   │       │       ├── controller/
│   │       │       ├── Input/
│   │       │       ├── repository/
│   │       │       ├── service/
│   │       │       └── LeaveFlowApplication.java
│   │       └── resources/
│   │           └── application.properties
│   └── pom.xml
│
├── frontend/
│   ├── src/
│   │   └── app/
│   ├── package.json
│   └── angular.json
│
└── README.md
```

## Prerequisites

Ensure the following software is installed:

- **Java JDK:** 17 or higher
- **Apache Maven:** 3.9 or higher
- **Node.js:** 20.19+ or 22.12+
- **npm:** Compatible with your Node.js installation
- **MySQL Server:** 8.0 or higher
- **Git:** For version control (optional)

## Installation and Setup

### 1. Clone the Repository

```bash
git clone <https://github.com/Adelinespnraj24/LeaveFlow.git>
cd LeaveFlow
```

### 2. Configure the MySQL Database

Start your MySQL server and create the database:

```sql
CREATE DATABASE leaveflow;
```

Update `backend/src/main/resources/application.properties` with your database credentials:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/leaveflow
spring.datasource.username=${DB_USERNAME:root}
spring.datasource.password=${DB_PASSWORD:your_password}

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
```

Replace `your_password` with your MySQL password. Alternatively, configure the `DB_USERNAME` and `DB_PASSWORD` environment variables.

**Important:** The database must exist and MySQL must be running before starting the backend. Hibernate can create or update mapped tables when the application starts, but it does not automatically create the MySQL database itself.

### 3. Run the Spring Boot Backend

Open a terminal in the project root and execute:

```bash
cd backend
mvn spring-boot:run
```

Wait until the application starts successfully. By default, the backend runs at:

`http://localhost:8080`

Keep this terminal open while using the application.

### 4. Run the Angular Frontend

Open a **second terminal** in the project root and execute:

```bash
cd frontend
npm install
npx ng serve
```

Once the Angular development server starts, open:

**http://localhost:4200**

Keep the frontend and backend running simultaneously.

## Application Workflow

1. Open the LeaveFlow application in your browser.
2. Enter the employee details and leave application information.
3. Submit the form to create a leave request.
4. View the submitted request in the leave management dashboard.
5. Review pending applications and select **Approve** or **Reject**.
6. Verify that the updated status appears in the dashboard.
7. Refresh the page and confirm that the request and its status persist in the MySQL database.

## API Integration

The Angular application communicates with the Spring Boot backend through RESTful HTTP requests.

Typical operations include:

| Operation | HTTP Method | Purpose |
|---|---|---|
| Create a leave request | POST | Submit a new application |
| Retrieve leave requests | GET | Display submitted applications |
| Approve a leave request | PUT or PATCH | Update the request status |
| Reject a leave request | PUT or PATCH | Update the request status |

*The actual endpoint URLs and HTTP methods depend on the backend controller implementation.*

## Testing and Verification

After launching the application, verify the following:

- A valid leave request can be submitted successfully.
- Required fields and date validation work correctly.
- Submitted requests appear in the dashboard.
- Approval and rejection actions update the correct request.
- Data remains available after refreshing the browser.
- Backend API requests and database operations complete without errors.

## Security and Configuration Notes

- Keep database credentials out of source control.
- Use environment variables for sensitive configuration.
- Configure appropriate CORS settings if the frontend and backend use different origins.
- For production deployments, use database schema migrations instead of relying on automatic Hibernate schema updates.
- Add authentication, role-based authorization, and audit logging before using the application in a real enterprise environment.

## Project Objective

LeaveFlow demonstrates practical full-stack development skills, including Java backend development, Spring Boot REST APIs, Angular frontend integration, relational database management, and structured application architecture.

The project provides a foundation for extending leave management with employee and manager roles, leave balances, email notifications, reporting dashboards, and authentication.

