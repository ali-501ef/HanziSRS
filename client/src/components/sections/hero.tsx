import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export function Hero() {
  const previewCards = [
    { character: "学", meaning: "Learn" },
    { character: "书", meaning: "Book" },
    { character: "水", meaning: "Water" },
    { character: "人", meaning: "Person" },
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative overflow-hidden gradient-hero pb-16 pt-24 md:pt-32">
      <div className="pointer-events-none absolute inset-0 bg-grid"></div>
      <div className="container mx-auto px-4 relative">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight leading-tight animate-fade-in">
            Learn <span className="text-primary">Hanzi</span> faster with<br className="hidden md:block"/>
            vivid mnemonics & premium SRS.
          </h1>
          <p className="mt-5 text-lg text-gray-600 dark:text-gray-400 animate-fade-in [animation-delay:0.1s]">
            A focused, Stripe‑level polished experience for mastering 2,000+ characters — with integrated context and audio.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 animate-fade-in [animation-delay:0.2s]">
            <Link href="/app">
              <Button size="lg" className="px-8 py-4" data-testid="button-start-free-trial">
                Start free trial
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="lg" 
              className="px-8 py-4"
              onClick={() => scrollToSection("features")}
              data-testid="button-see-how-it-works"
            >
              See how it works
            </Button>
          </div>
        </div>

        {/* Character Cards Preview */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 opacity-90">
          {previewCards.map((card, index) => (
            <div 
              key={card.character}
              className="surface p-6 rounded-xl shadow-soft animate-fade-in" 
              style={{ animationDelay: `${0.3 + index * 0.1}s` }}
              data-testid={`card-preview-${index}`}
            >
              <div className="text-4xl text-center mb-2">{card.character}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 text-center">{card.meaning}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
