'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, X, Zap, Shield, Cloud, Cpu, Users, Code, ArrowRight } from 'lucide-react'

const PricingSection = () => {
    const [hoveredPlan, setHoveredPlan] = useState(null);

    const handlePlanHover = (index) => {
        setHoveredPlan(index);
    };

    const pricingPlans = [
        {
            title: 'Starter',
            price: '$29',
            period: 'per month',
            description: 'Perfect for small teams and startups',
            features: [
                { name: '5 AI Agents', included: true, icon: Cpu },
                { name: 'Basic Workflow Automation', included: true, icon: Zap },
                { name: 'Email Support', included: true, icon: Users },
                { name: 'API Access', included: false, icon: Code },
                { name: 'Advanced Analytics', included: false, icon: Cloud },
            ],
            color: 'from-blue-400 to-cyan-300',
            hoverColor: 'from-blue-500 to-cyan-400',
            glowColor: 'rgba(56, 189, 248, 0.6)',
            buttonText: 'Start Free Trial',
        },
        {
            title: 'Pro',
            price: '$99',
            period: 'per month',
            description: 'Ideal for growing businesses',
            features: [
                { name: 'Unlimited AI Agents', included: true, icon: Cpu },
                { name: 'Advanced Workflow Automation', included: true, icon: Zap },
                { name: 'Priority Support', included: true, icon: Users },
                { name: 'API Access', included: true, icon: Code },
                { name: 'Advanced Analytics', included: true, icon: Cloud },
            ],
            color: 'from-purple-500 to-indigo-500',
            hoverColor: 'from-purple-600 to-indigo-600',
            glowColor: 'rgba(139, 92, 246, 0.6)',
            buttonText: 'Upgrade to Pro',
            isPopular: true,
        },
        {
            title: 'Enterprise',
            price: 'Custom',
            period: 'contact us',
            description: 'For large-scale operations',
            features: [
                { name: 'Unlimited AI Agents', included: true, icon: Cpu },
                { name: 'Custom Workflow Solutions', included: true, icon: Zap },
                { name: 'Dedicated Account Manager', included: true, icon: Users },
                { name: 'Advanced API Integration', included: true, icon: Code },
                { name: 'Custom Analytics Dashboard', included: true, icon: Cloud },
            ],
            color: 'from-orange-500 to-pink-500',
            hoverColor: 'from-orange-600 to-pink-600',
            glowColor: 'rgba(249, 115, 22, 0.6)',
            buttonText: 'Contact Sales',
        },
    ]

    return (
        <section className="py-20 px-4 relative overflow-hidden bg-gray-900">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                        Supercharge Your Workflow
                    </h2>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                        Choose the perfect plan to revolutionize your team's productivity with Groqy's AI-powered agent management
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {pricingPlans.map((plan, index) => (
                        <motion.div
                            key={index}
                            className={`relative bg-gray-800 rounded-3xl overflow-hidden ${plan.isPopular ? 'md:scale-110 z-10' : ''
                                }`}
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            onHoverStart={() => setHoveredPlan(index)}
                            onHoverEnd={() => setHoveredPlan(null)}
                            style={{
                                boxShadow: `0 0 20px ${plan.glowColor}, 0 0 40px ${plan.glowColor}, 0 0 60px ${plan.glowColor}`,
                            }}
                        >
                            {plan.isPopular && (
                                <div className="absolute top-0 right-0 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-bold px-3 py-1 rounded-bl-lg z-10">
                                    Most Popular
                                </div>
                            )}
                            <div className="p-8 relative z-10 h-full flex flex-col">
                                <h3 className="text-2xl font-bold mb-2 text-white">{plan.title}</h3>
                                <p className="text-gray-300 mb-6">{plan.description}</p>
                                <div className="flex items-end mb-6">
                                    <span className="text-5xl font-bold text-white">{plan.price}</span>
                                    <span className="text-gray-300 ml-2">{plan.period}</span>
                                </div>
                                <ul className="space-y-4 mb-8 flex-grow">
                                    {plan.features.map((feature, featureIndex) => (
                                        <li key={featureIndex} className="flex items-center">
                                            {feature.included ? (
                                                <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                                            ) : (
                                                <X className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" />
                                            )}
                                            <span className={feature.included ? 'text-white' : 'text-gray-400'}>
                                                {feature.name}
                                            </span>
                                            <feature.icon className="w-5 h-5 ml-auto text-gray-400" />
                                        </li>
                                    ))}
                                </ul>
                                <motion.button
                                    className={`w-full py-3 px-4 rounded-full font-bold text-white bg-gradient-to-r ${hoveredPlan === index ? plan.hoverColor : plan.color
                                        } transition duration-300 flex items-center justify-center`}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {plan.buttonText}
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </motion.button>
                            </div>
                            <AnimatePresence>
                                {hoveredPlan === index && (
                                    <motion.div
                                        className={`absolute inset-0 bg-gradient-to-br ${plan.hoverColor} opacity-20 blur-xl`}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 0.2 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    ></motion.div>
                                )}
                            </AnimatePresence>
                            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black opacity-50"></div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Glowing orbs */}
            <div className="absolute top-0 left-0 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
            <div className="absolute top-0 right-0 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

            {/* Grid background */}
            <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
        </section>
    )
}

export default PricingSection