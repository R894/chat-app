import { Server } from "socket.io";

interface User {
  userId: string;
  socketId: string;
}

// Keeping active users in an array is a terrible idea but whatever for now
let onlineUsers: User[] = [];

const io = new Server({
  cors: {
    origin: "http://localhost:5173",
  },
});

io.on("connection", (socket) => {
  console.log("new connection", socket.id);
  socket.on("addNewUser", (userId) => {
    !onlineUsers.some((user) => user.userId === userId) &&
      onlineUsers.push({
        userId,
        socketId: socket.id,
      });

    console.log("Online Users:", onlineUsers);

    io.emit("getOnlineUsers", onlineUsers);
  });

  socket.on("sendMessage", (message)=>{
    const user = onlineUsers.find((user) => user.userId === message.recipientId)

    if(user){
      io.to(user.socketId).emit("getMessage", message)
    }
  })

  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);

    io.emit("getOnlineUsers", onlineUsers);
  });
});

console.log("Server running on port 3000")
io.listen(3000);
