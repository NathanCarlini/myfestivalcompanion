"use client";
import { getUser } from "@/app/api/user/route";
import { useEffect, useState } from "react";
import User from "@/app/Objects/User";
import { getConnectionCookie } from "@/app/components/functions";
import { useRouter } from "next/router";

export default async function Account() {
  const router = useRouter();
  const [isLoading, setLoading] = useState(true);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  const isUserLoggedInCookie = await getConnectionCookie();
  isUserLoggedInCookie ? setIsUserLoggedIn(true) : setIsUserLoggedIn(false);

  if (!isUserLoggedIn) {
    router.push("/login");
    return null;
  }

  const account: User = await getUser();
  setLoading(false);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-gray-500 animate-pulse">Chargement...</p>
      </div>
    );
  }
  if (!account) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-red-500">Aucune donnée de profil</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-white flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8 flex flex-col md:flex-row items-center gap-8">
        {/* Avatar */}
        <div className="flex flex-col items-center">
          <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-blue-200 shadow">
            <img
              src={`/assets/${account.image}`}
              alt="profile image"
              className="object-cover w-full h-full"
            />
          </div>
          <button
            className="mt-6 px-5 py-2 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
          >
            Modifier le profil
          </button>
        </div>
        {/* Infos utilisateur */}
        <div className="flex-1 flex flex-col items-center md:items-start">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{account.name}</h1>
          <h2 className="text-lg text-gray-500 mb-4">{account.email}</h2>
          {/* Ajoutez ici d'autres infos ou actions */}
          <div className="w-full border-t border-gray-200 my-4"></div>
          <div className="w-full flex flex-col gap-2">
            <span className="text-gray-700 font-medium">Autres informations :</span>
            {/* Exemples d'infos supplémentaires */}
            <span className="text-gray-600">Type de compte : <b>Standard</b></span>
            <span className="text-gray-600">Membre depuis : <b>2024</b></span>
          </div>
        </div>
      </div>
    </div>
  );
}