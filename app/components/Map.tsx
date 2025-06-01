"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import proj4 from 'proj4';
import { useEffect, useRef } from "react";
import Festival from "@/app/Objects/Festival";

function convertXYToLatLon(x: number, y: number): { latitude: number, longitude: number } {
  var secondProjection = "+proj=lcc +lat_1=29.7 +lat_0=29.7 +lon_0=-5.4 +k_0=0.9996155960000001 +x_0=500000 +y_0=300000 +a=6378249.2 +b=6356515 +towgs84=31,146,47,0,0,0,0 +units=m +no_defs";
  var firstProjection = "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs ";
  const [longitude, latitude] = proj4(secondProjection, firstProjection, [x, y]);
  return { latitude, longitude };
}

function MapComponent() {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Centrage sur la France
    const map = L.map(mapRef.current, {
      center: [46.603354, 1.888334], // Centre de la France
      zoom: 6,
    });

    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    async function mapDataGettr() {
      const response = await fetch("/api/getfestivalsmap");
      let data = await response.json();
      return data;
    }

    async function pinpointer() {
      let pinpointslist = await mapDataGettr();
      const LeafIcon = L.Icon.extend({
        options: {
          iconUrl: "/assets/point2.png",
          iconSize: [10, 15],
          iconAnchor: [10, 15],
          popupAnchor: [-5, -10]
        }
      });

      const leafIcon = new LeafIcon();

      pinpointslist.forEach((point : Festival) => {
        if (point.geocodageXY && point.geocodageXY.split(",")[1]) {
          const lat = parseFloat(point.geocodageXY.split(",")[0]);
          const lon = parseFloat(point.geocodageXY.split(",")[1]);
          const marker = L.marker([lat, lon], { icon: leafIcon }).addTo(map);
          marker.bindPopup(
            `<a href="/festival/${point.identifiant}" target="_blank" style="color:#2563eb;text-decoration:underline;">
              ${point.festivalname}
            </a>`
          );
        }
      });
    }

    pinpointer();

    return () => {
      map.remove();
    };
  }, []);

  return <div ref={mapRef} style={{ height: "750px", width: "100%" }} />;
}

export default MapComponent;