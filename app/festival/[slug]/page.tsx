"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import FestivalMap from "@/app/components/FestivalMap";

export default function Page({ params }: { params: { slug: string } }) {
  const [isLoading, setLoading] = useState(true);
  const [Fest, setFest] = useState<any>(null);
  const [favLoading, setFavLoading] = useState(false);
  const [favSuccess, setFavSuccess] = useState<boolean | null>(null);

  useEffect(() => {
    const getfestival = async () => {
      const resStats = await fetch(`/api/getfestivalbyidentifiant`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: params.slug }),
      });
      if (!resStats.ok) throw new Error("Erreur dans la requête");
      let dataFestivals = await resStats.json();
      setFest(dataFestivals.data);
      setLoading(false);
    };
    getfestival();
  }, [params.slug]);

  const handleFavorite = async () => {
    setFavLoading(true);
    setFavSuccess(null);
    const res = await fetch("/api/putfavorite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ festivalId: Fest.festivallist_id }),
    });
    if (res.ok) {
      setFavSuccess(true);
    } else {
      setFavSuccess(false);
    }
    setFavLoading(false);
  };

  if (isLoading) return <p>Loading...</p>;
  if (!Fest) return <p>Festival introuvable.</p>;

  return (
    <main className="bg-white text-black flex flex-col h-[90vh]">
      <div className="flex flex-row items-center mt-8 pl-8 h-16 w-[30vw] text-left gap-4">
        <h1 className="text-4xl font-semibold">{Fest.festivalname}</h1>
        {/* Icône étoile */}
        <button
          onClick={handleFavorite}
          className="ml-2"
          title="Ajouter aux favoris"
          disabled={favLoading}
        >
          {favSuccess === true ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="#FFD700" viewBox="0 0 24 24" className="w-8 h-8">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#FFD700" strokeWidth="2" viewBox="0 0 24 24" className="w-8 h-8">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
            </svg>
          )}
        </button>
        {favSuccess === false && (
          <span className="text-red-500 ml-2">Connexion requise</span>
        )}
        {favSuccess === true && (
          <span className="text-green-600 ml-2">Ajouté !</span>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-8 p-8">
        <div className="flex-1">
          <div className="mb-2">
            <span className="font-semibold">Commune :</span> {Fest.commune}
          </div>
          <div className="mb-2">
            <span className="font-semibold">Période :</span> {Fest.periodefestival}
          </div>
          <div className="mb-2">
            <span className="font-semibold">Type :</span> {Fest.typefestival}
          </div>
        </div>
        <div className="flex-1 min-w-[300px] max-w-[500px]">
          <FestivalMap geocodageXY={Fest.geocodageXY} nomFestival={Fest.festivalname} />
        </div>
      </div>
    </main>
  );
}