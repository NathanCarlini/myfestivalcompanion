"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function Header() {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  // const [isLoading, setLoading] = useState(true);

  // useEffect(() => {
  //   const token = Cookies.get("isUserLoggedIn");
  //   setLoading(false);
  //   if (token != null) {
  //     setIsUserLoggedIn(true);
  //   }
  // }, []);

  // if (isLoading == true) return <p>Loading...</p>; 
  return (
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
        <a href="/search">
          <img
            className="h-iconSize aspect-square"
            src="/assets/material-symbols_search-rounded.png"
          />
        </a>
        {/* {isUserLoggedIn ? (
          <a href="/account">
            <img
              className="h-iconSize aspect-square"
              src="/assets/mdi_account-outline.png"
            />
          </a>
        ) : ( */}
          <a href="/auth">
            <img
              className="h-iconSize aspect-square"
              src="/assets/mdi_account-outline.png"
            />
          </a>
        {/* )} */}
        <a href="/accessibility">
          <img
            className="h-iconSize aspect-square"
            src="/assets/ion_accessibility-outline.png"
          />
        </a>
      </div>
    </header>
  );
}
