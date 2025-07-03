import { Button } from '@/components/ui/button';
import { ArrowRight, Play, CheckCircle, Sparkles, Users, Shield, Zap } from 'lucide-react';
import heroImage from '@/assets/hero-dashboard.jpg';

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 pb-16 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-secondary/10"></div>
      <div className="absolute inset-0 bg-grid-pattern opacity-30"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl animate-float"></div>
      <div className="absolute top-40 right-20 w-24 h-24 bg-secondary/20 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }}></div>
      <div className="absolute bottom-20 left-20 w-40 h-40 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Content */}
          <div className="text-center lg:text-left space-y-8 animate-fade-in">
            {/* Premium Badge */}
            <div className="inline-flex items-center px-6 py-3 glass rounded-full text-sm font-medium text-primary border border-primary/20 shadow-glow">
              <Sparkles className="w-4 h-4 mr-2" />
              🚀 Revolutionary Healthcare Platform
            </div>

            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold leading-tight">
                <span className="text-gradient-primary block">
                  Transform Your
                </span>
                <span className="text-gradient-secondary block">
                  Healthcare Practice
                </span>
              </h1>
              
              {/* Subtitle */}
              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-2xl lg:max-w-none">
                The most advanced multi-tenant healthcare management platform. 
                Streamline operations, enhance patient care, and scale effortlessly.
              </p>
            </div>

            {/* Feature Grid */}
            <div className="grid sm:grid-cols-2 gap-6">
              {[
                { icon: Users, text: "Multi-tenant Architecture", color: "text-primary" },
                { icon: Shield, text: "HIPAA Compliant Security", color: "text-secondary" },
                { icon: Zap, text: "Real-time Analytics", color: "text-accent" },
                { icon: CheckCircle, text: "Complete EMR System", color: "text-primary" }
              ].map((feature, index) => (
                <div 
                  key={index}
                  className="flex items-center space-x-3 p-4 glass rounded-xl hover-lift transition-all duration-300"
                >
                  <feature.icon className={`h-6 w-6 ${feature.color} flex-shrink-0`} />
                  <span className="font-medium text-foreground">{feature.text}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              <Button 
                size="lg" 
                className="bg-gradient-primary text-white border-0 shadow-elegant hover-lift text-lg px-8 py-4 h-auto"
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="glass border-primary/30 hover:bg-primary/10 text-lg px-8 py-4 h-auto"
              >
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>

            {/* Social Proof */}
            <div className="pt-8 space-y-6">
              <div className="flex items-center justify-center lg:justify-start space-x-8">
                {[
                  { label: "Active Clinics", value: "500+" },
                  { label: "Patients Served", value: "50K+" },
                  { label: "Uptime", value: "99.9%" }
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl font-bold font-heading text-gradient-primary">{stat.value}</div>
                    <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
              
              <p className="text-sm text-muted-foreground">
                Trusted by healthcare professionals worldwide
              </p>
            </div>
          </div>

          {/* Right Column - Dashboard Preview */}
          <div className="relative lg:ml-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="relative z-10">
              {/* Main Dashboard Image */}
              <div className="glass rounded-3xl p-6 shadow-2xl hover-lift transition-all duration-500">
                <img
                  src={heroImage}
                  alt="HospVerse Dashboard Preview"
                  className="w-full h-auto rounded-2xl shadow-large"
                />
              </div>
              
              {/* Floating Status Cards */}
              <div className="absolute -top-6 -right-6 glass px-4 py-3 rounded-2xl text-sm font-medium shadow-large animate-pulse-glow border border-primary/20">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
                  <span className="text-success-foreground">Live Dashboard</span>
                </div>
              </div>
              
              <div className="absolute -bottom-6 -left-6 glass px-4 py-3 rounded-2xl text-sm font-medium shadow-large border border-accent/20">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-accent rounded-full"></div>
                  <span className="text-accent-foreground">Real-time Updates</span>
                </div>
              </div>
            </div>

            {/* Background Glow Effects */}
            <div className="absolute -inset-8 bg-gradient-primary rounded-full blur-3xl opacity-20 animate-gradient-shift"></div>
            <div className="absolute -inset-12 bg-gradient-secondary rounded-full blur-3xl opacity-15 animate-gradient-shift" style={{ animationDelay: '5s' }}></div>
          </div>
        </div>
      </div>
    </section>
  );
}