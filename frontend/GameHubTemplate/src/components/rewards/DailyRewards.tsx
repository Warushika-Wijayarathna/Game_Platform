import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Gift, Star } from "lucide-react";
import { cn } from "@/lib/utils.ts";

interface Reward {
  id: number;
  day: number;
  type: "gift" | "points";
  value: string | number;
  claimed: boolean;
}

const defaultRewards: Reward[] = [
  { id: 1, day: 1, type: "gift", value: "Starter Pack", claimed: true },
  { id: 2, day: 2, type: "points", value: 100, claimed: true },
  { id: 3, day: 3, type: "gift", value: "Mystery Box", claimed: false },
  { id: 4, day: 4, type: "points", value: 200, claimed: false },
  { id: 5, day: 5, type: "gift", value: "Premium Skin", claimed: false },
  { id: 6, day: 6, type: "points", value: 500, claimed: false },
  { id: 7, day: 7, type: "gift", value: "Legendary Crate", claimed: false },
];

export default function DailyRewards() {
  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-gray-900">
      <h1 className="text-3xl font-bold text-white mb-6">Daily Rewards</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {defaultRewards.map((reward) => (
          <Card
            key={reward.id}
            className={cn(
              "bg-gray-800 border-gray-700",
              reward.claimed && "opacity-60",
            )}
          >
            <CardHeader>
              <CardTitle className="text-lg text-[#2d50d5]">
                Day {reward.day}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center">
                {reward.type === "gift" ? (
                  <Gift className="w-8 h-8 text-[#FFB800]" />
                ) : (
                  <Star className="w-8 h-8 text-[#FFB800]" />
                )}
              </div>
              <div className="text-center">
                <p className="text-white font-medium">
                  {reward.type === "points" ? (
                    <span>{reward.value} Points</span>
                  ) : (
                    <span>{reward.value}</span>
                  )}
                </p>
              </div>
              <Button
                className={cn(
                  "w-full",
                  !reward.claimed
                    ? "bg-[#FFB800] hover:bg-[#FFB800]/90 text-black"
                    : "bg-gray-700 text-gray-400 cursor-not-allowed",
                )}
                disabled={reward.claimed}
              >
                {reward.claimed ? "Claimed" : "Claim"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
