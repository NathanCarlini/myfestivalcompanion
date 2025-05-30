"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Account() {
  const router = useRouter();
  const [isLoading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [favFestivals, setFavFestivals] = useState<any[]>([]);
  const [favLoading, setFavLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const resStats = await fetch(`/api/getuser`, {
          method: "GET",
        });
        const data = await resStats.json();
        if (data.success && data.user) {
          setUser(data.user);
        } else {
          router.push("/auth");
        }
      } catch (error) {
        router.push("/auth");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [router]);

  useEffect(() => {
    const fetchFavFestivals = async () => {
      setFavLoading(true);
      try {
        const res = await fetch("/api/getfavoritefestivals");
        const data = await res.json();
        if (data.success && data.festivals) {
          setFavFestivals(data.festivals);
        }
      } catch (e) {
        // ignore
      } finally {
        setFavLoading(false);
      }
    };
    fetchFavFestivals();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-gray-500 animate-pulse">Chargement...</p>
      </div>
    );
  }
  if (!user) {
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
              src={`/assets/${user.image}`}
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{user.name}</h1>
          <h2 className="text-lg text-gray-500 mb-4">{user.email}</h2>
          <div className="w-full border-t border-gray-200 my-4"></div>
          <div className="w-full flex flex-col gap-2">
            <span className="text-gray-700 font-medium">Autres informations :</span>
            <span className="text-gray-600">Type de compte : <b>Standard</b></span>
            <span className="text-gray-600">Membre depuis : <b>2024</b></span>
          </div>
        </div>
      </div>

      {/* Festivals favoris */}
      <div className="w-full max-w-2xl mt-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Vos festivals sauvegardés</h2>
        {favLoading ? (
          <div className="text-gray-500">Chargement...</div>
        ) : favFestivals.length === 0 ? (
          <div className="text-gray-400">Aucun festival sauvegardé.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {favFestivals.map((festival) => (
              <div key={festival.identifiant} className="bg-white rounded-xl shadow p-4 flex flex-col">
                <div className="flex items-center gap-3 mb-2">
                  <img
                    src={`/assets/${festival.image || "default.png"}`}
                    alt={festival["\ufeffnomfestival"]}
                    className="w-12 h-12 rounded object-cover border"
                  />
                  <div>
                    <div className="font-semibold text-lg">{festival["\ufeffnomfestival"]}</div>
                    <div className="text-gray-500 text-sm">{festival.periodefestival}</div>
                  </div>
                </div>
                <div className="text-gray-600 text-sm">{festival.villefestival}</div>
                <a
                  href={`/festival/${festival.identifiant}`}
                  className="mt-3 inline-block text-blue-600 hover:underline font-medium"
                >
                  Voir le festival
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}