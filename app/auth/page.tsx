"use client";

import { signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const SignIn = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Vérifie la présence d'un cookie JWT valide au chargement
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/getuser", { method: "GET" });
        const data = await res.json();
        if (data.success && data.user) {
          router.replace("/profile");
        }
      } catch (e) {
        // Pas authentifié, on laisse afficher la page
      }
    };
    checkAuth();
  }, [router]);

  const handleSignIn = () => {
    signIn("google");
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (isSignUp) {
      const resStats = await fetch(`/api/createuser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: name, email: email, password: password }),
      });
      if (resStats.status === 200) {
        const data = await resStats.json();
        localStorage.setItem("token", data.token);
        window.location.href = "/profile";
      }
    } else {
      const resStats = await fetch(`/api/loginuser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email, password: password }),
      });
      const data = await resStats.json();
      if (data.success) {
        localStorage.setItem("token", data.token);
        window.location.href = "/profile";
      } else {
        console.error("Error logging in:", data.message);
      }
    }
    setLoading(false);
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
              className="border mb-4 p-2 text-black"
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
            disabled={loading}
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