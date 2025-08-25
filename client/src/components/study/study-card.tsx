import * as React from "react";
import { Button } from "@/components/ui/button";

interface StudyCardProps {
  character: string;
  pinyin: string;
  meaning: string;
  mnemonic?: string;
}

export function StudyCard({ character, pinyin, meaning, mnemonic }: StudyCardProps) {
  const [isFlipped, setIsFlipped] = React.useState(false);

  const flipCard = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="card-flip mx-auto max-w-lg" data-testid="study-card">
      <div className={`card-flip-inner ${isFlipped ? "transform rotateY-180" : ""}`}>
        {/* Card Front */}
        <div className="card-flip-front surface p-12 shadow-soft h-80 flex flex-col justify-center items-center">
          <div className="text-8xl mb-6 text-primary" data-testid="text-character">
            {character}
          </div>
          <div className="text-lg text-gray-600 dark:text-gray-400" data-testid="text-pinyin">
            {pinyin}
          </div>
          <Button
            variant="ghost"
            className="mt-6 text-sm text-primary hover:text-primary-dark"
            onClick={flipCard}
            data-testid="button-show-meaning"
          >
            Show meaning
          </Button>
        </div>

        {/* Card Back */}
        <div className="card-flip-back surface p-12 shadow-soft h-80 flex flex-col justify-center items-center">
          <div className="text-2xl font-semibold mb-4" data-testid="text-meaning">
            {meaning}
          </div>
          {mnemonic && (
            <div className="text-gray-600 dark:text-gray-400 text-center mb-6" data-testid="text-mnemonic">
              "{mnemonic}"
            </div>
          )}
          <Button
            variant="ghost"
            className="text-sm text-primary hover:text-primary-dark"
            onClick={flipCard}
            data-testid="button-show-character"
          >
            Show character
          </Button>
        </div>
      </div>
    </div>
  );
}
