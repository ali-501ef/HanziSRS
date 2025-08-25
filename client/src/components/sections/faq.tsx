import * as React from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

export function FAQ() {
  const faqs = [
    {
      question: "What is spaced repetition?",
      answer: "Spaced repetition is a learning technique that involves reviewing information at increasing intervals to maximize long-term retention.",
    },
    {
      question: "How many characters can I learn?",
      answer: "The free plan includes 500 characters, while the Pro plan includes over 2,000 carefully selected characters for comprehensive learning.",
    },
    {
      question: "Is there a mobile app?",
      answer: "Yes! Our web app is fully responsive and works great on mobile devices. Native apps for iOS and Android are coming soon.",
    },
    {
      question: "Can I cancel anytime?",
      answer: "Absolutely! You can cancel your subscription at any time. Your access will continue until the end of your billing period.",
    },
  ];

  const [openItems, setOpenItems] = React.useState<Set<number>>(new Set());

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <section id="faq" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">Frequently Asked Questions</h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <Collapsible
              key={index}
              open={openItems.has(index)}
              onOpenChange={() => toggleItem(index)}
            >
              <CollapsibleTrigger 
                className="surface p-6 rounded-xl shadow-soft w-full text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                data-testid={`faq-trigger-${index}`}
              >
                <h3 className="font-semibold">{faq.question}</h3>
                <ChevronDown 
                  className={`h-5 w-5 transition-transform ${
                    openItems.has(index) ? "rotate-180" : ""
                  }`} 
                />
              </CollapsibleTrigger>
              <CollapsibleContent className="px-6 pb-4">
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  {faq.answer}
                </p>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </div>
    </section>
  );
}
