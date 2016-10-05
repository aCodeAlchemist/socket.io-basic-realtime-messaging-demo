# Basic Realtime Messaging App Using Socket.io

Leave your queries in gitter chat room.
[![Join the chat at https://gitter.im/socket-io-basic-realtime-messaging-demo/Lobby](https://badges.gitter.im/socket-io-basic-realtime-messaging-demo/Lobby.svg)](https://gitter.im/socket-io-basic-realtime-messaging-demo/Lobby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)


## Demo includes following features:

- Group/Room based messaging
- Image, Audio, Video files attachments

## Setting Up

1. Clone / Download repo
2. Run `npm install` to install packages specified in package.json
3. Create folder `public/images/users/` for file upload
4. Set up MongoDB, create database and start MongoDB
5. Modifiy connection string accordigly in `database/database.js:3` file
6. Start server using `npm start` or run `nodemon` if you have it installed and navigate to http://localhost:3000

## List of APIs

### `/users/createRoom`

Used to create new room. Accepts `name` parameter in request data which is name of the room. In response you will get room id and room name.
```json
{ "id": "uniqueRoomId", "name": "some room name" }
```

### `/users/rooms`

Used to get list of all rooms available.

### `/users/add`

Used to add new user into room. Accepts `userName` and `email` as request paramas and returns user id and username in response.
```json
{ "id": "uniqueUserId", "name": "User name" }
```

### `/users/media`

Used to upload image/audio/video. Accepts single binary file with key `file` and returns URL of uploaded file.
```json
{"url": "imageUrl"}
```

## Emmitter Events

### `addUser`

Event is used to add a user into given room. Requires `name` (user name), `id` (user id), and `roomId` (room id) to be passed.

```json
{
  "name": "name of the user",
  "id": "user id after creating user",
  "roomId": "room id"
}
```

### `typing`

Event is used when someone starts typing. Requires `name` of the user who is typing to be passed.
```json
{
  "name": "name of the user"
}
```

### `typingStopped`

Event is used when someone stops typing after some interval. Requires `name` of the user who stopped typing to be passed.
```json
{
  "name": "name of the user"
}
```

### `addedMessage`

Event is used when message is added in the room.

Requires following data to be sent in event:

- `type` of message (text, image, audio, video)
- `text` message text (text message or url in case if type is any of the media)
- `user` name of the user who is sending message

## Listener Events

### `userAdded`

Triggered when new user is added in room. Following data will be available in callback:
```json
{ "joined": "user name who joined", "allUsers": ["Array of all users"] }
```

### `onMessageRecieved`

Triggered when new message is received in room. Same data will be available as in `addedMessageEvent` event.

### `startedTyping` & `stoppedTyping`

Triggered when someone in the room starts typing or stops typinh. Same data will be available as in `typing` and `typingStopped` events.

### `userLeft`

Triggered when some user leaves the room. Following data will be available in callback:
```json
{ "left": "user name who left", "allUsers": ["Array of all users"] }
```
