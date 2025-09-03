"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal } from "lucide-react";

const services = [
  {
    id: 1,
    name: "Beard Trim",
    description: "Custom beard trim with the best barbers in town",
    price: 20,
    status: "Active",
    image: "/professional-beard-trimming-service.png",
  },
  {
    id: 2,
    name: "Haircut",
    description: "Custom haircut with the best barbers in town",
    price: 50,
    status: "Active",
    image: "/professional-haircut.png",
  },
  {
    id: 3,
    name: "Hair Styling",
    description: "Custom hair styling with the best barbers in town",
    price: 10,
    status: "Active",
    image: "/professional-hair-styling-service.png",
  },
];

export function ServicesGrid() {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {services.map((service) => (
          <Card key={service.id} className="overflow-hidden">
            <div className="aspect-video bg-gray-200">
              <img
                src={service.image || "/placeholder.svg"}
                alt={service.name}
                className="w-full h-full object-cover"
              />
            </div>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  {service.name}
                </h3>
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800"
                >
                  {service.status}
                </Badge>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                {service.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-900">
                  ${service.price}
                </span>
                <div className="flex items-center gap-2">
                  <Button className="bg-slate-900 hover:bg-slate-800 text-white">
                    Edit
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Showing 1 to 6 of 24 results
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            Previous
          </Button>
          <Button size="sm" className="bg-slate-900 text-white">
            1
          </Button>
          <Button variant="outline" size="sm">
            2
          </Button>
          <Button variant="outline" size="sm">
            3
          </Button>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </div>
    </>
  );
}
