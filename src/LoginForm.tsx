import axios, { AxiosError } from "axios";
import React, { useState } from "react";

const LoginForm = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  async function loginUser(event: any) {
    event.preventDefault();

    await axios
      .post("/api/user/login", {
        username,
        password,
      })
      .then((res) => {
        localStorage.setItem("token", res.data);
        window.location.href = "/";
      })
      .catch((err: AxiosError) => {
        console.log(err);
      });
  }
  return (
    <div className="w-[100vw] h-[100vh] flex justify-center items-center">
      <form
        onSubmit={loginUser}
        method="POST"
        className="border-2 border-solid flex flex-col text-indigo-900 p-6 "
      >
        Username:
        <input
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
          }}
          type="text"
          name="username"
          className="p-2 border rounded-md tex-indigo-400 my-4"
          placeholder="username"
        />
        <br />
        Password:
        <input
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          name="pasword"
          className="p-2 border rounded-md tex-indigo-400 my-4"
          placeholder="password"
        />
        <br />
        <button
          type="submit"
          className="mx-16 rounded-sm p-2 px-4 mt-4 mx-2 border-blue bg-indigo-400 hover:bg-indigo-500 hover:text-white"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
