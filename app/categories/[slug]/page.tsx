"use client";
import { getUser } from "@/app/api/user/route";
import { useEffect, useState } from "react";
import User from "@/app/Objects/User";
import { getConnectionCookie } from "@/app/components/functions";
import { useRouter } from "next/router";
import Festival from "@/app/Objects/Festival";
import Link from "next/link";

export default function Page({ params }: { params: { slug: string } }) {
  const [isLoading, setLoading] = useState(true);
  const initialPostList = 10; // Number of articles to display initially
  const incrementInitialPostList = 10; // Number of articles to add each time the "load more" button is clicked
  const [festi, setFesti] = useState([]);
  const [nbFest, setNbFest] = useState(initialPostList);
  let catActive: any = "";

  useEffect(() => {
    try {
      const getCategories = async () => {
        const resStats = await fetch(`/api/selectfestivalsbycat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ cat: params.slug }),
        });
        if (!resStats.ok) {
          throw new Error("Erreur dans la requête");
        }

        const data = await resStats.json();
        // Traite ici ta réponse*
        console.log(data.data);
        setFesti(data.data);
      };
      getCategories();
    } catch (error) {
      console.error("Erreur lors de la récupération des catégories:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMore = () => {
    setNbFest(nbFest + incrementInitialPostList);
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="bg-white flex flex-col p-5 min-h-[85vh]">
      <div
        className="relative flex justify-center items-center h-[10vh] w-full top-0"
      >
        <img
          src={`/assets/${params.slug}.png`}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <h3 className="relative font-semibold text-black bg-white/70 px-2 py-1 rounded">
          Festivals de {params.slug}
        </h3>
      </div>
      <div className="flex flex-col justify-center items-center mt-10">
        <div className="w-full flex flex-col gap-3">
          <div className="flex flex-row justify-around text-black text-center">
            <p>Nom du festival</p>
            <p>Catégorie</p>
            <p>Période</p>
          </div>
          {festi.slice(0, nbFest).map((festival, index) => (
            <div
              key={index}
              className="festival-item grid grid-cols-3 justify-between font-normal w-full"
            >
              <Link href={`/festival/${festival.identifiant}`}>
                <p className="text-black font-semibold text-2xl">
                  {festival["\ufeffnomfestival"]}
                </p>
              </Link>
              <p className="text-black text-xl">{festival[params.slug]}</p>
              <p className="text-gray-400 text-xl">
                {festival.periodefestival}
              </p>
              
            </div>
          ))}
        </div>
        {nbFest < festi.length && (
          <button
            onClick={loadMore}
            className="mt-4 p-2 bg-blue-500 text-white rounded"
          >
            Afficher plus
          </button>
        )}
      </div>
    </div>
  );
}
