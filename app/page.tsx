"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "./components/Header";
import Map from "./components/Map";
import Link from "next/link";

import MapComponent from "./components/Map";

export default function Home() {
  const [isLoading, setLoading] = useState(true);
  const [Fest, setFest] = useState([]);
  const [Cat, setCat] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);
    const router = useRouter();
  
  const handleMapInstance = (instance: L.Map) => {
    setMapInstance(instance);
  };
  useEffect(() => {
    const getCategories = async () => {
      const resStats = await fetch(`/api/getcategories`, {
        method: "GET",
      });
      let dataFestivals = await resStats.json();
      setCat(dataFestivals);
      setLoading(false);
    };
    getCategories();
  }, []);


  if (isLoading) return <p>Loading...</p>;
  return (
    <>
      {/* <Header /> */}
      <main className="bg-white text-black flex flex-col items-center justify-center h-full">
        <div>
          <div className="bg-black">
            <div className="bg-MachineHead h-[70vh] w-screen flex flex-col justify-center items-center bg-no-repeat bg-cover">
              <h1 className="font-black text-[5rem] text-white">
                Find your festival.
              </h1>
              <h1 className="font-black text-[4.5rem] text-white">
                Anywhere, any time.
              </h1>
              {/* <img src="/assets/teenyicons_down-solid.png"/> */}
            </div>
          </div>
          <div>
            <p className="font-medium text-2xl p-5 text-gray-800 text-justify">
            Découvrez notre site dédié à la découverte des festivals ! Que vous soyez passionné de littérature, de musique, de cinéma ou d'arts vivants, nous recensons les événements incontournables de chaque domaine. Trouvez rapidement des festivals près de chez vous ou à l'international grâce à notre interface simple et intuitive. Restez informé des dernières tendances culturelles et ne manquez aucune manifestation. Votre agenda culturel n'a jamais été aussi complet !
            </p>
          </div>
        </div>
        <div className="w-[60vw] text-center flex flex-col gap-5 my-[10vh]">
          <h2 className="font-bold text-3xl text-ThirdColor">
            Accéder aux catégories
          </h2>
          <div className="flex flex-row gap-3 flex-wrap grow w-full max-h-full">
            {Cat != null
              ? Cat.map((element, index) => (
                <Link href={`categories/${element.image}`} className={`basis-1/4 grow rounded-lg flex flex-row justify-center items-center border border-gray-900 bg-cover h-[10vh] overflow-hidden backdrop-blur-md`}>
                    <div
                      key={index}
                      className="relative flex justify-center items-center h-full w-full"
                    >
                      <img
                      src={`/assets/${element.image}.png`}
                      className="absolute inset-0 h-full w-full object-cover"
                      />
                      <h3 className="relative font-semibold text-black bg-white/70 px-2 py-1 rounded">
                      {element.name}
                      </h3>
                    </div>
                    </Link>
                ))
              : null}
          </div>
        </div>
        <div className="map h-[70vh] w-full flex flex-col justify-start items-center">
          <nav className="w-[90%] h-10vh flex flex-row items-start p-4 border border-stone-500">
            <img
              src="/assets/magnifying-glass.png"
              className="h-iconSize aspect-square"
            />
            <input
              type="text"
              className="border rounded px-3 py-1 w-1/2"
              placeholder="Rechercher un festival..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />          </nav>
          {/*research zone*/}
          <nav className=""> </nav> {/*filter zone*/}
          <div className="w-[90vw] h-[25vh] border border-blue-500 ">
            <MapComponent onMapInitialized={handleMapInstance} />
            {mapInstance && (
              <p>
                Carte initialisée ! Vous pouvez maintenant interagir avec
                l'instance.
              </p>
            )}
          </div>
          {/*map zone*/}
        </div>
      </main>
    </>
  );
}
