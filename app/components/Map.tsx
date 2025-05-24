"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import HeatLayer from "leaflet.heat";
import proj4 from 'proj4';
import { useEffect, useRef, useState } from "react";
import 'leaflet/dist/leaflet.css';
// import convertXYToLatLon from "../coordFormatter";


function convertXYToLatLon(x: number, y: number): { latitude: number, longitude: number } {
  // const wgs84 = '+proj=latlong +datum=WGS84 +no_defs'; // Latitude/Longitude (WGS84)
  // const webMercator = '+proj=merc +lon_0=0 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs'; // Web Mercator
  var secondProjection = "+proj=lcc +lat_1=29.7 +lat_0=29.7 +lon_0=-5.4 +k_0=0.9996155960000001 +x_0=500000 +y_0=300000 +a=6378249.2 +b=6356515 +towgs84=31,146,47,0,0,0,0 +units=m +no_defs";
  var firstProjection ="+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs "

  const [longitude, latitude] = proj4(secondProjection, firstProjection, [x, y]); // Conversion
  return { latitude, longitude };
}

function MapComponent() {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = L.map(mapRef.current, {
      center: [0, 0],
    }).setView([50,0], 6);

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
        iconUrl: "/assets/point.png",
        iconSize:     [10, 15],
        iconAnchor:   [10, 15],
        popupAnchor:  [-5, -10]
      }
    });



    const leafIcon = new LeafIcon();
    const heatPoints: [number, number, number][] = []; // Array for heatmap points

    
     pinpointslist.forEach((point) => {
      if(point.geocodageXY.split(",")[1]){
        const marker = L.marker([
          point.geocodageXY               ? parseFloat(point.geocodageXY.split(",")[0])
            : 0,
          point.geocodageXY.split(",")[1] ? parseFloat(point.geocodageXY.split(",")[1])
            : 0,
        ], {icon: leafIcon}).addTo(map);      
        marker.bindPopup(point["\ufeffnomfestival"]);

        heatPoints.push([point.latitude, point.longitude, 1]); // Intensity is set to 1 by default
      }        
      });


      const heatLayer = L.heatLayer(heatPoints, {
        radius: 25,
        blur: 15,
        maxZoom: 17,
      });
      heatLayer.addTo(map);
    }

    pinpointer();
    return () => {
      map.remove();
    };
  }, []);
  // if (isLoading) return <p>Loading...</p>;

  return <div ref={mapRef} style={{ height: "500px", width: "100%" }} />;
}

export default MapComponent;
