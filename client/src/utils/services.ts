export const baseUrl = "http://localhost:5000/api";

export const postRequest = async (
  url: string,
  body: BodyInit | null | undefined
) => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body,
  });

  const data = await response.json();

  if (!response.ok) {
    let message;

    if (data?.message) {
      message = data.message;
    } else {
      message = data;
    }

    return { error: true, message };
  }
  return data;
};

export const getRequest = async (url: string) => {
  const response = await fetch(url);

  const data = await response.json();

  if (!response.ok) {
    let message = "An error occured...";

    if (data?.message) {
      message = data.message;
    }

    return { error: true, message };
  }

  return data;
};

export const api = {
  addFriend: async (userId: string, friendId: string) => {
    const response = await postRequest(
      `${baseUrl}/users/friends/add`,
      JSON.stringify({ userId, friendId })
    );

    if (response.error) {
      console.log(response.error);
      return;
    }
    return response;
  },

  acceptFriendRequest: async (userId: string, friendId: string) => {
    const response = await postRequest(
      `${baseUrl}/users/friends/accept`,
      JSON.stringify({ userId, friendId })
    );

    if (response.error) {
      console.log(response.error);
      return;
    }
    return response;
  },

  declineFriendRequest: async (userId: string, friendId: string) => {
    const response = await postRequest(
      `${baseUrl}/users/friends/decline`,
      JSON.stringify({ userId, friendId })
    );

    if (response.error) {
      console.log(response.error);
      return;
    }
    return response;
  },

  getUserById: async (id: string) => {
    const response = await getRequest(`${baseUrl}/users/find/${id}`);

    if (response.error) {
      console.log(response.error);
      return;
    }
    return response;
  },

  sendMessage: async (chatId: string, senderId: string, text: string) => {
    const response = await postRequest(
      `${baseUrl}/messages/`,
      JSON.stringify({ chatId: chatId, senderId: senderId, text: text })
    );
    if (!response || response.error) {
      console.error("Error sending message", response);
      return;
    }
    return response;
  },

  getChatId: async (firstId: string, secondId: string) => {
    const response = await postRequest(
      `${baseUrl}/chats/`,
      JSON.stringify({ firstId, secondId })
    );
    if (!response || response.error) {
      console.error("Error creating chat", response);
      return;
    }
    return response;
  },

  getMessages: async (currentChatId: string) => {
    console.log(`${baseUrl}/messages/${currentChatId}`);
    const response = await getRequest(`${baseUrl}/messages/${currentChatId}`);
    if (!response) {
      console.log("error", response);
      return;
    }
    return response;
  },

  getFriends: async (userId: string) => {
    const response = await postRequest(
      `${baseUrl}/users/friends`,
      JSON.stringify({ userId })
    );
    if (response.error) {
      return console.log("Error fetching users", response);
    }
  },
};
