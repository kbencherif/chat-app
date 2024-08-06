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

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd real-time-chat
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

### Running the Application

1. Start the server:

   ```bash
   npm run start
   ```

2. Open a WebSocket client and connect to `ws://localhost:3000`.

## Project Structure

- `src/`: Contains the source code.
- `logs/`: Contains the chat log file.

## License

This project is licensed under the MIT License.
