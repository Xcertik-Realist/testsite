export default function Hero() {
  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDp1KEDEkZurCj3TOLT58eqtU7BAeWoJWr-rM6KzqGHho-9Au3VjLl24DOuEwIU1A2abJSWh4roA_HNmdYPNuzG9Gy26qan3tiBsoiP9BIPZa21_Y7msohuWLeaZWXjy3qNDwM_6SBX-NfEYYgzYb745mPEOq8iMyBd6k1s630ZnycXT2Tip1WWOo2rZ-MYUI4BBe8AJ-0inzr19mwFP5anJb9OI5fg8Q9FFEY_q-5IbkZ3CtZJMpovQraSBi0DYmP__PA3dij3')" }}
      />
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative text-center text-white max-w-4xl px-6">
        <h1 className="text-5xl md:text-7xl font-black mb-6">
          The Perfect Centrepiece for Your Christmas
        </h1>
        <p className="text-xl mb-8">Sustainably-grown, premium Scandinavian firs delivered to your door.</p>
        <div className="inline-block bg-red-700 text-white px-8 py-3 rounded-full font-bold">
          Shipping Starts December 1st
        </div>
      </div>
    </section>
  );
}
