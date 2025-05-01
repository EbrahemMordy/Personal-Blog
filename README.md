# Personal Blog

A full-stack blog application with Angular frontend and Spring Boot backend.

## Project Overview

This project is a personal blog website that allows users to view blog posts and administrators to create, edit, and delete blog content. The application is built with:

- **Frontend**: Angular 19 (Personal-Blog-UI)
- **Backend**: Spring Boot (Personal-Blog)
- **Database**: MySQL

The UI components and design were developed with assistance from AI Agents, enhancing the development process and interface quality.

## Features

- View all blog posts
- View individual blog post details
- Admin authentication
- Create, update, and delete blog posts
- Responsive design

## Tech Stack

### Backend (Personal-Blog)
- Java Spring Boot
- Spring Data JPA
- MySQL Database
- RESTful API

### Frontend (Personal-Blog-UI)
- Angular 19
- RxJS for state management
- Angular Router
- Responsive CSS
- AI-assisted component development

## Prerequisites

- Node.js and npm
- Java 17 or higher
- Maven
- MySQL

## Installation

### Backend Setup

1. Clone the repository
```
git clone https://github.com/EbrahemMordy/Personal-Blog.git
cd personal-blog/Personal-Blog
```

2. Configure the database
- Create a MySQL database named `Projects`
- Update `src/main/resources/application.properties` with your database credentials if needed

3. Build and run the Spring Boot application
```
./mvnw spring-boot:run
```
- The backend will be available at `http://localhost:8080`

### Frontend Setup

1. Navigate to the UI directory
```
cd ../Personal-Blog-UI
```

2. Install dependencies
```
npm install
```

3. Run the Angular application
```
npm start
```
- The frontend will be available at `http://localhost:4200`

## API Endpoints

- `GET /api/blog` - Get all blog posts
- `GET /api/blog/{id}` - Get a specific blog post
- `POST /api/blog/new` - Create a new blog post
- `PUT /api/blog/update/{id}` - Update a blog post
- `DELETE /api/blog/delete/{id}` - Delete a blog post

## License

This project is licensed under the MIT License - see the LICENSE file for details.
