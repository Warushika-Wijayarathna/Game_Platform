import React from "react";
import Sidebar from "./layout/Sidebar.tsx";
import { Button } from "@/components/ui/button.tsx";

import { useNavigate } from "react-router-dom";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { ShoppingCart } from "lucide-react";

interface StoreItem {
  id: string;
  name: string;
  description: string;
  image: string;
  category: "Crates" | "Bundles" | "Currency" | "Items";
}

const storeItems: StoreItem[] = [
  {
    id: "1",
    name: "Legendary Crate",
    description: "Contains rare and legendary items with increased drop rates",
    image: "data:image/jpeg;base64,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",
    category: "Crates",
  },
  {
    id: "2",
    name: "Season Pass Bundle",
    description: "Get the premium battle pass plus 25 tier skips",
    image: "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf",
    category: "Bundles",
  },
  {
    id: "3",
    name: "5000 Coins",
    description: "Premium in-game currency for purchasing exclusive items",
    image: "https://images.unsplash.com/photo-1607344645866-009c320b63e4",
    category: "Currency",
  },
  {
    id: "4",
    name: "Starter Pack",
    description:
        "Perfect for new players - includes essential items and boosts",
    image: "https://images.unsplash.com/photo-1605870445919-838d190e8e1b",
    category: "Bundles",
  },
  {
    id: "5",
    name: "Elite Weapon Skin",
    description: "Exclusive animated weapon skin with special effects",
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420",
    category: "Items",
  },
  {
    id: "6",
    name: "Mystery Box",
    description: "Try your luck with this mysterious container",
    image: "https://images.unsplash.com/photo-1611996575749-79a3a250f948",
    category: "Crates",
  },
  {
    id: "7",
    name: "Mystery Box",
    description: "Try your luck with this mysterious container",
    image: "https://images.unsplash.com/photo-1611996575749-79a3a250f948",
    category: "Crates",
  },
];

export default function Store() {

  const navigate = useNavigate();

  const categories = Array.from(
      new Set(storeItems.map((item) => item.category)),
  );

  const handlePlayClick = (item: StoreItem) => {
    navigate("/playGame", { state: { item } });
  };

  return (
      <div className="min-h-screen flex bg-gray-900">
        <div className="h-full fixed">
          <Sidebar activeItem="store" />
        </div>
        <div className="ml-80">
          <main className="flex-1 p-2">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-3xl font-bold text-white mb-8">Store</h1>
              {categories.map((category) => (
                  <div key={category} className="mb-12">
                    <h2 className="text-2xl font-bold text-white mb-6">{category}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                      {storeItems
                          .filter((item) => item.category === category)
                          .map((item) => (
                              <Card
                                  key={item.id}
                                  className="bg-gray-800 text-white border-gray-700 overflow-hidden hover:border-[#FFB800] transition-colors"
                              >
                                <div className="aspect-video relative overflow-hidden">
                                  <img
                                      src={item.image}
                                      alt={item.name}
                                      className="absolute inset-0 w-full h-full object-cover"
                                  />
                                </div>
                                <CardHeader>
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <CardTitle>{item.name}</CardTitle>
                                      <CardDescription className="text-gray-400 mt-2">
                                        {item.description}
                                      </CardDescription>
                                    </div>
                                  </div>
                                </CardHeader>
                                <CardFooter className="flex justify-between items-center">
                                  <Button
                                      className="bg-[#FFB800] hover:bg-[#FFB800]/90 text-black"
                                      onClick={() => handlePlayClick(item)}
                                  >
                                    <ShoppingCart className="w-4 h-4 mr-2" />
                                    Play
                                  </Button>
                                </CardFooter>
                              </Card>
                          ))}
                    </div>
                  </div>
              ))}
            </div>
          </main>
        </div>
      </div>
  );
}
