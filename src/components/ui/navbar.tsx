"use client";

import Link from "next/link";
import { Profile } from "@prisma/client";
import { useState, useEffect, useContext } from "react";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { middleNavBarContext, endNavBarContext } from '~/providers/navbar-provider';
import { InAssignmentContext } from "~/providers/InAssignmentProvider";

type Breadcrum = {
  name: string
  url: string
}

type NavbarProps = {
  profile?: Profile | null
  breadcrumbs?: Breadcrum[] | null
}

export default function Navbar(props: NavbarProps) {
  const middleNavBarContent = useContext(middleNavBarContext);
  const endNavBarContent = useContext(endNavBarContext);
  const router = useRouter();
  const supabase = createClientComponentClient();
  const {inAssignment, uploadingSession, setUploadingSession, setAfterUploadHref} = useContext(InAssignmentContext)

  // use theme from local storage if available or set light theme
  const [theme, setTheme] = useState<string | null>(null);
  
  // update state on toggle
  const handleToggle = (e: any) => {
    if (e.target.checked) {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

  useEffect(() => {
    const localTheme = localStorage.getItem("theme");
    setTheme(localTheme || "dark");
  }, [])

  // set theme state in localstorage on mount & also update localstorage on state change
  useEffect(() => {
    if (theme) {
      localStorage.setItem("theme", theme);
      // const localTheme = localStorage.getItem("theme");
      // add custom data-theme attribute to html tag required to update theme using DaisyUI
      document.documentElement.setAttribute("data-theme", theme);
    }

  }, [theme]);

  async function logOut() {
    if (inAssignment) {
      setUploadingSession(true)
      setAfterUploadHref('logout')
      return
    }

    // POST request using fetch inside useEffect React hook
    await supabase.auth.signOut();
    fetch(`${origin}/api/auth/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })
    .then(response => console.log(response))
    router.push('../session/login')
    router.refresh();
  }

  function goDashboard() {
    if (inAssignment) {
      setUploadingSession(true)
      setAfterUploadHref('/access')
      return
    }
    router.push('/access')
  }

  function goProfile() {
    if (inAssignment) {
      setUploadingSession(true)
      setAfterUploadHref('/access/account')
      return
    }
    router.push('/access/account')
  }

  function logIn() {
    if (inAssignment) {
      setUploadingSession(true)
      setAfterUploadHref('/session/login')
      return
    }
    router.push('/session/login')
  }

  function signUp() {
    if (inAssignment) {
      setUploadingSession(true)
      setAfterUploadHref('/session/sign-up')
      return
    }
    router.push('/session/sign-up')
  }

  function pushRoute(url: string) {
    if (inAssignment) {
      setUploadingSession(true)
      setAfterUploadHref(url)
      return
    }
    router.push(url)
  }

  return (
    <div className="navbar bg-base-200 border-b border-neutral relative" style={{zIndex: "100"}}>
      <div className="navbar-start">
        {props.profile &&
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn border border-neutral">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /></svg>
          </div>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 border bg-base-100 border-neutral rounded-box w-52">
            <li onClick={goDashboard}><a>Dashboard</a></li>
          </ul>
        </div>
        }

        <Link href={"/"}>
          <img
            loading="lazy"
            src="/imgs/logo-192x192.png"
            className="ml-4 mr-4 object-contain object-center w-[40px] overflow-hidden self-center shrink-0 max-w-full my-auto"
          />
        </Link>

        <div className="text-sm breadcrumbs overflow-hidden">
          <ul>
            {props.breadcrumbs && props.breadcrumbs.map((breadcrumb, index) => (
              <li key={index}>
                {breadcrumb.url != "" 
                  ? <>
                    <div className="hover:underline cursor-pointer" onClick={() => {pushRoute(breadcrumb.url)}}> 
                      <a>{breadcrumb.name}</a>
                    </div>
                  </>
                  : <>
                    <span>{breadcrumb.name}</span>
                  </>
                }
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="navbar-center">
        {middleNavBarContent}
      </div>

      <div className="navbar-end">

        {endNavBarContent}

        <div className="flex justify-center items-center pr-4">
          {theme && 
          <label className="swap swap-rotate">
            <input type="checkbox" onChange={handleToggle} checked={theme === "light" ? false : true}/>
            <svg className="swap-off fill-current w-6 h-6 md:stroke-black" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z"/></svg>
            <svg className="swap-on fill-current w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z"/></svg>
          </label>
          }
        </div>

        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle border-neutral border avatar">
            <div className="relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
              <svg className="absolute w-12 h-12 text-gray-400 -left-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"></path></svg>
            </div>
          </div>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow border-neutral bg-base-300 rounded-box w-52">
            {props.profile
              ? <>
                <li onClick={goProfile}><a>Profile</a></li>
                <li onClick={logOut}><a>Logout</a></li>
              </>
              : <>
                <li onClick={logIn}><a>Log In</a></li>
                <li onClick={signUp}><a>Sign Up</a></li>
              </>
            }
          </ul>
        </div>
      </div>
    </div>
  );
};
