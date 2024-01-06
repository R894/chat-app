# Chatter

Welcome to Chatter! This app provides a simple real-time chat experience, featuring a React frontend and a Golang backend.

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Using Docker](#using-docker)
- [Usage](#usage)
- [Folder Structure](#folder-structure)
- [API Documentation](#api-documentation)

## Features

- Real-time messaging: Instantly exchange messages with other users.
- User authentication: Secure your conversations with user accounts.
- Friend requests: Connect with friends and manage friend requests.

## Getting Started

### Prerequisites

Before running the application, make sure you have the following installed:

- [Node.js](https://nodejs.org/) for the React frontend.
- [Golang](https://golang.org/) for the backend.
- [Docker](https://www.docker.com/) for running the app in a container.

### Installation
1. **Clone the repository:**

   ```bash
   git clone https://github.com/R894/chat-app.git
   ```

2. **Frontend setup**

    ```bash
    cd chatapp/client
    npm install
    ```

3. **Backend setup**

    1. Install the golang backend
    ```bash
    cd chatapp/go-server
    go get -d ./...
    ```
    2. Install the node.js socket backend
    ```bash
    cd chatapp/socket
    npm install
    npx tsc
    ```

### Using docker
If you prefer to use Docker for running the application, follow these steps:

1. **Build and Run Docker Containers:**
    ```bash
    docker-compose up
    ```
2. **Access the app**

    Open your web browser and go to http://localhost:5173 to access the app.

## Usage
1. **Run the golang backend:**
    ```bash
    cd chat-app/go-server
    go run ./cmd/main.go
    ```

2. **Run the socket server:**
    ```bash
    cd chat-app/socket
    node ./build/index.js
    ```

2. **Run the frontend:**
    ```bash
    cd chat-app/client
    npm run dev
    ```
3. **Access the app:**

    Open your web browser and go to http://localhost:5173 to access the app

## Api Documentation

Swagger documentation for the backend API is available at http://localhost:5000/docs/index.html. Explore the API endpoints and test them using the Swagger interface.
