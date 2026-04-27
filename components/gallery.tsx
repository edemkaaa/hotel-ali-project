"use client"

import Image from "next/image"

const items = [
  {
    src: "/images/exterior.jpg",
    alt: "Гостевой дом «Восток» — фасад",
    title: "Гостевой дом",
    className: "md:col-span-2 md:row-span-2 aspect-[4/3] md:aspect-auto",
  },
  {
    src: "/images/besedki.jpg",
    alt: "Беседки и мангальная зона",
    title: "Беседки и мангал",
    className: "aspect-[4/3]",
  },
  {
    src: "/images/lobby.jpg",
    alt: "Холл и ресепшн",
    title: "Холл",
    className: "aspect-[4/3]",
  },
  {
    src: "/images/hero.jpg",
    alt: "Вид на горы и посёлок Курортное",
    title: "Виды вокруг",
    className: "aspect-[4/3]",
  },
  {
    src: "/images/lobby-2.jpg",
    alt: "Зона ресепшн",
    title: "Ресепшн",
    className: "aspect-[4/3]",
  },
]

export function Gallery() {
  return (
    <section id="gallery" className="pt-8 pb-12 md:pt-10 md:pb-12 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 md:mb-16">
          <span className="text-primary text-sm font-medium tracking-wider uppercase">Атмосфера</span>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mt-3 mb-4">
            Территория и интерьеры
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Тихий двор, беседки с мангалом и виды на крымские горы — всё для спокойного отдыха
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
          {items.map((item) => (
            <div
              key={item.src}
              className={`group relative overflow-hidden rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 ${item.className}`}
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-4 left-4 right-4">
                <span className="text-white font-semibold text-sm md:text-base drop-shadow-lg">
                  {item.title}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
