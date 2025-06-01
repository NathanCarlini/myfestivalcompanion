"use client";
import { useState, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function Header() {
  const [showDialog, setShowDialog] = useState(false);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      if (value.trim().length < 2) {
        setResults([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      const res = await fetch("/api/searchfestival", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: value }),
      });
      const data = await res.json();
      setResults(data.results || []);
      setLoading(false);
    }, 500);
  };

  return (
    <>
      <header className="h-headerSize bg-MainColor text-white flex justify-between items-center px-4">
        <Link href="/">
          <div className="flex gap-4 flex-row items-center">
            <img
              className="h-iconSize aspect-square"
              src="/assets/group12.svg"
              alt="logo"
            />
            <p className="font-bold text-xl">My Festival Companion</p>
          </div>
        </Link>
        <div className="flex gap-4 flex-row">
          <button
            type="button"
            onClick={() => setShowDialog(true)}
            className="focus:outline-none"
            aria-label="Rechercher un festival"
          >
            <img
              className="h-iconSize aspect-square"
              src="/assets/material-symbols_search-rounded.png"
              alt="search"
            />
          </button>
          <a href="/auth">
            <img
              className="h-iconSize aspect-square"
              src="/assets/mdi_account-outline.png"
            />
          </a>
        </div>
      </header>
      {showDialog && (
        <div className="fixed inset-0 z-50 flex text-black items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-[50vw] max-w-xl max-h-[40vh] flex flex-col p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
              onClick={() => setShowDialog(false)}
              aria-label="Fermer"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <input
              autoFocus
              type="text"
              className="border rounded px-3 py-2 w-full mb-4"
              placeholder="Rechercher un festival..."
              value={search}
              onChange={handleSearchChange}
            />
            <div className="overflow-y-auto flex-1">
              {loading && <div className="text-gray-500">Recherche...</div>}
              {!loading && results.length === 0 && search.length > 1 && (
                <div className="text-gray-400">Aucun résultat.</div>
              )}
              <div className="flex flex-col gap-2">
                {results.map((festival) => (
                  <Link
                    key={festival.identifiant}
                    href={`/festival/${festival.identifiant}`}
                    className="flex items-center gap-3 p-2 rounded hover:bg-blue-50 transition"
                    onClick={() => setShowDialog(false)}
                  >
                    {/* <img
                      src={`/assets/${festival.image || "default.png"}`}
                      alt="Photo"
                      className="w-10 h-10 rounded object-cover border"
                    /> */}
                    <span className="w-full flex flex-row justify-between font-medium text-lg">{festival.festivalname}
                      <p className="text-gray-500"> {festival.commune}</p>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}