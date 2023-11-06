# Innkeeper

Innkeeper is a Socket.IO server written in TypeScript. It handles user matching and serves as the central authority for collaborative editing.

## 🚀 Setup

1. Refer to `.env.example` for environment variables setup.
2. Obtain Firebase credentials and save them as `service_account.json` or whatever path you have pointed `GOOGLE_APPLICATION_CREDENTIALS` to. This is required for user authentication. For testing, you will need to obtain a Firebase token for your login to use in your `auth.token` header.
3. Use `api-innkeeper-types.ts` in any TypeScript client to get access to all the types. If you're testing without clients, use a Socket.IO compatible app like Postman.
4. Install dependencies with `yarn install` and start the server with `yarn start`.

## 📡 Why Socket.IO?

- **Real-time communication**: Socket.IO and WebSockets were the top choices for long-lived, real-time, two-way communication. HTTP polling was not ideal due to constant requests.
- **Robust support**: Socket.IO provides better support for older browsers and users behind misconfigured proxies by switching to long polling.
- **Developer-friendly**: Socket.IO offers TypeScript support, standardized ways to declare, use, and organize handlers and middlewares.
- **Enterprise features**: Socket.IO supports load balancing, horizontal scaling, and other features that outperform WebSockets.
- **WebRTC**: WebRTC was not considered due to its complexity and overkill for our use case.

## 💾 Server State

- The server stores all data in-memory, similar to Redis. Restarting the server will wipe all data, which is permissible as only short-term data is expected to be stored: primarily queueing user information and mid-session document changes.
- For horizontal scaling, the first step would be to move the data off this server. This can be achieved by replacing the `model.ts` used in this repo with an adapter for a Redis instance. With Socket.IO's built-in server-to-server communication, this stack is highly adaptible to your needs.

Please feel free to contribute and make Innkeeper better! 🎉
