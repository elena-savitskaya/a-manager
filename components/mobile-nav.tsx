"use client";

import { useState } from "react";
import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { BookOpen, PlusCircle, Dumbbell, Menu, X } from "lucide-react";

import { Logo } from "@/components/logo";

interface MobileNavProps {
  authButton: React.ReactNode;
  themeSwitcher: React.ReactNode;
}

export function MobileNav({ authButton, themeSwitcher }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  const navLinks = [
    { href: "/words", label: "Ваші слова", icon: <BookOpen className="w-5 h-5 text-blue-500" />, color: "bg-blue-500/10" },
    { href: "/add-word", label: "Додати слово", icon: <PlusCircle className="w-5 h-5 text-primary" />, color: "bg-primary/10" },
    { href: "/train", label: "Тренування", icon: <Dumbbell className="w-5 h-5 text-emerald-500" />, color: "bg-emerald-500/10" },
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden relative group">
          <Menu className="h-6 w-6 transition-transform group-hover:scale-110" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[310px] sm:w-[400px] border-none p-0 flex flex-col gap-0 shadow-2xl overflow-hidden ring-1 ring-foreground/5">
        {/* Modern Header */}
        <div className="p-8 pb-6 border-b border-muted/50 bg-muted/20 backdrop-blur-sm">
          <SheetHeader className="text-left space-y-1">
            <SheetTitle className="tracking-tight">
              <Logo size="lg" />
            </SheetTitle>
            <SheetDescription className="text-sm font-medium text-muted-foreground/80 lowercase italic">
              Ваш інтелектуальний словник
            </SheetDescription>
          </SheetHeader>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col gap-10">
          {/* Navigation Links */}
          <div className="flex flex-col gap-3">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 mb-2 px-2">
              Навігація
            </p>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="group"
              >
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/30 hover:bg-muted font-bold transition-all border border-transparent hover:border-foreground/5">
                  <div className={`p-2 rounded-xl ${link.color} transition-transform group-hover:scale-110`}>
                    {link.icon}
                  </div>
                  <span className="text-lg">{link.label}</span>
                </div>
              </Link>
            ))}
          </div>

          {/* Settings Section */}
          <div className="flex flex-col gap-6">
            <div className="space-y-4">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 px-2">
                Налаштування
              </p>
              <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 ring-1 ring-foreground/5">
                <span className="text-base font-bold">Тема</span>
                {themeSwitcher}
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 px-2">
                Акаунт
              </p>
              <div
                onClick={() => setOpen(false)}
                className="p-2 rounded-2xl bg-muted/30 ring-1 ring-foreground/5 overflow-hidden"
              >
                {authButton}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Accent */}
        <div className="h-2 w-full bg-gradient-to-r from-blue-500 via-primary to-emerald-500 opacity-30" />
      </SheetContent>
    </Sheet>
  );
}
