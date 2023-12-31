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

export const getUserById = async (id: string) => {
  const response = await getRequest(`${baseUrl}/users/find/${id}`);

  if (response.error) {
    console.log(response.error);
    return;
  }
  return response;
};

export const acceptFriendRequest = async (userId: string, friendId: string) => {
  const response = await postRequest(
    `${baseUrl}/users/friends/accept`,
    JSON.stringify({ userId, friendId })
  );

  if (response.error) {
    console.log(response.error);
    return;
  }
  return response;
};

export const declineFriendRequest = async (
  userId: string,
  friendId: string
) => {
  const response = await postRequest(
    `${baseUrl}/users/friends/decline`,
    JSON.stringify({ userId, friendId })
  );

  if (response.error) {
    console.log(response.error);
    return;
  }
  return response;
};

export const addFriend = async (
  userId: string,
  friendId: string
) => {
  const response = await postRequest(
    `${baseUrl}/users/friends/add`,
    JSON.stringify({ userId, friendId })
  );

  if (response.error) {
    console.log(response.error);
    return;
  }
  return response;
};
