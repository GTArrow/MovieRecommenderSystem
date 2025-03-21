"use client";

export default function HeroSection() {
  return (
    <section
      className="h-[400px] bg-cover bg-center flex items-center justify-center text-white text-center"
      style={{ backgroundImage: "url('/hero-image.jpeg')" }}
    >
      <div className="bg-opacity-50 p-6 rounded-lg">
        <h1 className="text-4xl font-bold">Discover Popular Movies</h1>
        <p className="text-lg mt-2">Browse through the latest trending films</p>
      </div>
    </section>
  );
}
