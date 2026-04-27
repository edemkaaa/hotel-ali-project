"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Phone, Menu, X } from "lucide-react"
import { WhatsAppIcon, TelegramIcon } from "./social-icons"
import { WHATSAPP_URL, TELEGRAM_URL } from "@/lib/contact"

const navLinks = [
  { href: "#rooms", label: "Номера" },
  { href: "#gallery", label: "Галерея" },
  { href: "#amenities", label: "Удобства" },
  { href: "#location", label: "Расположение" },
  { href: "#places", label: "Окрестности" },
  { href: "#contacts", label: "Контакты" },
]

export function Header() {
  const pathname = usePathname()
  const isHome = pathname === "/"
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const showSolid = isScrolled || !isHome

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        showSolid
          ? "bg-white/95 backdrop-blur-md shadow-lg py-3"
          : "bg-transparent py-4 md:py-6"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <a href={isHome ? "#" : "/"} className="group">
          <h1 className={`text-2xl md:text-3xl font-bold tracking-wide transition-colors duration-300 ${
            showSolid ? "text-primary" : "text-white"
          }`}>
            ВОСТОК
          </h1>
          <p className={`text-xs tracking-[0.3em] uppercase transition-colors duration-300 ${
            showSolid ? "text-muted-foreground" : "text-white/80"
          }`}>
            гостевой дом
          </p>
        </a>

        <nav className="hidden lg:flex items-center gap-5 xl:gap-7">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={isHome ? link.href : `/${link.href}`}
              className={`text-sm font-medium tracking-wide uppercase transition-all duration-300 hover:opacity-70 ${
                showSolid ? "text-foreground" : "text-white"
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-1.5">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className={`p-2 rounded-full transition-all hover:scale-110 ${
                showSolid ? "text-emerald-600 hover:bg-emerald-50" : "text-white hover:bg-white/15"
              }`}
            >
              <WhatsAppIcon className="h-4 w-4" />
            </a>
            <a
              href={TELEGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Telegram"
              className={`p-2 rounded-full transition-all hover:scale-110 ${
                showSolid ? "text-sky-600 hover:bg-sky-50" : "text-white hover:bg-white/15"
              }`}
            >
              <TelegramIcon className="h-4 w-4" />
            </a>
            <a
              href="tel:+79788898921"
              className={`hidden xl:flex items-center gap-2 text-sm font-medium transition-colors duration-300 ml-1 ${
                showSolid ? "text-primary" : "text-white"
              }`}
            >
              <Phone className="h-4 w-4" />
              <span>+7 (978) 889-89-21</span>
            </a>
          </div>
          
          <Button 
            asChild
            className={`hidden sm:inline-flex transition-all duration-300 rounded-full px-6 ${
              showSolid
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "bg-white text-primary hover:bg-white/90"
            }`}
          >
            <a href={isHome ? "#booking" : "/#booking"}>Забронировать</a>
          </Button>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`lg:hidden p-2 transition-colors ${
              showSolid ? "text-foreground" : "text-white"
            }`}
            aria-label="Меню"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white shadow-xl animate-in slide-in-from-top-2 duration-200">
          <nav className="container mx-auto px-4 py-6 flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={isHome ? link.href : `/${link.href}`}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-foreground text-lg font-medium py-2 border-b border-border/50"
              >
                {link.label}
              </a>
            ))}
            <a 
              href="tel:+79788898921" 
              className="flex items-center gap-2 text-primary font-medium py-2"
            >
              <Phone className="h-5 w-5" />
              <span>+7 (978) 889-89-21</span>
            </a>
            <Button asChild className="mt-2 rounded-full">
              <a href={isHome ? "#booking" : "/#booking"} onClick={() => setIsMobileMenuOpen(false)}>Забронировать</a>
            </Button>
          </nav>
        </div>
      )}
    </header>
  )
}
