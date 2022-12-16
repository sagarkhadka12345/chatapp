import axios, { AxiosError } from "axios";
import React, { ChangeEvent, useState } from "react";

const AddFriend = () => {
  const [friendName, setFriendName] = useState("");
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFriendName(e.target.value);
  };

  const handleSubmit = () => {
    axios
      .post(
        `/api/user/addFriend`,
        { friend: friendName },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      )
      .then((res) => {
        alert("Friend added Succesfully");
        window.location.href = "/";
      })
      .catch((err: AxiosError) => alert(err.response?.data));
  };
  return (
    <div className="w-64 flex justify-evenly">
      <input
        type="text"
        className="border border-stone-900 mr-4"
        onChange={(e) => handleChange(e)}
      />
      <button className="border border-stone-900 ml-4" onClick={handleSubmit}>
        Add Friend
      </button>
    </div>
  );
};

export default AddFriend;
