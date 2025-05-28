"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import clsx from "clsx";
import { Menu } from "@/components/icons/Menu";
import { Drawer } from "@/components/Drawer";
import { Close } from "@/components/icons/Close";

export function Header() {
  const pathname = usePathname();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const navItems = [
    { path: "/", label: "Главная" },
    { path: "/about", label: "От автора" },
    { path: "/lists", label: "Списки убитых" },
    { path: "/abreviations", label: "Список сокращений" },
    { path: "/contact", label: "Оставьте сообщение" },
  ];

  function isActivePath(path: string) {
    // Exact match
    if (pathname === path) return true;
    // Check for nested routes
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  }

  return (
    <header className="flex border-b h-[var(--app-header-height)] fixed left-0 right-0 top-0 bg-layer z-50 overflow-x-auto overflow-y-hidden">
      <div className="page-container hidden sm:block">
        <nav className="h-full">
          <ul className="flex gap-x-5 h-full">
            {navItems.map((item) => (
              <li
                key={item.path}
                className="flex items-center max-sm:flex-1 max-sm:justify-center h-full"
              >
                <Link
                  href={item.path}
                  className={clsx(
                    "relative flex items-center text-center text-text-secondary hover:text-foreground text-sm whitespace-nowrap h-full font-semibold",
                    {
                      "!text-foreground": isActivePath(item.path),
                    }
                  )}
                >
                  {item.label}

                  {/* active indicator */}
                  {isActivePath(item.path) && (
                    <motion.div
                      className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-foreground"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="sm:hidden flex items-center">
        <button
          className="px-4"
          aria-label="toggle drawer"
          onClick={() => setIsDrawerOpen((open) => !open)}
        >
          {isDrawerOpen ? <Close /> : <Menu />}
        </button>
        <Link href="/">
          <h1 className="font-secondary font-semibold text-foreground">
            Казни женщин в России
          </h1>
        </Link>
      </div>

      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
        <nav className="p-4">
          <ul>
            {navItems.map((item) => (
              <li key={item.path} className="flex">
                <Link
                  href={item.path}
                  className={clsx(
                    "text-text-secondary hover:text-foreground text-sm whitespace-nowrap font-semibold py-2 w-full",
                    {
                      "!text-foreground": isActivePath(item.path),
                    }
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Drawer>
    </header>
  );
}
