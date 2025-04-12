import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Play } from "lucide-react";

interface DemoVideo {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
}

const defaultVideos: DemoVideo[] = [
  {
    id: "1",
    title: "New Combat System",
    description: "Experience our revolutionary new combat mechanics",
    thumbnailUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e",
    videoUrl: "https://www.youtube.com/watch?v=example1",
  },
  {
    id: "2",
    title: "Multiplayer Features",
    description: "Team up with friends in our new multiplayer modes",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1511512578047-dfb367046420",
    videoUrl: "https://www.youtube.com/watch?v=example2",
  },
];

export default function FeaturedContent() {
  return (
    <section className="w-full bg-gray-900 p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Feature Showcase</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {defaultVideos.map((video) => (
          <Card
            key={video.id}
            className="bg-gray-800 text-white border-gray-700 overflow-hidden group hover:border-[#FFB800] transition-all"
          >
            <div className="relative aspect-video">
              <img
                src={video.thumbnailUrl}
                alt={video.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="lg"
                  className="bg-[#FFB800] hover:bg-[#FFB800]/90 text-black"
                >
                  <Play className="w-6 h-6 mr-2" />
                  Watch Demo
                </Button>
              </div>
            </div>
            <CardHeader>
              <CardTitle>{video.title}</CardTitle>
              <CardDescription className="text-gray-400">
                {video.description}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  );
}
