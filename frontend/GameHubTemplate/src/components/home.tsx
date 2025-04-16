import React, { useState } from "react";
import Sidebar from "./layout/Sidebar.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.tsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { Apple, PlayCircle, Gamepad2 } from "lucide-react";
import DailyRewards from "./rewards/DailyRewards.tsx";
import Profile from "@/components/profile.tsx";

interface NewsItem {
  id: string;
  title: string;
  date: string;
  category: string;
  thumbnail: string;
}

interface EventItem {
  id: string;
  title: string;
  date: string;
  type: string;
}

interface StoreItem {
  id: string;
  name: string;
  image: string;
}

const defaultNews: NewsItem[] = [
  {
    id: "1",
    title: "New Season Launch",
    date: "2024-02-20",
    category: "UPDATES",
    thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e",
  },
  {
    id: "2",
    title: "Weekend Tournament",
    date: "2024-02-22",
    category: "EVENTS",
    thumbnail: "https://images.unsplash.com/photo-1511512578047-dfb367046420",
  },
];

const defaultEvents: EventItem[] = [
  {
    id: "1",
    title: "Spring Championship",
    date: "2024-03-15",
    type: "Tournament",
  },
  {
    id: "2",
    title: "Double XP Weekend",
    date: "2024-03-01",
    type: "Special Event",
  },
];

const defaultStoreItems: StoreItem[] = [
  {
    id: "1",
    name: "Game 1",
    image: "https://images.unsplash.com/photo-1611996575749-79a3a250f948",
  },
  {
    id: "2",
    name: "Premium Bundle",
    image: "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf",
  },
];
function addGames() {
  // getGames //


  // add to defaultStoreItems //

  // defaultStoreItems.push({
  //
  // })
}

export default function Home() {
  const [activeSection, setActiveSection] = useState<"home" | "rewards" | "store" | "profile">(
    "home",
  );

  const handleMenuClick = (menuItem: string) => {
    if (menuItem === "rewards") {
      setActiveSection("rewards");
    } else if (menuItem === "home") {
      setActiveSection("home");
    } else if (menuItem === "home") {
      setActiveSection("store");
    } else if (menuItem === "profile") {
      setActiveSection("profile");
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-900">

      <div className="h-full fixed">
        <Sidebar activeItem={activeSection} onMenuClick={handleMenuClick} />
      </div>

      <div className="ml-80 w-full">

        <main className="flex-1 p-6">
          {activeSection === "home" ? (
              <>
                {/* Hero Section */}
                <section className="relative h-[400px] rounded-lg overflow-hidden mb-8">
                  <img
                      src="https://images.unsplash.com/photo-1542751371-adc38448a05e"
                      alt="Hero Banner"
                      className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-8">
                    <h1 className="text-4xl font-bold text-white mb-4">Welcome to Z-Play</h1>
                    <p className="text-lg text-white/90 mb-6">
                      A Z-Play for every player to engage more fun
                    </p>
                    <div className="flex gap-4">
                      <Button className="bg-[#FFB800] hover:bg-[#FFB800]/90 text-black">
                        <Apple className="mr-2 h-5 w-5" />
                        Sign Up
                      </Button>
                      <Button className="hover:bg-[#FFB800]/90 text-black">
                        <PlayCircle className="mr-2 h-5 w-5" />
                        View Games
                      </Button>
                    </div>
                  </div>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
                  <div className="space-y-8">
                    {/* Featured Content */}
                    <section>
                      <h2 className="text-2xl font-bold text-white mb-6">Most Popular</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {defaultStoreItems.map((item) => (
                            <Card key={item.id} className="bg-gray-800 text-white border-gray-700">
                              <CardHeader>
                                <CardTitle>{item.name}</CardTitle>
                                <CardDescription className="text-gray-400">
                                  <Button className="bg-[#FFB800] hover:bg-[#FFB800]/90 text-black">
                                    <Gamepad2 className="mr-2 h-5 w-5" />
                                    Play
                                  </Button>
                                </CardDescription>
                              </CardHeader>
                              <CardContent>
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-48 object-cover rounded-lg"
                                />
                              </CardContent>
                            </Card>
                        ))}
                      </div>
                    </section>

                    {/* News Feed */}
                    <section>
                      <Tabs defaultValue="ALL" className="w-full">
                        <TabsList className="bg-gray-800 w-full justify-start">
                          {["ALL", "UPDATES", "EVENTS", "OTHER"].map((tab) => (
                              <TabsTrigger
                                  key={tab}
                                  value={tab}
                                  className="text-white data-[state=active]:bg-gray-700"
                              >
                                {tab}
                              </TabsTrigger>
                          ))}
                        </TabsList>
                        {["ALL", "UPDATES", "EVENTS", "OTHER"].map((tab) => (
                            <TabsContent key={tab} value={tab} className="mt-6">
                              <div className="grid gap-6">
                                {defaultNews
                                    .filter((news) => tab === "ALL" || news.category === tab)
                                    .map((news) => (
                                        <Card key={news.id} className="bg-gray-800 text-white border-gray-700">
                                          <CardHeader>
                                            <div className="flex justify-between items-start">
                                              <div>
                                                <CardTitle>{news.title}</CardTitle>
                                                <CardDescription className="text-gray-400">
                                                  {news.date}
                                                </CardDescription>
                                              </div>
                                              <span className="text-sm text-[#FFB800]">{news.category}</span>
                                            </div>
                                          </CardHeader>
                                          <CardContent>
                                            <img
                                                src={news.thumbnail}
                                                alt={news.title}
                                                className="w-full h-48 object-cover rounded-lg"
                                            />
                                          </CardContent>
                                        </Card>
                                    ))}
                              </div>
                            </TabsContent>
                        ))}
                      </Tabs>
                    </section>
                  </div>

                  {/* Right Sidebar */}
                  <aside className="space-y-6">
                    <h2 className="text-2xl font-bold text-white">Upcoming Events</h2>
                    {defaultEvents.map((event) => (
                        <Card key={event.id} className="bg-gray-800 text-white border-gray-700">
                          <CardHeader>
                            <CardTitle className="text-lg">{event.title}</CardTitle>
                            <CardDescription className="text-gray-400">
                              {event.date} • {event.type}
                            </CardDescription>
                          </CardHeader>
                        </Card>
                    ))}
                  </aside>
                </div>
              </>
          ) : activeSection === "rewards" ? (
              <DailyRewards />
          ) : activeSection === "profile" ? (
              <Profile />
          ) : null}
        </main>
      </div>
    </div>
  );
}

