"use client";

import React from "react";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

import { 

  LayoutDashboard, 

  Search, 

  Briefcase, 

  Settings, 

  LogOut,

  User,

  Globe

} from "lucide-react"; 

import { CommandMenu } from "@/components/dashboard/CommandMenu";
import AuthGuard from "@/components/auth/AuthGuard";


export default function DashboardLayout({

  children,

}: {

  children: React.ReactNode;

}) {

  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      // Check if Supabase is configured before attempting sign out
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        console.warn('Supabase not configured. Redirecting to home page.');
        router.push('/');
        return;
      }

      const supabase = createClient();
      await supabase.auth.signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
      // Even if sign out fails, redirect to home page
      router.push('/');
    }
  };



  // Determine header title based on current route

  const getHeaderTitle = () => {

    if (pathname?.includes("/mobility")) return "Command Center / Mobility OS";

    if (pathname?.includes("/student")) return "Command Center / Student Overview";

    if (pathname?.includes("/professor")) return "Command Center / Lab Recruitment";

    if (pathname?.includes("/grants")) return "Command Center / Find Grants";

    if (pathname?.includes("/applications")) return "Command Center / My Applications";

    if (pathname?.includes("/profile")) return "Command Center / My Profile";

    return "Command Center";

  };



  return (

    <div className="min-h-screen bg-[#0B0F19] text-white flex">

      <CommandMenu />

      {/* Sidebar - "The Command Center" Navigation */}

      <aside className="w-64 border-r border-white/10 bg-white/5 backdrop-blur-lg hidden md:flex flex-col h-screen sticky top-0">

        <div className="p-6 border-b border-white/10">
          <Link 
            href={pathname?.includes("/professor") ? "/dashboard/professor" : "/dashboard/student"}
            className="block hover:opacity-80 transition-opacity cursor-pointer"
          >
            <h1 className="text-xl font-bold bg-gradient-to-r from-teal-400 to-teal-600 bg-clip-text text-transparent">
              Career Bird
            </h1>
            <p className="text-xs text-gray-400 mt-1">Research Intelligence</p>
          </Link>
        </div>



        <nav className="flex-1 p-4 space-y-2">

          <NavItem href="/dashboard/student" icon={<LayoutDashboard size={20} />} label="Battle Station" active={pathname === "/dashboard/student"} />

          <NavItem href="/dashboard/student/grants" icon={<Search size={20} />} label="Find Grants" active={pathname === "/dashboard/student/grants"} />

          <NavItem href="/dashboard/student/applications" icon={<Briefcase size={20} />} label="My Applications" active={pathname === "/dashboard/student/applications"} />

          <NavItem href="/dashboard/student/mobility" icon={<Globe size={20} />} label="Mobility OS" active={pathname === "/dashboard/student/mobility"} />

          <NavItem href="/dashboard/student/profile" icon={<User size={20} />} label="My Profile" active={pathname === "/dashboard/student/profile"} />

        </nav>



        <div className="p-4 border-t border-white/10">

           <button 
            onClick={handleSignOut}
            className="flex items-center gap-3 text-gray-400 hover:text-white w-full px-4 py-3 rounded-lg hover:bg-white/5 transition-all"
          >

            <LogOut size={20} />

            <span className="text-sm font-medium">Sign Out</span>

          </button>

        </div>

      </aside>



      {/* Main Content Area */}

      <main className="flex-1 overflow-y-auto">

        <header className="h-16 border-b border-white/10 flex items-center justify-between px-8 bg-[#0B0F19]/50 backdrop-blur-md sticky top-0 z-10">

           <h2 className="text-sm font-medium text-gray-400">{getHeaderTitle()}</h2>

           <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-teal-500 to-teal-600 border border-white/20"></div>

        </header>

        <div className="p-8">

          <AuthGuard>
            {children}
          </AuthGuard>

        </div>

      </main>

    </div>

  );

}



// Simple Nav Item Component

function NavItem({ href, icon, label, active = false }: { href: string; icon: React.ReactNode; label: string; active?: boolean }) {

  return (

    <Link 

      href={href} 

      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all group ${

        active 

          ? "bg-teal-500/10 text-teal-400 border border-teal-500/20" 

          : "text-gray-400 hover:bg-white/5 hover:text-white"

      }`}

    >

      {icon}

      <span className="text-sm font-medium">{label}</span>

    </Link>

  );

}

