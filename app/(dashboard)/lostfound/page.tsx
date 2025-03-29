"use client";
import React, { useEffect, useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSearch,
  IconSettings,
  IconUserBolt,
} from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "motion/react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";

export default function Appsidebar() {
  const links = [
    {
      label: "Dashboard",
      href: "#",
      icon: (
        <IconBrandTabler className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Profile",
      href: "#",
      icon: (
        <IconUserBolt className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Lost and found",
      href: "/lostfound",
      icon: (
        <IconSearch className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Settings",
      href: "#",
      icon: (
        <IconSettings className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Logout",
      href: "/login",
      icon: (
        <IconArrowLeft className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
  ];
  const [open, setOpen] = useState(false);
  return (
    <div
      className={cn(
        "h-screen dark flex max-w-full flex-1 flex-col overflow-hidden rounded-md border md:flex-row border-neutral-700 bg-neutral-800" // for your use case, use `h-screen` instead of `h-[60vh]`
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: "Manu Arora",
                href: "#",
                icon: (
                  <Image
                    src="https://assets.aceternity.com/manu.png"
                    className="h-7 w-7 shrink-0 rounded-full"
                    width={50}
                    height={50}
                    alt="Avatar"
                  />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
      <Dashboard />
    </div>
  );
}
export const Logo = () => {
  return (
    <Link
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium whitespace-pre text-black dark:text-white"
      >
        CampusZone
      </motion.span>
    </Link>
  );
};
export const LogoIcon = () => {
  return (
    <Link
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
    </Link>
  );
};

// Dummy dashboard component with content
const Dashboard = () => {
  const [todoList, setTodoList] = useState<{ name: string; isCompleted: boolean }[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const supabase = createClient();
  useEffect(() => {
    fetchTodos();
  }, []);

   const fetchTodos = async () => {
    const { data, error } = await supabase.from("todo").select("*");
    if (error) {
      console.log("error");
    } else {
      setTodoList(data);
    }
  };

  const addTodo = async () => {
    const newTodoData = { name: newTodo, 
      isCompleted: false,
    };
    const { data, error } = await supabase
      .from("todo")
      .insert([newTodoData])
      .single();
    if (error) {
      console.log("error");
    } else {
      setTodoList((prev) => [...prev, ...(data || [])]);
      setNewTodo("");
    }
  };

  return (
    <div className="text-white flex flex-1">
      <div className="flex h-full w-full flex-1 flex-col gap-2 rounded-tl-2xl border border-neutral-200 bg-white p-2 md:p-10 dark:border-neutral-700 dark:bg-neutral-900">
        <h1 className="text-4xl text-white font-bold">Lost and Found</h1>
        <div className=" w-full h-1/4">
          <input
            type="text"
            placeholder="newLost"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
          />
          <button onClick={addTodo} className="bg-amber-900">
            Add lostFound
          </button>
          <ul className="text-xl">
            {todoList.map((todo) => (
              <li >
                <p>{todo.name}</p>
              <button>{todo.isCompleted ? "Completed task" : "Incomplete task"}</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
