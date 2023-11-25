'use client';

import Link from "next/link";
import React, { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

interface NavLink {
  id: number;
  link: string;
  title: string;
}

interface NavbarProps {
  links?: NavLink[];
}

const Navbar = ({ links }: NavbarProps) => {
  
  const [nav, setNav] = useState(false);  

  return (
    <div className="flex justify-between items-center w-full h-14 px-4 text-white bg-zinc-800 nav">
      <div>
        {/* <h1 className="text-5xl font-signature ml-2"><a className="link-underline hover:transition ease-in-out delay-150 hover:underline hover:decoration-solid" href="">Logo</a></h1> */}
        <h1 className="text-2xl font-signature ml-2">
        <Link href="/">
          RedForest
        </Link>
        </h1>
      </div>

      <ul className="hidden md:flex">
        {links && links.map(({ id, link, title }) => (
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
