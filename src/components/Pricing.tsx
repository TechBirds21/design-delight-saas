import { Button } from '@/components/ui/button';
import { Check, Star, Zap } from 'lucide-react';

const plans = [
  {
    name: 'Starter',
    price: 99,
    period: 'month',
    description: 'Perfect for small practices getting started',
    features: [
      'Up to 3 users',
      '500 patient records',
      'Basic appointment scheduling',
      'Standard billing features',
      'Email support',
      'Basic reporting',
      '5GB storage'
    ],
    cta: 'Start Free Trial',
    popular: false,
    color: 'border-border'
  },
  {
    name: 'Professional',
    price: 249,
    period: 'month',
    description: 'Complete solution for growing practices',
    features: [
      'Up to 15 users',
      'Unlimited patient records',
      'Advanced scheduling & queue management',
      'Complete billing & invoicing',
      'Priority support',
      'Advanced analytics & reporting',
      '50GB storage',
      'Multi-location support',
      'Custom branding',
      'API access'
    ],
    cta: 'Start Free Trial',
    popular: true,
    color: 'border-primary'
  },
  {
    name: 'Enterprise',
    price: 499,
    period: 'month',
    description: 'Advanced features for large healthcare organizations',
    features: [
      'Unlimited users',
      'Unlimited patient records',
      'White-label solution',
      'Custom integrations',
      'Dedicated account manager',
      'Advanced security features',
      'Unlimited storage',
      'Multi-tenant architecture',
      'Custom workflows',
      'SLA guarantee',
      '24/7 phone support'
    ],
    cta: 'Contact Sales',
    popular: false,
    color: 'border-accent'
  }
];

export function Pricing() {
  return (
    <section id="pricing" className="py-20 bg-gradient-to-b from-muted/20 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-6">
            <span className="text-sm font-medium text-primary">
              💰 Simple, Transparent Pricing
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              Choose the Perfect Plan
            </span>
            <br />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              for Your Practice
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Start with a free trial on any plan. No setup fees, no hidden costs. 
            Scale as your practice grows.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative gradient-card border-2 ${plan.color} rounded-3xl p-8 ${
                plan.popular 
                  ? 'shadow-2xl scale-105 bg-gradient-to-b from-card to-primary/5 shadow-glow' 
                  : 'shadow-large hover:shadow-xl'
              } transition-all duration-500 hover-lift animate-fade-in`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-primary text-white px-6 py-3 rounded-full text-sm font-medium flex items-center space-x-2 shadow-glow animate-float">
                    <Star className="h-4 w-4 fill-current" />
                    <span>Most Popular</span>
                  </div>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-8">
                <h3 className="text-2xl font-heading font-bold mb-3 text-foreground">{plan.name}</h3>
                <p className="text-muted-foreground mb-6">{plan.description}</p>
                <div className="flex items-baseline justify-center">
                  <span className="text-5xl font-heading font-bold text-gradient-primary">${plan.price}</span>
                  <span className="text-muted-foreground ml-2 text-lg">/{plan.period}</span>
                </div>
              </div>

              {/* Features List */}
              <div className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start space-x-3">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground/80 leading-relaxed">{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <Button 
                className={`w-full h-12 text-lg font-medium ${
                  plan.popular 
                    ? 'bg-gradient-primary hover:bg-gradient-to-r hover:from-primary-dark hover:to-primary text-white border-0 shadow-glow hover-lift' 
                    : 'glass border-primary/30 text-primary hover:bg-primary hover:text-white'
                }`}
                variant={plan.popular ? 'default' : 'outline'}
                size="lg"
              >
                {plan.popular && <Zap className="mr-2 h-5 w-5" />}
                {plan.cta}
              </Button>

              {/* Enterprise Contact Note */}
              {plan.name === 'Enterprise' && (
                <p className="text-center text-xs text-muted-foreground mt-4">
                  Custom pricing available for large organizations
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-muted/50 to-card border border-border rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-xl font-semibold mb-4 text-foreground">
              All plans include:
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Check className="h-4 w-4 text-primary" />
                <span>30-day free trial</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="h-4 w-4 text-primary" />
                <span>No setup fees</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="h-4 w-4 text-primary" />
                <span>Cancel anytime</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="h-4 w-4 text-primary" />
                <span>SSL encryption</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}