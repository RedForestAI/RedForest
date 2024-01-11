'use client';

import Link from "next/link";
import React, { useState } from "react";

interface NavbarProps {
  includeBurger: boolean;
  logoLink: string;
  accountLink: string;
}

const Navbar = (props: NavbarProps) => {
  
  const [nav, setNav] = useState(false);  

  return (
    <div className="items-stretch bg-zinc-900 flex w-full justify-between gap-5 px-3.5 py-2 border-b-neutral-400 border-b-opacity-50 border-b border-solid max-md:max-w-full max-md:flex-wrap">
      <div className="items-stretch flex justify-between gap-4 py-0.5">
        {props.includeBurger && <div className="p-3 space-y-1.5 bg-gray-600 rounded shadow">
          <span className="block w-7 h-0.5 bg-gray-100"></span>
          <span className="block w-7 h-0.5 bg-gray-100"></span>
          <span className="block w-7 h-0.5 bg-gray-100"></span>
        </div>}
        <Link key={props.logoLink} href={props.logoLink}>
          <img
            loading="lazy"
            src="/imgs/logo-192x192.png"
            className="object-contain object-center w-[40px] overflow-hidden self-center shrink-0 max-w-full my-auto"
          />
        </Link>
      </div>
      <div className="items-center flex justify-between gap-4">
        <Link key={props.accountLink} href={props.accountLink}>
          <div className="relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
              <svg className="absolute w-12 h-12 text-gray-400 -left-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"></path></svg>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
