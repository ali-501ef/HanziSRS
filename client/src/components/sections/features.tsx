import { Brain, Palette, TrendingUp } from "lucide-react";

export function Features() {
  const features = [
    {
      icon: Brain,
      title: "Smart Algorithm",
      description: "Advanced spaced repetition algorithm that adapts to your learning pace for maximum retention.",
    },
    {
      icon: Palette,
      title: "Premium Design",
      description: "Beautiful, distraction-free interface with smooth animations and thoughtful micro-interactions.",
    },
    {
      icon: TrendingUp,
      title: "Progress Tracking",
      description: "Detailed analytics and insights to keep you motivated and on track with your learning goals.",
    },
  ];

  return (
    <section id="features" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">Why Choose Hanzi SRS?</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Built with modern learning science and premium user experience design.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={feature.title}
              className="surface p-8 rounded-xl shadow-soft text-center animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
              data-testid={`feature-${index}`}
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <feature.icon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
