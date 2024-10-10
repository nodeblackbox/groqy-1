'use client'

import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { motion, useAnimation, useInView } from 'framer-motion'
import { ArrowRight, Code, Cpu, GitBranch, Globe, Layers, Users, ChevronRight, Star, Zap, MessageSquare, BarChart, Shield } from 'lucide-react'
import { Button } from "@/components/ui/button"
import Dashboard from '@/components/dashboardPreview'
import GlowingPointerCursor from '@/components/GlowingPointerCursor'
import PricingSection from '@/components/PricingSection'

const GlassNavbar = () => (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black bg-opacity-20 backdrop-filter backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
                <div className="flex items-center">
                    <a href="#" className="text-white font-bold text-xl">
                        <Image src="/logoGroq.svg" alt="Groqy" width={120} height={40} />
                    </a>
                </div>
                <div className="hidden md:block">
                    <div className="ml-10 flex items-baseline space-x-4">
                        <a href="#features" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">Features</a>
                        <a href="#pricing" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">Pricing</a>
                        <a href="#about" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">About</a>
                        <Button variant="secondary" size="sm">Get Started</Button>
                    </div>
                </div>
            </div>
        </div>
    </nav>
)

const FloatingBlur = ({ color, size, x, y }) => (
    <motion.div
        className="absolute rounded-full opacity-30 mix-blend-screen filter blur-3xl"
        style={{
            backgroundColor: color,
            width: size,
            height: size,
            top: y,
            left: x,
        }}
        animate={{
            x: [0, 10, -10, 0],
            y: [0, -10, 10, 0],
        }}
        transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: 'reverse',
        }}
    />
)

const FadeInSection = ({ children, delay = 0 }) => {
    const controls = useAnimation()
    const ref = useRef(null)
    const inView = useInView(ref, { once: true, threshold: 0.2 })

    useEffect(() => {
        if (inView)
        {
            controls.start('visible')
        }
    }, [controls, inView])

    return (
        <motion.div
            ref={ref}
            animate={controls}
            initial="hidden"
            transition={{ duration: 0.5, delay }}
            variants={{
                visible: { opacity: 1, y: 0 },
                hidden: { opacity: 0, y: 50 }
            }}
        >
            {children}
        </motion.div>
    )
}

const FeatureBox = ({ icon: Icon, title, description }) => (
    <motion.div
        className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        whileHover={{ y: -5 }}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
    >
        <Icon className="w-16 h-16 mb-6 text-purple-500" />
        <h3 className="text-2xl font-semibold mb-4">{title}</h3>
        <p className="text-gray-300">{description}</p>
    </motion.div>
)

const brands = [
    { name: 'OpenAI', logo: 'https://openai.com/favicon.ico', url: 'https://openai.com' },
    { name: 'Claude', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Anthropic_logo.svg/1280px-Anthropic_logo.svg.png', url: 'https://www.anthropic.com' },
    { name: 'Groq', logo: 'https://insidehpc.com/wp-content/uploads/2023/08/Groq-1024x512.png', url: 'https://groq.com' },
    { name: 'LabLab.ai', logo: 'https://ci3.googleusercontent.com/meips/ADKq_Nb0woYWpbDJt0L7dI4aRnsWbFqsGs_BpsJb1pAbK44d34Vz3iuAsybjW9CllWGDDxFKLh2OVvLaUEjOC8HY2iW3AcxfFueIVQgMs0NYGDp_W0ii9FLDacqTA_OXNo1ZhvZmvrsPXj07GldOo2tMAHiZl2l426M6ckTtfh42drrPrgsKk9Km8Ac=s0-d-e1-ft#http://cdn.mcauto-images-production.sendgrid.net/0acc547ee518d807/30075ff1-239e-434f-b41a-c27c8038131c/520x520.png', url: 'https://lablab.ai' },
    { name: 'Slack', logo: 'https://a.slack-edge.com/80588/marketing/img/meta/slack_hash_256.png', url: 'https://slack.com' },
    { name: 'Figma', logo: 'https://static.figma.com/app/icon/1/favicon.svg', url: 'https://www.figma.com' },
    { name: 'aimlapi', logo: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fallthingsai.com%2Ftool%2Faiml-api&psig=AOvVaw1ekXGMWHuEjzjfekXJde-8&ust=1728036240782000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCPipluT68YgDFQAAAAAdAAAAABAI', url: 'https://ml.ai' },
    { name: 'GitHub', logo: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png', url: 'https://github.com' },
]

const BrandLogo = ({ brand }) => {
    const [imgSrc, setImgSrc] = useState(brand.logo)

    return (
        <a
            href={brand.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 w-48 h-24 mx-8 flex items-center justify-center transition-transform hover:scale-110"
        >
            <Image
                src={imgSrc}
                alt={brand.name}
                width={150}
                height={50}
                className="max-w-full max-h-full object-contain"
                onError={() => setImgSrc('/placeholder-logo.png')}
            />
        </a>
    )
}

const BrandSlider = () => {
    const sliderRef = useRef(null)

    useEffect(() => {
        const slider = sliderRef.current
        let animationId

        const animate = () => {
            if (slider.scrollLeft >= slider.scrollWidth / 2)
            {
                slider.scrollLeft = 0
            } else
            {
                slider.scrollLeft += 1
            }
            animationId = requestAnimationFrame(animate)
        }

        animationId = requestAnimationFrame(animate)

        return () => cancelAnimationFrame(animationId)
    }, [])

    return (
        <div className="w-full overflow-hidden bg-gray-900 py-12">
            <div
                ref={sliderRef}
                className="flex overflow-x-hidden"
                style={{ width: '200%' }}
            >
                {[...brands, ...brands].map((brand, index) => (
                    <BrandLogo key={index} brand={brand} />
                ))}
            </div>
        </div>
    )
}

const DashboardPreview = () => (
    <div className="relative w-full max-w-6xl mx-auto">
        <Dashboard />
    </div>
)

const VideoSection = () => {
    const [isHovered, setIsHovered] = useState(false)
    const [isVideoPlaying, setIsVideoPlaying] = useState(false)

    const handlePlayVideo = () => {
        setIsVideoPlaying(true)
    }

    return (
        <section className="py-20 bg-gradient-to-b from-gray-900 to-gray-800 min-h-screen flex items-center justify-center px-4">
            <motion.div
                className="w-full max-w-4xl mx-auto"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <h2 className="text-4xl font-bold text-center mb-12 text-white">See Groqy in Action</h2>
                <motion.div
                    className={`relative rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 ease-in-out ${isHovered ? "scale-[1.02]" : "scale-100"}`}
                    style={{
                        boxShadow: `0 0 ${isHovered ? "40px" : "20px"} 5px rgba(0, 255, 255, 0.3)`,
                    }}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <div className="aspect-w-16 aspect-h-9 bg-gray-800 rounded-3xl overflow-hidden">
                        {!isVideoPlaying && (
                            <div className="absolute inset-0 flex items-center justify-center bg-cyan-500 bg-opacity-20 backdrop-blur-sm">
                                <Button
                                    onClick={handlePlayVideo}
                                    className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-6 rounded-full text-lg shadow-lg transition-all duration-300 transform hover:scale-105"
                                >
                                    Watch Now
                                </Button>
                            </div>
                        )}
                        {isVideoPlaying && (
                            <iframe
                                width="100%"
                                height="100%"
                                src="https://www.youtube.com/embed/6pxmdmlJCG0?si=VJdgiR5HkMedANBb&autoplay=1"
                                title="YouTube video player"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                                className="w-full h-full"
                            ></iframe>
                        )}
                    </div>
                    <div className="absolute inset-0 rounded-3xl pointer-events-none">
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-20"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-transparent to-cyan-500 opacity-10"></div>
                    </div>
                </motion.div>
            </motion.div>
        </section>
    )
}

export default function EnhancedHomePage() {
    return (
        <div className="min-h-screen bg-black text-white overflow-hidden">
            <GlowingPointerCursor />
            <GlassNavbar />

            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                <FloatingBlur color="#8B5CF6" size="40vw" x="10vw" y="10vh" />
                <FloatingBlur color="#EC4899" size="30vw" x="60vw" y="50vh" />
                <FloatingBlur color="#6366F1" size="35vw" x="80vw" y="20vh" />

                <div className="relative z-10 text-center px-4 max-w-4xl">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-7xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600"
                    >
                        Revolutionize Your Workflow with Groqy
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-2xl mb-12 text-gray-300"
                    >
                        Empower your team with AI-driven agent management. Boost productivity, streamline tasks, and unlock your business potential.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="flex justify-center space-x-6"
                    >
                        <Button variant="default" size="lg">
                            Start Free Trial <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                        <Button variant="outline" size="lg">
                            Watch Demo <ChevronRight className="w-5 h-5 ml-2" />
                        </Button>
                    </motion.div>
                </div>
            </section>

            {/* Dashboard Preview Section */}
            <section className="py-20 relative" id="features">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <FadeInSection>
                        <h2 className="text-4xl font-bold text-center mb-12">Groqy: Your Intelligent Agent Manager</h2>
                        <DashboardPreview />
                    </FadeInSection>
                </div>
            </section>

            {/* Feature Boxes Section */}
            <section className="py-20 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <FadeInSection>
                        <h2 className="text-4xl font-bold text-center mb-12">Powerful Features for Modern Teams</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <FeatureBox
                                icon={Code}
                                title="Easy API Integration"
                                description="Seamlessly integrate Groqy into your existing workflow with our robust and developer-friendly API."
                            />
                            <FeatureBox
                                icon={Users}
                                title="Collaborative Tools"
                                description="Foster teamwork and boost productivity with our suite of collaborative features designed for modern teams."
                            />
                            <FeatureBox
                                icon={Layers}
                                title="Integrated IDE"
                                description="Develop, test, and deploy your agent workflows directly within Groqy's powerful integrated development environment."
                            />
                        </div>
                    </FadeInSection>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-20 relative">
                <PricingSection />
            </section>

            {/* Video Section */}
            <VideoSection />

            {/* Brand Slider Section */}
            <BrandSlider />

            {/* Call to Action Section */}
            <section className="py-20 relative">
                <FloatingBlur color="#8B5CF6" size="30vw" x="70vw" y="10vh" />
                <FloatingBlur color="#EC4899" size="25vw" x="10vw" y="50vh" />
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <FadeInSection>
                        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl p-12 text-center">
                            <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Workflow?</h2>
                            <p className="text-xl mb-8 max-w-2xl mx-auto">
                                Join the growing number of businesses leveraging Groqy's AI-powered workflow management. Start your journey today!
                            </p>
                            <Button variant="secondary" size="lg">
                                Get Started Now <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                        </div>
                    </FadeInSection>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Product</h3>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Features</a></li>
                                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Pricing</a></li>
                                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Use Cases</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Company</h3>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">About Us</a></li>
                                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Careers</a></li>
                                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Contact</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Resources</h3>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Blog</a></li>
                                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Documentation</a></li>
                                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Support</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Legal</h3>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</a></li>
                                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Terms of Service</a></li>
                                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Cookie Policy</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-8 pt-8 border-t border-gray-800 text-center">
                        <p>&copy; 2024 Groqy. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}