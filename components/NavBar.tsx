'use client';

import Link from "next/link";
import { createBrowserClient } from '@supabase/ssr';
import React, { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

interface NavLink {
  id: number;
  link: string;
  title: string;
}

const Navbar = () => {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const [nav, setNav] = useState(false);  
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const user = supabase.auth.getUser();
    setLoggedIn(!!user);

    supabase.auth.onAuthStateChange((event: any, session: any) => {
      setLoggedIn(!!session?.user);
    })

  }, []);

  const links: NavLink[] = loggedIn 
  ? [
    { id: 1, link: "auth/account", title: "Account" }
  ]
  : [
    { id: 1, link: "auth/login", title: "Login" }
  ]

  return (
    <div className="flex justify-between items-center w-full h-14 px-4 text-white bg-zinc-800 nav">
      <div>
        {/* <h1 className="text-5xl font-signature ml-2"><a className="link-underline hover:transition ease-in-out delay-150 hover:underline hover:decoration-solid" href="">Logo</a></h1> */}
        <h1 className="text-2xl font-signature ml-2">
        <Link href="/">
          SandCastleReader
        </Link>
        </h1>
      </div>

      <ul className="hidden md:flex">
        {links.map(({ id, link, title }) => (
          <li
            key={id}
            className="nav-links px-4 cursor-pointer capitalize font-medium text-gray-500 hover:scale-105 hover:text-white duration-200 link-underline"
          >
            <Link href={link}>{title}</Link>
          </li>
        ))}
      </ul>

      <div
        onClick={() => setNav(!nav)}
        className="cursor-pointer pr-4 z-10 text-gray-500 md:hidden"
      >
        {nav ? <FaTimes size={30} /> : <FaBars size={30} />}
      </div>
    </div>
  );
};

export default Navbar;
