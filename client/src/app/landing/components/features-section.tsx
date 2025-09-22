import { Bot, TrendingUp, Settings } from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      icon: Bot,
      title: "AI-Powered Assistant",
      description:
        "Intelligent booking assistant that learns from patterns and optimizes scheduling automatically",
    },
    {
      icon: TrendingUp,
      title: "Real-Time AI Call",
      description:
        "Instantly connect with our AI via live call to handle bookings, answer questions, and provide support for your business, all in real time.",
    },
    {
      icon: Settings,
      title: "Dynamic Management",
      description:
        "Real-time staff and resource allocation based on demand and availability patterns",
    },
  ];

  return (
    <section className="bg-primary py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-primary-foreground mb-4">
            Powerful Features
          </h2>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            Advanced technology meets intuitive design to deliver the ultimate
            booking experience
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
