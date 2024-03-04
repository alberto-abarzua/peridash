# Peridash Project Overview

The Peridash project is a comprehensive stock dashboard application that utilizes real-time data from the [TwelveData API](https://twelvedata.com/) to provide users with up-to-date financial information. This application is a showcase of modern web development technologies, integrating Django and React for backend and frontend development respectively. Additionally, Docker is employed to containerize the application, ensuring consistency and reliability across different deployment environments.

PDM, a contemporary Python package manager that supports PEP 582, is used for efficient management of packages and dependencies, streamlining the development process.

## Technology Stack

### Backend

The backend infrastructure is powered by Supabase, offering a suite of tools including Supabase Auth for authentication, Postgres DB for database management, and edge functions to handle backend logic efficiently.

### Frontend

The frontend is developed with React, leveraging Tailwind CSS for styling to ensure a sleek and responsive user interface. State management is handled by Redux Toolkit, with Saga used for managing side effects. React Router is incorporated for seamless navigation throughout the application.

Initially, the project was developed using Django for the backend and React for the frontend, with deployment managed via Kubernetes. The transition to Supabase was strategically made to minimize operational costs while continuing to explore and learn from new technologies.

## Running the Project

### Backend Setup

1. Ensure the Supabase CLI is installed on your system.
2. Start the Supabase local development environment with the command:
   ```bash
   supabase start
   ```

### Frontend Setup

1. Docker Desktop must be installed on your system to run the frontend.
2. Use Docker Compose to build and run the application:
   ```bash
   docker compose up
   ```

This revised README provides a concise yet comprehensive overview of the Peridash project, highlighting the key technologies and methodologies employed. The instructions for running the project are simplified for ease of understanding, ensuring that users can easily set up the environment and explore the features of Peridash.
