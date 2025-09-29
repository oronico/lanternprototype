const express = require('express');
const router = express.Router();

// Coaching and Expertise Engine for Microschools
const coachingInsights = {
  // Financial Health Coaching
  financial: {
    cashFlow: {
      trigger: (daysCash) => daysCash < 15,
      coaching: {
        immediate: [
          "🚨 CASH CRISIS PROTOCOL: You have {daysCash} days of cash remaining",
          "📞 TODAY: Call your top 3 late payers personally (not email)",
          "💳 TONIGHT: Set up auto-pay for all current families", 
          "📋 TOMORROW: Offer payment plans to struggling families"
        ],
        strategic: [
          "Schools with similar cash positions that survived:",
          "• Raised emergency bridge funding (family loans, credit line)",
          "• Negotiated 60-day rent deferral with landlord",
          "• Accelerated enrollment with immediate start dates",
          "• Reduced expenses temporarily (supplies, non-essential services)"
        ],
        prevention: [
          "Top-performing schools maintain 30+ days cash by:",
          "• Auto-pay adoption rate >90% (yours: estimate 65%)",
          "• 3-day late payment follow-up (yours: 7-10 days)",
          "• ESA family focus (90% retention vs 78% overall)",
          "• Monthly tuition review vs quarterly"
        ]
      }
    },
    
    facilityOptimization: {
      trigger: (facilityBurden) => facilityBurden > 0.25,
      coaching: {
        immediate: [
          "🏢 FACILITY BURDEN ALERT: {facilityPercent}% of revenue goes to facility (target: ≤20%)",
          "💰 COST IMPACT: Each 1% reduction = ${Math.round(monthlyRevenue * 0.01)} monthly savings",
          "📈 CASH IMPACT: Reducing to 20% adds {Math.round((facilityBurden - 0.20) * monthlyRevenue / (monthlyRevenue/30))} days cash runway"
        ],
        tactical: [
          "Negotiation Strategy (Success Rate: 65%):",
          "• Use attached market comparables showing $20-22/sq ft average",
          "• Emphasize your payment history and tenant quality",
          "• Request graduated reduction over 6 months",
          "• Offer longer lease term in exchange for lower rate"
        ],
        strategic: [
          "Alternative Strategies from Successful Schools:",
          "• Church partnerships: $1,200/month (40-60% savings)",
          "• Shared space arrangements: $1,800/month effective reduction",
          "• Sublease 2 days/week: Convert to revenue stream",
          "• Co-location with complementary businesses"
        ]
      }
    },

    tuitionOptimization: {
      trigger: (profitMargin) => profitMargin < 0.10,
      coaching: {
        strategic: [
          "🎯 TUITION STRATEGY: You're ${tuitionGap} below sustainability",
          "📊 MARKET POSITION: ${marketPosition} (Average: $750, You: ${currentTuition})",
          "💡 ESA STRATEGY: Position as 'ESA + ${Math.max(0, recommendedTuition - esaAmount)} family investment'"
        ],
        implementation: [
          "Successful Tuition Increases (What Works):",
          "• 60-90 day notice period (family planning time)",
          "• Semester implementation (not mid-year)",
          "• Value justification (new programs, teacher qualifications)",
          "• Payment plan options (ease transition burden)",
          "• Grandfather current families for loyalty"
        ],
        messaging: [
          "Proven Communication Framework:",
          "• Lead with value improvements (not cost pressure)",
          "• Benchmark against market rates (transparency)",
          "• Emphasize ESA compatibility (accessibility)", 
          "• Offer early payment discounts (cash flow help)",
          "• Individual family meetings for concerns"
        ]
      }
    }
  },

  // Enrollment Coaching
  enrollment: {
    conversionOptimization: {
      trigger: (conversionRate) => conversionRate < 0.50,
      coaching: {
        immediate: [
          "📈 CONVERSION ALERT: {conversionRate}% inquiry-to-tour rate (target: 60%+)",
          "🗓️ QUICK WIN: Saturday tours convert 2x better - schedule this weekend",
          "📱 RESPONSE TIME: Respond to inquiries within 2 hours (current: estimate 24+ hours)"
        ],
        systematic: [
          "High-Converting Schools Do This:",
          "• Same-day tour scheduling (vs. week+ delays)", 
          "• Parent testimonials in initial email response",
          "• Student work samples shown during tours",
          "• 'Day in the life' video sent before tour",
          "• Follow-up within 24 hours of tour"
        ],
        retention: [
          "Family Retention Intelligence:",
          "• ESA families: 90% retention (prioritize outreach)",
          "• Sibling families: 2.3x lifetime value",
          "• Late payers: 3x more likely to leave (early intervention)",
          "• Families with parent involvement: 95% retention"
        ]
      }
    }
  },

  // Operational Efficiency  
  operations: {
    staffingOptimization: {
      trigger: (staffingRatio) => staffingRatio > 0.50,
      coaching: {
        immediate: [
          "👥 STAFFING ALERT: {staffingPercent}% of revenue goes to staff (target: ≤45%)",
          "📊 EFFICIENCY: You're at {studentToStaffRatio}:1 ratio (optimal: 8-12:1)",
          "💡 QUICK FIX: Cross-train teachers for multiple grade levels"
        ],
        strategic: [
          "Right-Sized Staffing Models:",
          "• Lead teacher + aide model (vs. multiple full-time)",
          "• Specialist rotation (art, music, PE) shared across days",
          "• Parent volunteer integration (reduces paid staff needs)",
          "• Multi-age classrooms (teacher efficiency gains)"
        ]
      }
    }
  }
};

// Freemium vs Premium Feature Matrix
const featureMatrix = {
  freemium: {
    name: "Microschool Starter",
    price: 0,
    maxStudents: 25,
    features: [
      "Basic financial dashboard",
      "Simple payment tracking (2 sources)",
      "Basic enrollment pipeline",
      "Monthly financial health score",
      "Community forum access"
    ],
    limitations: [
      "Limited to 2 payment integrations",
      "Monthly coaching insights only", 
      "Basic document templates (5)",
      "Email support only",
      "Community-generated content"
    ]
  },
  
  professional: {
    name: "Microschool Professional", 
    price: 149,
    maxStudents: 50,
    features: [
      "Complete financial health monitoring (10 metrics)",
      "Unlimited payment integrations", 
      "AI-powered coaching insights (weekly)",
      "Advanced enrollment analytics",
      "20+ AI document templates",
      "Lease analysis with insurance requirements",
      "Real-time cash flow forecasting",
      "Email + chat support"
    ],
    coaching: [
      "Weekly strategic insights",
      "Automated optimization recommendations",
      "Peer benchmarking analysis",
      "Crisis management protocols",
      "Growth strategy guidance"
    ]
  },
  
  expert: {
    name: "Microschool Expert",
    price: 299,
    maxStudents: 100,
    features: [
      "Everything in Professional +",
      "Daily coaching insights",
      "Advanced predictive analytics", 
      "Custom document generation",
      "Priority integration requests",
      "Phone support",
      "Quarterly business review"
    ],
    coaching: [
      "Daily strategic recommendations",
      "Proactive problem identification", 
      "Advanced scenario planning",
      "Market opportunity analysis",
      "Competitive intelligence",
      "Expert consultation access"
    ]
  }
};

// GET /api/coaching/insights
router.get('/insights', (req, res) => {
  try {
    const { 
      daysCashOnHand = 7,
      facilityBurden = 0.28,
      profitMargin = -0.02,
      staffingRatio = 0.52,
      conversionRate = 0.42,
      plan = 'professional'
    } = req.query;

    const insights = [];
    const coaching = [];

    // Generate insights based on financial health
    if (daysCashOnHand < 15) {
      insights.push({
        type: 'critical',
        title: 'Cash Flow Crisis Management',
        urgency: 'immediate',
        plan: 'freemium', // Available to all
        insight: coachingInsights.financial.cashFlow.coaching.immediate,
        actionable: true,
        timeToImpact: '48 hours',
        successRate: '85%'
      });
    }

    if (facilityBurden > 0.25) {
      const facilityInsight = {
        type: 'optimization',
        title: 'Facility Cost Optimization Strategy',
        urgency: 'high',
        plan: plan === 'freemium' ? 'professional' : plan,
        insight: coachingInsights.financial.facilityOptimization.coaching.strategic,
        templates: ['rent_reduction_letter', 'sublease_opportunity'],
        potentialSavings: Math.round((facilityBurden - 0.20) * 16324),
        timeToImpact: '30-60 days',
        successRate: '65%'
      };

      if (plan !== 'freemium') {
        insights.push(facilityInsight);
      } else {
        coaching.push({
          ...facilityInsight,
          preview: "Facility costs too high - upgrade for optimization strategy",
          upgradeValue: `Save $${facilityInsight.potentialSavings}/month with Professional plan`
        });
      }
    }

    if (conversionRate < 0.50) {
      const conversionInsight = {
        type: 'growth',
        title: 'Enrollment Conversion Optimization',
        urgency: 'medium',
        plan: 'professional',
        insight: coachingInsights.enrollment.conversionOptimization.coaching.systematic,
        potentialRevenue: Math.round(((0.60 - conversionRate) * 12 * 750)), // Additional revenue from improved conversion
        timeToImpact: '30 days',
        successRate: '78%'
      };

      if (plan !== 'freemium') {
        insights.push(conversionInsight);
      } else {
        coaching.push({
          ...conversionInsight,
          preview: "Low conversion rate detected - upgrade for growth strategy",
          upgradeValue: `Potential +$${conversionInsight.potentialRevenue}/month with better conversion`
        });
      }
    }

    // Generate premium coaching recommendations
    if (plan === 'expert') {
      coaching.push({
        type: 'strategic',
        title: 'Quarterly Business Review Recommendations',
        insights: [
          "Market opportunity: 3 new microschools opened within 5 miles (competitive threat + partnership opportunity)",
          "ESA expansion: Florida increasing voucher amounts by 8% next year",
          "Facility opportunity: Commercial real estate down 12% in your area",
          "Staffing market: Teacher availability up 15% - hiring opportunity"
        ],
        nextQuarterFocus: [
          "Facility cost reduction (highest ROI opportunity)",
          "ESA family acquisition (highest retention segment)", 
          "Operational efficiency improvements",
          "Strategic partnership exploration"
        ]
      });
    }

    res.json({
      insights,
      coaching,
      userPlan: plan,
      upgradeOpportunities: coaching.length,
      totalPotentialValue: coaching.reduce((sum, item) => sum + (item.potentialSavings || item.potentialRevenue || 0), 0)
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate coaching insights' });
  }
});

// GET /api/coaching/pricing
router.get('/pricing', (req, res) => {
  try {
    const { studentCount = 28 } = req.query;
    
    // Calculate ROI for each plan
    const currentBookkeepingCost = studentCount < 30 ? 2000 : studentCount < 50 ? 3000 : 4000;
    
    const pricingWithROI = Object.entries(featureMatrix).map(([key, plan]) => ({
      ...plan,
      roi: {
        monthlySavings: currentBookkeepingCost - plan.price,
        annualSavings: (currentBookkeepingCost - plan.price) * 12,
        paybackPeriod: plan.price > 0 ? Math.ceil(plan.price / currentBookkeepingCost) : 0,
        roiPercentage: plan.price > 0 ? Math.round(((currentBookkeepingCost - plan.price) / plan.price) * 100) : Infinity
      },
      appropriateFor: getSchoolFit(studentCount, key)
    }));

    res.json({
      plans: pricingWithROI,
      marketContext: {
        averageBookkeepingCost: currentBookkeepingCost,
        marketGrowthRate: 0.25,
        competitorPricing: {
          quickbooks: 50,
          xero: 39,
          genericBookkeeper: currentBookkeepingCost
        }
      },
      recommendation: getRecommendedPlan(studentCount)
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch pricing information' });
  }
});

// GET /api/coaching/action-plan
router.get('/action-plan', (req, res) => {
  try {
    const {
      daysCashOnHand = 7,
      facilityBurden = 0.28,
      studentCount = 28,
      conversionRate = 0.42,
      plan = 'professional'
    } = req.query;

    const actionPlan = generateActionPlan({
      daysCashOnHand,
      facilityBurden, 
      studentCount,
      conversionRate,
      plan
    });

    res.json(actionPlan);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate action plan' });
  }
});

function getSchoolFit(studentCount, planKey) {
  if (planKey === 'freemium') {
    return studentCount <= 15 ? 'perfect_fit' : studentCount <= 25 ? 'good_fit' : 'outgrown';
  }
  if (planKey === 'professional') {
    return studentCount >= 15 && studentCount <= 40 ? 'perfect_fit' : 'consider_other';
  }
  if (planKey === 'expert') {
    return studentCount >= 35 ? 'perfect_fit' : 'premium_choice';
  }
  return 'consider_other';
}

function getRecommendedPlan(studentCount) {
  if (studentCount <= 15) {
    return {
      recommended: 'freemium',
      reasoning: 'Start free, upgrade as you grow',
      upgradeWhen: 'Reach 20+ students or need advanced coaching'
    };
  } else if (studentCount <= 40) {
    return {
      recommended: 'professional',
      reasoning: 'Sweet spot for growing microschools - coaching + automation',
      value: 'Replaces $2,500-3,500/month bookkeeper with strategic insights'
    };
  } else {
    return {
      recommended: 'expert',
      reasoning: 'Large operation needs advanced business intelligence',
      value: 'CFO-level insights at fraction of consultant cost'
    };
  }
}

function generateActionPlan(params) {
  const { daysCashOnHand, facilityBurden, studentCount, conversionRate, plan } = params;
  
  const actionPlan = {
    priority: 'high',
    timeframe: '30 days',
    actions: []
  };

  // Critical cash flow actions (available to all plans)
  if (daysCashOnHand < 15) {
    actionPlan.actions.push({
      priority: 1,
      title: 'Emergency Cash Flow Management',
      plan: 'freemium',
      tasks: [
        'Call top 3 late payers today',
        'Set up auto-pay for current families',
        'Offer payment plans to struggling families',
        'Contact landlord about temporary rent deferral'
      ],
      expectedImpact: '$3,000-5,000 cash improvement',
      timeframe: '1-2 weeks',
      successStories: '85% of schools in similar situations recover within 30 days'
    });
  }

  // Facility optimization (Professional+ feature)
  if (facilityBurden > 0.25 && plan !== 'freemium') {
    actionPlan.actions.push({
      priority: 2,
      title: 'Facility Cost Optimization',
      plan: 'professional',
      tasks: [
        'Download market comparables report',
        'Schedule landlord meeting for rent reduction',
        'Research church partnership opportunities',
        'Post sublease opportunity listing'
      ],
      expectedImpact: `$${Math.round((facilityBurden - 0.20) * 16324)}/month savings`,
      timeframe: '30-60 days',
      templates: ['rent_reduction_letter', 'sublease_posting'],
      successStories: '65% achieve rent reduction, 40% find sublease partners'
    });
  }

  // Enrollment growth strategy (Professional+ feature)
  if (conversionRate < 0.50 && plan !== 'freemium') {
    actionPlan.actions.push({
      priority: 3,
      title: 'Enrollment Conversion Optimization',
      plan: 'professional',
      tasks: [
        'Switch to Saturday tour scheduling',
        'Implement 2-hour inquiry response standard',
        'Create ESA family-specific marketing materials',
        'Set up referral program for current families'
      ],
      expectedImpact: `+$${Math.round(((0.60 - conversionRate) * 12 * 750))}/month potential revenue`,
      timeframe: '30 days',
      successStories: 'Schools implementing these changes see 40% conversion improvement'
    });
  }

  return actionPlan;
}

module.exports = router;
