"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import proj4 from "proj4";
import { useEffect, useRef } from "react";

function convertXYToLatLon(x: number, y: number): { latitude: number, longitude: number } {
  var secondProjection = "+proj=lcc +lat_1=29.7 +lat_0=29.7 +lon_0=-5.4 +k_0=0.9996155960000001 +x_0=500000 +y_0=300000 +a=6378249.2 +b=6356515 +towgs84=31,146,47,0,0,0,0 +units=m +no_defs";
  var firstProjection = "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs ";
  const [longitude, latitude] = proj4(secondProjection, firstProjection, [x, y]);
  return { latitude, longitude };
}

export default function FestivalMap({ geocodageXY, nomFestival }: { geocodageXY: string; nomFestival: string }) {
  const mapDivRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapDivRef.current || !geocodageXY) return;

    // Nettoyage si la carte existe déjà
    mapDivRef.current.innerHTML = "";

    const [x, y] = geocodageXY.split(",").map(Number);
    // const { latitude, longitude } = {x, y};

    const map = L.map(mapDivRef.current).setView([x, y], 13);

    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png", {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    const LeafIcon = L.Icon.extend({
      options: {
        iconUrl: "/assets/point2.png",
        iconSize: [30, 35],
        iconAnchor: [10, 30],
        popupAnchor: [0, -30],
      },
    });
    const leafIcon = new LeafIcon();

    L.marker([x, y], { icon: leafIcon })
      .addTo(map)
      .bindPopup(nomFestival);

    return () => {
      map.remove();
    };
  }, [geocodageXY, nomFestival]);

  return <div ref={mapDivRef} style={{ height: "300px", width: "100%" }} />;
}