"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../../components/Header";
import Link from "next/link";

export default function Page({ params }: { params: { slug: string } }) {
  const [isLoading, setLoading] = useState(true);
  const [Fest, setFest] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const getfestival = async () => {
      const resStats = await fetch(`/api/getfestivalbyidentifiant`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: params.slug }),
      });
      if (!resStats.ok) {
        throw new Error("Erreur dans la requête");
      }
      let dataFestivals = await resStats.json();
      console.log(dataFestivals);
      setFest(dataFestivals.data);
      setLoading(false);
    };
    getfestival();
  }, []);

  //   festivalBulkList.rows = festivalBulkList.rows.filter(element => {
  //     return !(element[category] == null || element[category] == "" || element[category] == " ");
  // });

  if (isLoading) return <p>Loading...</p>;
  return (
    <>
      {/* <Header /> */}
      <main className="bg-white text-black flex flex-col h-[90vh]">
        <div className="flex flex-col items-start mt-8 pl-8 h-16 w-[30vw] text-left">
          <h1 className="text-4xl font-semibold">
            {Fest["\ufeffnomfestival"]}
          </h1>
        </div>
        <div className="flex flex-col">
          <div className="flex flex-col items-start">
            <div className="flex flex-row items-center gap-2">
              <img
                src="/assets/point.png"
                className="h-iconSize aspect-square"
              />
              <p className="text-2xl">{Fest.commune}</p>
            </div>
            <div>
              <p>{Fest.periodefestival}</p>
            </div>
          </div>
          <div></div>
        </div>
      </main>
    </>
  );
}
