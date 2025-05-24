"use client";

import { signIn } from "next-auth/react";
import { redirect } from "next/dist/server/api-utils";
import { useState } from "react";

const SignIn = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState("");

  const handleSignIn = () => {
    signIn("google");
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUp) {
      const resStats = await fetch(`/api/createuser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: name, email: email, password: password }),
      });
        console.log("succesius");
      // Handle sign up logic here
      if (await resStats.status == 200) {
        console.log("success");
        const token = resStats.json.token;
        localStorage.setItem("token", token);
        redirect("/profile", "replace");
      }
    } else {
      const resStats = await fetch(`/api/loginuser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email, password: password }),
      });
        console.log("succesius", resStats.json);
      // Handle sign in logic here
       const data = await resStats.json(); // Récupération du JSON
      if (data.success) {
        console.log("Login successful");
        localStorage.setItem("token", data.token); // Stockage du token
        window.location.href = "/profile"; // Redirection vers le profil
        // redirect("/profile", "replace");
      } else {
        console.error("Error logging in:", data.message);
      }
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-[80vh] bg-white">
      <div className="h-fit w-fit p-3 rounded-lg border border-black">
        <h1 className="text-black font-bold text-3xl">
          {isSignUp ? "Créer un compte" : "Se connecter"}
        </h1>
        <form onSubmit={handleFormSubmit} className="flex flex-col mt-8">
          {isSignUp && (
            <input
              type="text"
              placeholder="Nom"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border mb-4 p-2 test-black"
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border mb-4 p-2 text-black"
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border mb-4 p-2 text-black"
          />
          <button
            type="submit"
            className="border border-gray-600 font-medium text-xl text-black p-2"
          >
            {isSignUp ? "Créer un compte" : "Se connecter"}
          </button>
        </form>
        <button
          onClick={handleSignIn}
          className="border mt-8 border-gray-600 font-medium text-xl text-black p-2"
        >
          Se connecter avec Google
        </button>
        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="mt-4 text-blue-500"
        >
          {isSignUp
            ? "Déjà un compte ? Se connecter"
            : "Pas de compte ? Créer un compte"}
        </button>
      </div>
    </div>
  );
};

export default SignIn;
