import Image from "next/image";
import { AppContainer } from "@/components/common/app-container";
import { Reveal } from "@/components/motion/reveal";

export default function DemoAlZahraPage() {
  return (
    <div className="bg-black text-white min-h-screen font-sans selection:bg-brand-green selection:text-white">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col justify-end pb-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/al-zahra/hero.jpg"
            alt="Zoom Al-Zahra Hero"
            fill
            className="object-cover object-center opacity-70"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        </div>
        
        <AppContainer className="relative z-10">
          <Reveal className="max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              Zoom Al-Zahra
            </h1>
            <p className="text-lg md:text-2xl text-gray-300 max-w-2xl leading-relaxed">
              Experience the pinnacle of luxurious living. A masterpiece of modern architecture designed for the future of real estate.
            </p>
          </Reveal>
        </AppContainer>
      </section>

      {/* Feature Section 1 */}
      <section className="py-24 bg-gradient-to-b from-black to-[#0a0a0a]">
        <AppContainer>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <Reveal direction="up" className="order-2 md:order-1">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-brand-green-light">
                Smart Home OS. <br />
                <span className="text-white">Seamless Living.</span>
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-8">
                Every apartment in Zoom Al-Zahra is equipped with state-of-the-art smart home technology. Control lighting, climate, and security with a single touch. The future of living is here.
              </p>
              <ul className="space-y-4">
                {['Automated Climate Control', 'Integrated Security Systems', 'Voice Activated Ambient Lighting'].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-300 font-medium">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-brand-green/20 text-brand-green">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal direction="down" className="order-1 md:order-2">
              <div className="relative rounded-2xl overflow-hidden aspect-[4/5] md:aspect-square border border-gray-800 shadow-2xl shadow-brand-green/10">
                <Image
                  src="/images/al-zahra/interior.jpg"
                  alt="Luxurious Interior"
                  fill
                  className="object-cover"
                />
              </div>
            </Reveal>
          </div>
        </AppContainer>
      </section>

      {/* Feature Section 2 (Full Width Image) */}
      <section className="relative py-32 flex items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/al-zahra/amenities.jpg"
            alt="Rooftop Amenities"
            fill
            className="object-cover opacity-50 scale-105 transition-transform duration-1000 hover:scale-100"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>
        
        <AppContainer className="relative z-10">
          <Reveal>
            <h2 className="text-4xl md:text-6xl font-bold mb-6">Exclusive Rooftop Oasis</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10">
              Unwind in our infinity pool overlooking the city skyline. A private retreat designed exclusively for the residents of Zoom Al-Zahra.
            </p>
            <button className="bg-brand-green hover:bg-brand-green-light text-white font-bold py-4 px-10 rounded-full transition-colors duration-300 text-lg shadow-[0_0_20px_rgba(75,128,45,0.4)]">
              Discover Amenities
            </button>
          </Reveal>
        </AppContainer>
      </section>
      
      {/* Specs Section */}
      <section className="py-24 bg-[#050505]">
        <AppContainer>
          <Reveal className="text-center mb-16">
             <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500">
               Engineered for Excellence
             </h2>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {[
              { label: "Completion", value: "2027" },
              { label: "Apartments", value: "48" },
              { label: "Parking", value: "Multi-level" },
              { label: "Security", value: "24/7 AI" },
            ].map((stat, i) => (
              <div key={i} className="p-8 rounded-2xl bg-gradient-to-br from-gray-900 to-black border border-gray-800 text-center hover:border-brand-green/50 transition-colors group cursor-default">
                <div className="text-3xl md:text-4xl font-extrabold text-white mb-2 group-hover:scale-110 transition-transform">{stat.value}</div>
                <div className="text-sm uppercase tracking-widest text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </AppContainer>
      </section>
    </div>
  );
}
