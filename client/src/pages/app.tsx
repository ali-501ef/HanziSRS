import * as React from "react";
import { Header } from "@/components/layout/header";
import { StudyCard } from "@/components/study/study-card";
import { ProgressBar } from "@/components/study/progress-bar";
import { StatsDashboard } from "@/components/study/stats-dashboard";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { type StudyCard as StudyCardType, type StudyResult, type UserStats } from "@shared/schema";
import { X, Minus, Check } from "lucide-react";

export default function App() {
  const { toast } = useToast();
  const [userId, setUserId] = React.useState<string | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = React.useState(0);
  const [studyResults, setStudyResults] = React.useState<StudyResult[]>([]);
  const [sessionStartTime, setSessionStartTime] = React.useState<number>(Date.now());

  // Create demo user on mount
  React.useEffect(() => {
    const createDemoUser = async () => {
      try {
        const response = await fetch("/api/demo-user", { method: "POST" });
        const data = await response.json();
        setUserId(data.userId);
      } catch (error) {
        console.error("Failed to create demo user:", error);
        toast({
          title: "Error",
          description: "Failed to initialize demo user",
          variant: "destructive",
        });
      }
    };

    createDemoUser();
  }, [toast]);

  // Fetch due cards
  const { data: dueCards, isLoading: loadingCards } = useQuery({
    queryKey: ["/api/study/due"],
    queryFn: async () => {
      if (!userId) return [];
      const response = await fetch(`/api/study/due?userId=${userId}`);
      return response.json();
    },
    enabled: !!userId,
  });

  // Fetch user stats
  const { data: stats, isLoading: loadingStats } = useQuery({
    queryKey: ["/api/stats", userId],
    queryFn: async () => {
      if (!userId) return null;
      const response = await fetch(`/api/stats/${userId}`);
      return response.json();
    },
    enabled: !!userId,
  });

  // Submit study results
  const submitResults = useMutation({
    mutationFn: async (results: StudyResult[]) => {
      const response = await fetch("/api/study/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, results }),
      });
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Study Session Complete!",
        description: `You got ${data.correctAnswers} out of ${data.totalCards} cards correct.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/study/due"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats", userId] });
      setCurrentCardIndex(0);
      setStudyResults([]);
      setSessionStartTime(Date.now());
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit study results",
        variant: "destructive",
      });
    },
  });

  const handleAnswer = (difficulty: "easy" | "medium" | "hard") => {
    if (!dueCards || currentCardIndex >= dueCards.length) return;

    const currentCard = dueCards[currentCardIndex];
    const responseTime = Date.now() - sessionStartTime;

    const result: StudyResult = {
      characterId: currentCard.characterId,
      difficulty,
      responseTime,
    };

    const newResults = [...studyResults, result];
    setStudyResults(newResults);

    if (currentCardIndex < dueCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setSessionStartTime(Date.now());
    } else {
      // Session complete, submit results
      submitResults.mutate(newResults);
    }
  };

  const currentCard = dueCards?.[currentCardIndex];
  const totalCards = dueCards?.length || 0;
  const progress = totalCards > 0 ? ((currentCardIndex) / totalCards) * 100 : 0;

  if (loadingCards || loadingStats || !userId) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading study session...</p>
        </div>
      </div>
    );
  }

  if (!dueCards || dueCards.length === 0) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-800">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="text-6xl mb-6">🎉</div>
            <h1 className="text-3xl font-semibold mb-4">All caught up!</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              You've completed all your due reviews for today. Come back later for more practice!
            </p>
            {stats && <StatsDashboard stats={stats} />}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-800">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-3xl md:text-4xl font-semibold mb-4">Study Session</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Review characters with spaced repetition for optimal learning.
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <ProgressBar 
              current={currentCardIndex + 1} 
              total={totalCards} 
              progress={progress}
            />
          </div>

          {/* Study Card */}
          {currentCard && (
            <div className="mb-8">
              <StudyCard
                character={currentCard.character.character}
                pinyin={currentCard.character.pinyin}
                meaning={currentCard.character.meaning}
                mnemonic={currentCard.character.mnemonic}
              />
            </div>
          )}

          {/* Study Actions */}
          <div className="flex justify-center gap-4 mb-12">
            <Button
              onClick={() => handleAnswer("hard")}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 font-medium flex items-center gap-2"
              disabled={submitResults.isPending}
              data-testid="button-hard"
            >
              <X className="h-4 w-4" />
              Hard
            </Button>
            <Button
              onClick={() => handleAnswer("medium")}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 font-medium flex items-center gap-2"
              disabled={submitResults.isPending}
              data-testid="button-medium"
            >
              <Minus className="h-4 w-4" />
              Medium
            </Button>
            <Button
              onClick={() => handleAnswer("easy")}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 font-medium flex items-center gap-2"
              disabled={submitResults.isPending}
              data-testid="button-easy"
            >
              <Check className="h-4 w-4" />
              Easy
            </Button>
          </div>

          {/* Stats Dashboard */}
          {stats && <StatsDashboard stats={stats} />}
        </div>
      </div>
    </div>
  );
}
