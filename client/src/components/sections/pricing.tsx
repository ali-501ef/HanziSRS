import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Link } from "wouter";

export function Pricing() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "Forever",
      features: [
        "500 characters",
        "Basic SRS algorithm",
        "Progress tracking",
      ],
      buttonText: "Get Started",
      isPrimary: false,
    },
    {
      name: "Pro",
      price: "$9",
      period: "per month",
      features: [
        "2,000+ characters",
        "Advanced SRS algorithm",
        "Audio pronunciation",
        "Detailed analytics",
        "Custom study sets",
      ],
      buttonText: "Start Free Trial",
      isPrimary: true,
      badge: "Most Popular",
    },
  ];

  return (
    <section id="pricing" className="py-20 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Start free, upgrade when you're ready for advanced features.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <div 
              key={plan.name}
              className={`surface p-8 rounded-xl shadow-soft relative ${
                plan.isPrimary ? "border-2 border-primary" : ""
              }`}
              data-testid={`pricing-plan-${index}`}
            >
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary text-white px-4 py-1 rounded-full text-sm font-medium">
                    {plan.badge}
                  </span>
                </div>
              )}
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-semibold mb-2">{plan.name}</h3>
                <div className="text-4xl font-bold mb-2">{plan.price}</div>
                <div className="text-gray-600 dark:text-gray-400">{plan.period}</div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link href="/app">
                <Button
                  className={`w-full ${plan.isPrimary ? "" : "variant-outline"}`}
                  variant={plan.isPrimary ? "default" : "outline"}
                  data-testid={`button-${plan.name.toLowerCase()}-plan`}
                >
                  {plan.buttonText}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
