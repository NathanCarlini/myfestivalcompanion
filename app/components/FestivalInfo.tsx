"use client"
import dynamic from 'next/dynamic';

interface FestivalMapProps {
  geocodageXY: string;
  nomFestival: string;
}

const FestivalMap = dynamic<FestivalMapProps>(() => import('./FestivalMap'), {
  ssr: false,
});

interface FestivalProps {
  nomFestival: string;
  commune: string;
  periode: string;
  typefestival: string;
  geocodageXY: string;
}

export default function FestivalInfo({
  nomFestival,
  commune,
  periode,
  typefestival,
  geocodageXY,

}: FestivalProps)
 {
  return (
    <div className="max-w-xl mx-auto bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-bold mb-2">{nomFestival}</h2>
      <div className="mb-2">
        <span className="font-semibold">Commune :</span> {commune}
      </div>
      <div className="mb-2">
        <span className="font-semibold">Période :</span> {periode}
      </div>
      <div className="mb-2">
        <span className="font-semibold">Type :</span> {typefestival}
      </div>
      <FestivalMap geocodageXY={geocodageXY} nomFestival={nomFestival} />
    </div>
  );
}