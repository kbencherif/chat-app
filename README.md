# Real-Time Chat Application

## Overview

This project is a real-time chat application built using Node.js and TypeScript. It demonstrates the use of streams and events in a server-side application.

## Features

- Real-time messaging between connected users.
- Logs chat messages to a file using streams.
- Uses Node.js EventEmitter for handling events.

## Getting Started

### Prerequisites

- Node.js (v12 or later)
- npm
- Docker
- Docker compose

### Installation

1. Clone the repository:

   ```bash
   git clone git@github.com:kbencherif/chat-app.git
   cd chat-app
   ```
2. Create a logfile:
    ```bash
    mkdir ./logs
    touch ./logs/chat.log
    ```

### Running the Application

#### If you want to run the project with Docker
1. Run the docker compose:
    ```bash
    docker compose up --build -d
    ```

#### If you want to run the project without Docker
1. Install dependencies:

   ```bash
   npm install
   ```
   
2. Run the project:
    ```bash
    npm run start:dev
    ```
    To run the project with hot realod:
    ```bash
    npm run start:watch
    ```

2. Open a WebSocket client and connect to `ws://localhost:3000`.

## Project Structure

- `src/`: Contains the source code.
- `logs/`: Contains the chat log file.
- `tests/`: Contains the tests files.

### How to contribute?

1. Create a branch

    Your branch should be named based on the topic your work on.
    For exemple if you add a feature to the project your branch should be named ```feature/{your feature}```.
    
    Here is a non-exhaustive prefixes list for your branches:
    - feature
    - bugfix
    - refacto
    - doc
    - infra
    
2. Follow the same commit standar

    Use emoji as prefix for your commit message. Don't use any random emoji, use gitmoji guide -> https://gitmoji.dev/.

    A commit message should start by a capital letter, the first word should be a verb and it should end by a dot.

3. Write your tests

    You should implements tests to make sur your code works the way you want. We use the testing framework jest https://jestjs.io/.

    Before a merge to develop all your tests should pass.
    You can write your test before or after development, there is no strict rule for that.
    
    To run your tests:
    ```bash
    npm run tests
    ```

4. Pull request

    Make a pull request when you are done with your work, every topic should be subject to a code review.


### What next?

- Add CI/CD
- Add Docker for production
- Add frontend
- Add infra with terraform and AWS
- Add secrets/environment managment

## License

This project is licensed under the MIT License.
