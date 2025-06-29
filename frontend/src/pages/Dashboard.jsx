import React from "react";

const cards = [
  {
    title: "My Tasks",
    gradient: "from-blue-400 to-blue-600",
    count: 8,
  },
  {
    title: "Notifications",
    gradient: "from-pink-400 to-pink-600",
    count: 3,
  },
  {
    title: "Assigned Tasks",
    gradient: "from-green-400 to-green-600",
    count: 5,
  },
];

export default function Dashboard() {
  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold mb-8">Welcome back, User!</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {cards.map((card) => (
          <div
            key={card.title}
            className={`rounded-xl shadow-lg p-8 text-white bg-gradient-to-br ${card.gradient}`}
          >
            <div className="text-lg font-semibold mb-2">{card.title}</div>
            <div className="text-4xl font-bold">{card.count}</div>
          </div>
        ))}
      </div>
    </div>
  );
} 