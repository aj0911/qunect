# Qunect

Qunect is a real-time chat application built with Redis, React JS, Node.js with Express, and MySQL. It uses web sockets to provide seamless real-time communication.

## Features

- Real-time chat with WebSocket support
- User authentication
- Redis for caching and real-time data management
- MySQL for persistent data storage

## Prerequisites

- Node.js (>= 14.x)
- MySQL
- Redis

## Setup

### Environment Variables

To run this project, you will need to add the following environment variables to your `.env` file in the `backend` directory:

```env
NODE_ENV=DEVELOPMENT
PORT=5500

DB_URI=mysql://your_user:your_db_password@localhost:3306/qunect_db

MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_SERVICE=gmail
MAIL_USER=YOUR_EMAIL@gmail.com
MAIL_PASS=YOUR_PASSWORD

REDIS_PORT=6379
REDIS_HOST=localhost
REDIS_PASS=your_redis_password


