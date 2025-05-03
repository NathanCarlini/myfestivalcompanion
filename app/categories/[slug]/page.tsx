"use client";
import { getUser } from "@/app/api/user/route";
import { useEffect, useState } from "react";
import User from "@/app/Objects/User";
import { getConnectionCookie } from "@/app/components/functions";
import { useRouter } from "next/router";
import Festival from "@/app/Objects/Festival";
import Link from "next/link";

export default function Page({ params }: { params: { slug: string } }) {
  // const router = useRouter();
  const [isLoading, setLoading] = useState(true);
  const initialPostList = 10; // Number of articles to display initially
  const incrementInitialPostList = 10; // Number of articles to add each time the "load more" button is clicked
  const [festi, setFesti] = useState([]);
  const [nbFest, setNbFest] = useState(initialPostList);
  let catActive: any = "";

  useEffect(() => {
    try {
      const getCategories = async () => {
        const resStats = await fetch(`/api/getfestivalsbycat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ cat: "musique" }),
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
      <h1 className="text-black font-bold text-3xl text-center"> Festivals de {params.slug} </h1>
    <div className="flex flex-col justify-center items-center ">
      <div className="w-full flex flex-col gap-3">
        {festi.slice(0, nbFest).map((festival, index) => (
          <div key={index} className="festival-item flex flex-row justify-between font-normal ">
            <Link href={`/festival/${festival.identifiant}`}><p className="text-black font-semibold text-2xl">{festival["\ufeffnomfestival"]}</p></Link>
            <p className="text-black text-2xl">{festival.musique}</p>
          </div>
        ))}
      </div>
      {nbFest < festi.length && (
        <button onClick={loadMore} className="mt-4 p-2 bg-blue-500 text-white rounded">
          Afficher plus
        </button>
      )}
    </div>
    </div>
  );
}
