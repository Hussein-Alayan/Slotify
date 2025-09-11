"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const agentData = [
  { name: "Sarah Chen", chats: 234, rating: 4.9 },
  { name: "Mike Johnson", chats: 198, rating: 4.7 },
  { name: "Emily Davis", chats: 187, rating: 4.8 },
  { name: "Alex Rodriguez", chats: 156, rating: 4.6 },
  { name: "Lisa Wang", chats: 142, rating: 4.5 },
]

const tabs = ["Chats", "Resolution Rate", "Rating"]

export function AgentsPerformance() {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Top Agents Performance</CardTitle>
        <div className="flex gap-2 mt-4">
          {tabs.map((tab, index) => (
            <Badge key={tab} variant={index === 0 ? "default" : "outline"} className="cursor-pointer">
              {tab}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={agentData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="chats" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-6 grid grid-cols-5 gap-4">
          {agentData.map((agent) => (
            <div key={agent.name} className="text-center">
              <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-2 flex items-center justify-center">👤</div>
              <div className="text-sm font-medium text-gray-900">{agent.name}</div>
              <div className="text-xs text-gray-500">{agent.chats} chats</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
