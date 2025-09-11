"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { name: "Mon", chats: 1200 },
  { name: "Tue", chats: 1900 },
  { name: "Wed", chats: 1600 },
  { name: "Thu", chats: 2200 },
  { name: "Fri", chats: 2800 },
  { name: "Sat", chats: 2100 },
  { name: "Sun", chats: 1800 },
]

export function ChatsChart() {
  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Chats Over Time</CardTitle>
        <Select defaultValue="7days">
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">Last 7 days</SelectItem>
            <SelectItem value="30days">Last 30 days</SelectItem>
            <SelectItem value="90days">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="chats" stroke="#3b82f6" strokeWidth={2} dot={{ fill: "#3b82f6" }} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
