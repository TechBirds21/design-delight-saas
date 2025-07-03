import { BarChart3, Shield, Zap, Users, Globe, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";

const Features = () => {
  const features = [
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Get deep insights into your business performance with real-time analytics and customizable dashboards.",
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-level security with end-to-end encryption, SSO integration, and compliance certifications.",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Optimized performance with 99.9% uptime guarantee and instant data synchronization across all devices.",
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Seamless collaboration tools with real-time editing, commenting, and permission management.",
    },
    {
      icon: Globe,
      title: "Global Scale",
      description: "Worldwide infrastructure ensuring fast access from anywhere with automatic data backup and recovery.",
    },
    {
      icon: Smartphone,
      title: "Mobile Ready",
      description: "Fully responsive design with native mobile apps for iOS and Android platforms.",
    },
  ];

  return (
    <section id="features" className="py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Everything you need to{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              succeed
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our comprehensive platform provides all the tools and features you need 
            to streamline your workflow and accelerate growth.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-8 bg-gradient-card backdrop-blur-sm rounded-2xl border border-border/50 shadow-card hover:shadow-elegant transition-all duration-300 hover:scale-105"
            >
              <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="h-6 w-6 text-white" />
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

        <div className="text-center mt-16">
          <Button variant="secondary" size="lg">
            Explore All Features
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Features;