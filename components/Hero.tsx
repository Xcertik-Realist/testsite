export default function Hero() {
  return (
    <section className="relative h-screen flex items-center justify-center bg-cover bg-center" style={{backgroundImage: "url('https://images.unsplash.com/photo-1543589077-47a9392b6c3f?q=80&w=2070')"}}>
      <div className="absolute inset-0 bg-black/50"></div>
      <div className="relative text-center text-white z-10 px-6">
        <h1 className="text-5xl md:text-7xl font-black mb-6">Real Christmas Trees<br/>Delivered Fresh</h1>
        <p className="text-2xl mb-8">Premium Nordmann Firs • From 1st December</p>
      </div>
    </section>
  );
}
