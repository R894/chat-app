export const baseUrl = "http://localhost:5000/api";

export const postRequest = async (
  url: string,
  body: BodyInit | null | undefined,
  token?: string | null
) => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
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

export const getRequest = async (url: string, token?: string | null) => {
  const response = await fetch(url, {headers: {
    "Authorization": `Bearer ${token}`
  }});

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
  addFriend: async (userId: string, friendId: string, token: string) => {
    const response = await postRequest(
      `${baseUrl}/users/friends/add`,
      JSON.stringify({ userId, friendId }),
      token
    );

    if (response.error) {
      console.log(response.error);
      return;
    }
    return response;
  },

  acceptFriendRequest: async (userId: string, friendId: string, token:string) => {
    const response = await postRequest(
      `${baseUrl}/users/friends/accept`,
      JSON.stringify({ userId, friendId }),
      token
    );

    if (response.error) {
      console.log(response.error);
      return;
    }
    return response;
  },

  declineFriendRequest: async (userId: string, friendId: string, token:string) => {
    const response = await postRequest(
      `${baseUrl}/users/friends/decline`,
      JSON.stringify({ userId, friendId }),
      token
    );

    if (response.error) {
      console.log(response.error);
      return;
    }
    return response;
  },

  getUserById: async (userId: string, token: string) => {
    const response = await getRequest(`${baseUrl}/users/find/${userId}`, token);

    if (response.error) {
      console.log(response.error);
      return;
    }
    return response;
  },

  sendMessage: async (chatId: string, senderId: string, text: string, token: string) => {
    const response = await postRequest(
      `${baseUrl}/messages/`,
      JSON.stringify({ chatId: chatId, senderId: senderId, text: text }),
      token
    );
    if (!response || response.error) {
      console.error("Error sending message", response);
      return;
    }
    return response;
  },

  getChatId: async (firstId: string, secondId: string, token: string) => {
    const response = await postRequest(
      `${baseUrl}/chats/`,
      JSON.stringify({ firstId, secondId }),
      token
    );
    if (!response || response.error) {
      console.error("Error creating chat", response);
      return;
    }
    return response;
  },

  getMessages: async (currentChatId: string, token: string) => {
    const response = await getRequest(`${baseUrl}/messages/${currentChatId}`, token);
    if (!response) {
      return;
    }
    if (response.error){
      console.log("error", response);
      return;
    }
    return response;
  },

  getFriends: async (userId: string, token: string) => {
    const response = await postRequest(
      `${baseUrl}/users/friends`,
      JSON.stringify({ userId }),
      token
    );
    if (response.error) {
      return console.log("Error fetching users", response);
    }
  },
};
