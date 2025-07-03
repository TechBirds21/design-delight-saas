import { 
  Users, 
  Calendar, 
  FileText, 
  CreditCard, 
  Package, 
  BarChart3, 
  Shield, 
  Zap,
  Heart,
  Camera,
  UserCheck,
  Settings
} from 'lucide-react';

const features = [
  {
    icon: Users,
    title: 'Multi-Role Management',
    description: 'Complete role-based access for doctors, receptionists, technicians, and administrators with customizable permissions.',
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Calendar,
    title: 'Smart Scheduling',
    description: 'Advanced appointment booking with conflict detection, automated reminders, and queue management.',
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    icon: FileText,
    title: 'Electronic Health Records',
    description: 'Comprehensive patient records with SOAP notes, treatment history, and secure document management.',
    gradient: 'from-green-500 to-emerald-500'
  },
  {
    icon: CreditCard,
    title: 'Integrated Billing',
    description: 'Automated billing, invoice generation, payment tracking, and financial reporting in one place.',
    gradient: 'from-orange-500 to-red-500'
  },
  {
    icon: Package,
    title: 'Inventory Control',
    description: 'Real-time inventory tracking, automated reorder alerts, and supplier management.',
    gradient: 'from-indigo-500 to-purple-500'
  },
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    description: 'Comprehensive reports, KPI dashboards, and business intelligence for data-driven decisions.',
    gradient: 'from-teal-500 to-blue-500'
  },
  {
    icon: Camera,
    title: 'Photo Management',
    description: 'Secure patient photo storage with treatment progress tracking and before/after comparisons.',
    gradient: 'from-pink-500 to-rose-500'
  },
  {
    icon: Heart,
    title: 'Patient Portal',
    description: 'Self-service portal for patients to book appointments, view records, and communicate with providers.',
    gradient: 'from-red-500 to-pink-500'
  },
  {
    icon: Shield,
    title: 'HIPAA Compliant',
    description: 'Bank-level security with end-to-end encryption, audit trails, and compliance monitoring.',
    gradient: 'from-gray-600 to-gray-800'
  },
  {
    icon: UserCheck,
    title: 'CRM & Lead Management',
    description: 'Convert prospects into patients with automated lead tracking and follow-up workflows.',
    gradient: 'from-yellow-500 to-orange-500'
  },
  {
    icon: Zap,
    title: 'Real-time Sync',
    description: 'Instant data synchronization across all devices and users with offline capability.',
    gradient: 'from-blue-600 to-indigo-600'
  },
  {
    icon: Settings,
    title: 'Multi-Tenant SaaS',
    description: 'Scalable architecture supporting multiple clinics with isolated data and custom branding.',
    gradient: 'from-green-600 to-teal-600'
  }
];

export function Features() {
  return (
    <section id="features" className="py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-6">
            <span className="text-sm font-medium text-primary">
              ✨ Comprehensive Healthcare Solution
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              Everything You Need to
            </span>
            <br />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Run Your Practice
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            From patient registration to advanced analytics, HospVerse provides all the tools 
            your healthcare practice needs in one integrated platform.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative gradient-card border border-border/50 rounded-2xl p-8 hover-lift transition-all duration-500"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative z-10">
                {/* Icon */}
                <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${feature.gradient} mb-6 shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-heading font-semibold mb-4 text-foreground group-hover:text-gradient-primary transition-all duration-300">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed group-hover:text-foreground/80 transition-colors duration-300">
                  {feature.description}
                </p>
              </div>

              {/* Hover Effect Border */}
              <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-primary/20 transition-colors duration-300"></div>
              
              {/* Shine Effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 group-hover:animate-pulse"></div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16 animate-fade-in">
          <div className="glass border border-primary/20 rounded-3xl p-8 max-w-4xl mx-auto hover-lift">
            <h3 className="text-3xl font-heading font-bold mb-4 text-gradient-primary">
              Ready to Transform Your Practice?
            </h3>
            <p className="text-lg text-muted-foreground mb-8">
              Join hundreds of healthcare providers who trust HospVerse for their daily operations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-primary text-white px-8 py-4 rounded-xl font-medium hover-lift shadow-glow transition-all duration-300 text-lg">
                Start Free Trial
              </button>
              <button className="glass border border-primary/30 px-8 py-4 rounded-xl font-medium hover:bg-primary/10 transition-all duration-300 text-lg">
                Schedule Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}