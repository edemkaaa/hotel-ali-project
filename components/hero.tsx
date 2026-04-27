"use client"

import { Button } from "@/components/ui/button"
import { ChevronDown, Heart, MapPin, Sun, Waves } from "lucide-react"
import Image from "next/image"

export function Hero() {
  return (
    <section className="relative h-screen min-h-[560px] sm:min-h-[640px] md:min-h-[700px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero.jpg"
          alt="Гостевой дом Восток"
          fill
          className="object-cover"
          priority
          style={{ filter: "saturate(1.45) contrast(1.08)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/35 to-black/45" />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Content */}
      <div
        className="relative z-10 container mx-auto px-4 text-center text-white"
        style={{ textShadow: "0 4px 24px rgba(0,0,0,0.85), 0 2px 8px rgba(0,0,0,0.7), 0 1px 2px rgba(0,0,0,0.6)" }}
      >
        <div className="animate-fade-in">
          <p className="text-xs sm:text-sm md:text-base tracking-[0.25em] sm:tracking-[0.4em] uppercase mb-4 text-white/70">
            Крым, Феодосия, Курортное
          </p>
        </div>
        
        <h1 className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <span className="block text-6xl sm:text-7xl md:text-7xl lg:text-8xl font-bold tracking-wider mb-2">
            ВОСТОК
          </span>
          <span className="block text-base sm:text-2xl md:text-3xl font-light tracking-[0.15em] sm:tracking-[0.2em] text-white/70">
            гостевой дом у моря
          </span>
        </h1>

        <p className="animate-fade-in mt-6 md:mt-8 text-sm sm:text-base md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed" style={{ animationDelay: '0.4s' }}>
          Спокойный семейный отдых на берегу Чёрного моря. Галечный пляж в 10 минутах,
          уютные номера и тёплая домашняя атмосфера — всё для размеренного отпуска
        </p>

        {/* Features */}
        <div className="animate-fade-in flex flex-wrap justify-center gap-x-5 gap-y-3 md:gap-10 mt-8 md:mt-10" style={{ animationDelay: '0.6s' }}>
          <div className="flex items-center gap-2 text-white/90">
            <Waves className="h-5 w-5 text-accent" />
            <span className="text-sm md:text-base">10 мин до пляжа</span>
          </div>
          <div className="flex items-center gap-2 text-white/90">
            <Heart className="h-5 w-5 text-accent" />
            <span className="text-sm md:text-base">Семейный отдых</span>
          </div>
          <div className="flex items-center gap-2 text-white/90">
            <Sun className="h-5 w-5 text-accent" />
            <span className="text-sm md:text-base">29 номеров</span>
          </div>
          <div className="flex items-center gap-2 text-white/90">
            <MapPin className="h-5 w-5 text-accent" />
            <span className="text-sm md:text-base">п. Курортное</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div
          className="animate-fade-in flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mt-10 md:mt-12 px-2"
          style={{ animationDelay: '0.8s', textShadow: 'none' }}
        >
          <Button
            asChild
            size="lg"
            className="bg-white text-primary hover:bg-white/90 text-sm sm:text-base px-6 sm:px-8 py-5 sm:py-6 rounded-full shadow-xl"
          >
            <a href="#booking">Забронировать номер</a>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-white/50 text-white bg-white/10 hover:bg-white/20 hover:text-white text-sm sm:text-base px-6 sm:px-8 py-5 sm:py-6 rounded-full backdrop-blur-sm"
          >
            <a href="#rooms">Смотреть номера</a>
          </Button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <a href="#rooms" className="text-white/70 hover:text-white transition-colors">
          <ChevronDown className="h-8 w-8" />
        </a>
      </div>

      {/* Decorative gradient at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  )
}
