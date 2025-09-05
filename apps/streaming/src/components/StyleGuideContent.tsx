"use client";

import { useState } from "react";
import Image from "next/image";
import { 
  PlayIcon, 
  InformationCircleIcon, 
  PlusIcon, 
  StarIcon,
  MagnifyingGlassIcon,
  BellIcon,
  UserCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon 
} from "@heroicons/react/24/outline";
import { PlayIcon as PlayIconSolid } from "@heroicons/react/24/solid";

export function StyleGuideContent() {
  const [activeSection, setActiveSection] = useState("overview");

  const sections = [
    { id: "overview", title: "Overview" },
    { id: "colors", title: "Colors" },
    { id: "typography", title: "Typography" },
    { id: "buttons", title: "Buttons" },
    { id: "forms", title: "Forms" },
    { id: "cards", title: "Content Cards" },
    { id: "navigation", title: "Navigation" },
    { id: "hero", title: "Hero Section" },
    { id: "loading", title: "Loading States" },
    { id: "animations", title: "Animations" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
          CSN Design System
        </h1>
        <p className="text-lg text-gray-300 max-w-3xl">
          A comprehensive style guide showcasing all design patterns, components, and styling used throughout 
          the CSN streaming platform. Netflix-inspired dark theme with focus on content discovery.
        </p>
      </div>

      <div className="flex gap-8">
        {/* Sidebar Navigation */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <nav className="sticky top-24">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Sections
            </h3>
            <ul className="space-y-2">
              {sections.map((section) => (
                <li key={section.id}>
                  <button
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left px-3 py-2 text-sm transition-colors ${ 
                      activeSection === section.id 
                        ? "text-white bg-gray-800" 
                        : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                    }`}
                  >
                    {section.title}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-16">
          {/* Overview Section */}
          <section id="overview" className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">Overview</h2>
              <p className="text-gray-300 mb-6">
                The CSN Design System is built with Tailwind CSS and follows Netflix-inspired design principles. 
                It emphasizes dark theme aesthetics, content-first layouts, and seamless user experiences.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-900 p-6 border border-gray-800">
                  <h3 className="text-xl font-semibold text-white mb-2">Dark Theme</h3>
                  <p className="text-gray-400 text-sm">
                    Optimized for viewing in low-light environments with high contrast ratios.
                  </p>
                </div>
                <div className="bg-gray-900 p-6 border border-gray-800">
                  <h3 className="text-xl font-semibold text-white mb-2">Content First</h3>
                  <p className="text-gray-400 text-sm">
                    Visual hierarchy that prioritizes movies and TV shows discovery.
                  </p>
                </div>
                <div className="bg-gray-900 p-6 border border-gray-800">
                  <h3 className="text-xl font-semibold text-white mb-2">Responsive</h3>
                  <p className="text-gray-400 text-sm">
                    Mobile-first design that adapts seamlessly across all devices.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Colors Section */}
          <section id="colors" className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">Color Palette</h2>
              <p className="text-gray-300 mb-6">
                Our color system is designed for dark environments with high contrast and accessibility in mind.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Primary Colors */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-white">Primary</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 border border-gray-600" style={{backgroundColor: '#050505'}}></div>
                      <div>
                        <div className="text-white text-sm font-medium">Black</div>
                        <div className="text-gray-400 text-xs">#050505</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12" style={{backgroundColor: '#202020'}}></div>
                      <div>
                        <div className="text-white text-sm font-medium">Dark Gray</div>
                        <div className="text-gray-400 text-xs">#202020</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12" style={{backgroundColor: '#333333'}}></div>
                      <div>
                        <div className="text-white text-sm font-medium">Gray</div>
                        <div className="text-gray-400 text-xs">#333333</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 border border-gray-600" style={{backgroundColor: '#fbfef9'}}></div>
                      <div>
                        <div className="text-white text-sm font-medium">Off-White</div>
                        <div className="text-gray-400 text-xs">#fbfef9</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Brand Colors */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-white">Brand</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12" style={{backgroundColor: '#ee1518'}}></div>
                      <div>
                        <div className="text-white text-sm font-medium">CSN Red</div>
                        <div className="text-gray-400 text-xs">#ee1518</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12" style={{backgroundColor: '#ff6b35'}}></div>
                      <div>
                        <div className="text-white text-sm font-medium">Orange</div>
                        <div className="text-gray-400 text-xs">#ff6b35</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Usage Examples */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-white">Usage</h3>
                  <div className="space-y-2 text-sm">
                    <div className="text-gray-300">• Black (#050505): Backgrounds, navigation</div>
                    <div className="text-gray-300">• Dark Gray (#202020): Secondary backgrounds</div>
                    <div className="text-gray-300">• Gray (#333333): Borders, subtle elements</div>
                    <div className="text-gray-300">• Red (#ee1518): Primary buttons, brand</div>
                    <div className="text-gray-300">• Off-White (#fbfef9): Text, contrasts</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Typography Section */}
          <section id="typography" className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">Typography</h2>
              <p className="text-gray-300 mb-6">
                Using Inter font family for excellent readability and modern appearance across all screen sizes.
              </p>
              
              <div className="space-y-6">
                <div className="bg-gray-900 p-6 border border-gray-800">
                  <h3 className="text-lg font-semibold text-white mb-4">Heading Scale</h3>
                  <div className="space-y-4">
                    <div className="text-7xl font-bold text-white">Hero Title (7xl)</div>
                    <div className="text-6xl font-bold text-white">Display (6xl)</div>
                    <div className="text-5xl font-bold text-white">Heading 1 (5xl)</div>
                    <div className="text-4xl font-semibold text-white">Heading 2 (4xl)</div>
                    <div className="text-3xl font-semibold text-white">Heading 3 (3xl)</div>
                    <div className="text-2xl font-semibold text-white">Heading 4 (2xl)</div>
                    <div className="text-xl font-semibold text-white">Heading 5 (xl)</div>
                  </div>
                </div>

                <div className="bg-gray-900 p-6 border border-gray-800">
                  <h3 className="text-lg font-semibold text-white mb-4">Body Text</h3>
                  <div className="space-y-3">
                    <div className="text-lg text-white">Large body text (lg) - for descriptions and important content</div>
                    <div className="text-base text-white">Base body text (base) - default text size for most content</div>
                    <div className="text-sm text-gray-300">Small text (sm) - for metadata and secondary information</div>
                    <div className="text-xs text-gray-400">Extra small text (xs) - for captions and fine print</div>
                  </div>
                </div>

                <div className="bg-gray-900 p-6 border border-gray-800">
                  <h3 className="text-lg font-semibold text-white mb-4">Font Weights</h3>
                  <div className="space-y-2">
                    <div className="text-base font-light text-white">Light (300) - Subtle text</div>
                    <div className="text-base font-normal text-white">Normal (400) - Body text</div>
                    <div className="text-base font-medium text-white">Medium (500) - Card titles</div>
                    <div className="text-base font-semibold text-white">Semibold (600) - Section headers</div>
                    <div className="text-base font-bold text-white">Bold (700) - Primary headers</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Buttons Section */}
          <section id="buttons" className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">Buttons</h2>
              <p className="text-gray-300 mb-6">
                Button styles for different contexts and user actions throughout the platform.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Primary Buttons</h3>
                    <div className="space-y-4">
                      <button className="btn-primary">
                        Primary Button
                      </button>
                      <button className="bg-white text-black font-semibold px-8 py-3 flex items-center space-x-2 hover:bg-white/80 transition-colors">
                        <PlayIconSolid className="h-5 w-5" />
                        <span>Play</span>
                      </button>
                      <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 font-semibold transition-colors">
                        Action Button
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Secondary Buttons</h3>
                    <div className="space-y-4">
                      <button className="btn-secondary">
                        Secondary Button
                      </button>
                      <button className="bg-gray-600/70 text-white font-semibold px-8 py-3 flex items-center space-x-2 hover:bg-gray-600/40 transition-colors">
                        <InformationCircleIcon className="h-5 w-5" />
                        <span>More Info</span>
                      </button>
                      <button className="border border-gray-600 text-white px-6 py-3 hover:border-gray-400 transition-colors">
                        <PlusIcon className="h-5 w-5 inline mr-2" />
                        Add to List
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Icon Buttons</h3>
                    <div className="flex space-x-4">
                      <button className="bg-white/20 hover:bg-white/30 text-white p-3 transition-colors">
                        <PlayIcon className="h-5 w-5" />
                      </button>
                      <button className="bg-white/20 hover:bg-white/30 text-white p-3 transition-colors">
                        <PlusIcon className="h-5 w-5" />
                      </button>
                      <button className="bg-white/20 hover:bg-white/30 text-white p-3 transition-colors">
                        <StarIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Button States</h3>
                    <div className="space-y-3">
                      <button className="btn-primary">Normal</button>
                      <button className="btn-primary hover:shadow-lg">Hover</button>
                      <button className="btn-primary opacity-50 cursor-not-allowed" disabled>
                        Disabled
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Forms Section */}
          <section id="forms" className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">Form Elements</h2>
              <p className="text-gray-300 mb-6">
                Form inputs and controls designed for the dark theme with proper focus states.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Text Input</label>
                    <input 
                      type="text" 
                      placeholder="Enter text..."
                      className="w-full bg-gray-800 border border-gray-700 px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-white focus:border-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Select Dropdown</label>
                    <select className="w-full bg-gray-800 border border-gray-700 px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-white focus:border-white">
                      <option>All Genres</option>
                      <option>Action</option>
                      <option>Comedy</option>
                      <option>Drama</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Search Input</label>
                    <div className="relative">
                      <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input 
                        type="text" 
                        placeholder="Search movies, TV shows..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-white focus:border-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-white mb-3">Radio Buttons</label>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="radio" name="type" className="w-4 h-4 text-red-600 bg-gray-800 border-gray-700" />
                        <span className="text-sm text-gray-300">All Content</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="radio" name="type" className="w-4 h-4 text-red-600 bg-gray-800 border-gray-700" />
                        <span className="text-sm text-gray-300">Movies Only</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="radio" name="type" className="w-4 h-4 text-red-600 bg-gray-800 border-gray-700" />
                        <span className="text-sm text-gray-300">TV Shows Only</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-3">Checkboxes</label>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 text-red-600 bg-gray-800 border-gray-700" />
                        <span className="text-sm text-gray-300">Include Adult Content</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 text-red-600 bg-gray-800 border-gray-700" />
                        <span className="text-sm text-gray-300">Show Subtitles</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Content Cards Section */}
          <section id="cards" className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">Content Cards</h2>
              <p className="text-gray-300 mb-6">
                16:9 aspect ratio cards designed for optimal content discovery and browsing experience.
              </p>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Standard Content Cards</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-1">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div key={i} className="relative group cursor-pointer transition-transform duration-200 hover:scale-105">
                        <div className="aspect-video relative overflow-hidden bg-gray-900">
                          <Image
                            src={`https://picsum.photos/400/225?random=${i + 1}`}
                            alt={`Content ${i + 1}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
                          />
                          
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <div className="absolute bottom-0 left-0 right-0 p-2">
                              <h3 className="text-white font-medium text-xs line-clamp-2">
                                Content Title {i + 1}
                              </h3>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Card Hover States</h3>
                  <div className="bg-gray-900 p-6 border border-gray-800">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <h4 className="text-white font-medium mb-2">Default State</h4>
                        <p className="text-gray-400">Clean 16:9 aspect ratio with image only</p>
                      </div>
                      <div>
                        <h4 className="text-white font-medium mb-2">Hover State</h4>
                        <p className="text-gray-400">Scale(1.05) transform with gradient overlay</p>
                      </div>
                      <div>
                        <h4 className="text-white font-medium mb-2">Interactive</h4>
                        <p className="text-gray-400">Title appears with smooth fade animation</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Navigation Section */}
          <section id="navigation" className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">Navigation</h2>
              <p className="text-gray-300 mb-6">
                Fixed navigation header with Netflix-inspired layout and consistent link styling.
              </p>
              
              <div className="space-y-6">
                <div className="bg-gray-900 p-6 border border-gray-800">
                  <h3 className="text-lg font-semibold text-white mb-4">Navigation Bar Example</h3>
                  <div className="bg-black p-4 border border-gray-700">
                    <div className="flex items-center justify-between">
                      {/* Logo */}
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-r from-red-600 to-orange-500 rounded-lg flex items-center justify-center mr-2">
                          <span className="text-white font-bold text-lg">C</span>
                        </div>
                        <span className="text-white text-xl font-bold">CSN</span>
                      </div>

                      {/* Navigation Links */}
                      <div className="hidden md:flex items-center space-x-6">
                        <a href="#" className="text-white text-sm font-medium">Home</a>
                        <a href="#" className="text-gray-300 hover:text-white text-sm font-medium transition-colors">TV Shows</a>
                        <a href="#" className="text-gray-300 hover:text-white text-sm font-medium transition-colors">Movies</a>
                        <a href="#" className="text-gray-300 hover:text-white text-sm font-medium transition-colors">New & Popular</a>
                        <a href="#" className="text-gray-300 hover:text-white text-sm font-medium transition-colors">My List</a>
                      </div>

                      {/* Right Side Icons */}
                      <div className="flex items-center space-x-4">
                        <button className="text-white hover:text-gray-300 transition-colors">
                          <MagnifyingGlassIcon className="h-6 w-6" />
                        </button>
                        <button className="text-white hover:text-gray-300 transition-colors">
                          <BellIcon className="h-6 w-6" />
                        </button>
                        <button className="text-white hover:text-gray-300 transition-colors">
                          <UserCircleIcon className="h-8 w-8" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-900 p-6 border border-gray-800">
                  <h3 className="text-lg font-semibold text-white mb-4">Link States</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-4">
                      <span className="w-16 text-xs text-gray-400">Active:</span>
                      <span className="text-white text-sm font-medium">Home</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="w-16 text-xs text-gray-400">Default:</span>
                      <span className="text-gray-300 text-sm font-medium">TV Shows</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="w-16 text-xs text-gray-400">Hover:</span>
                      <span className="text-white text-sm font-medium">Movies</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Hero Section */}
          <section id="hero" className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">Hero Section</h2>
              <p className="text-gray-300 mb-6">
                Full-screen hero section with Netflix-style gradients and left-aligned content layout.
              </p>
              
              <div className="bg-gray-900 p-6 border border-gray-800">
                <h3 className="text-lg font-semibold text-white mb-4">Hero Layout Example</h3>
                <div className="relative h-96 overflow-hidden bg-gray-800">
                  <Image
                    src="https://picsum.photos/1200/400?random=hero"
                    alt="Hero Background"
                    fill
                    className="object-cover"
                    sizes="100vw"
                  />
                  
                  {/* Netflix-style gradients */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  
                  {/* Content */}
                  <div className="relative z-10 flex items-center h-full px-8">
                    <div className="max-w-xl">
                      <h1 className="text-4xl font-bold text-white leading-tight mb-4">
                        Featured Content Title
                      </h1>
                      
                      <div className="flex items-center space-x-4 text-white/90 mb-4">
                        <span className="text-green-500 font-semibold">95% Match</span>
                        <span className="border border-gray-400 px-1 text-xs">TV-MA</span>
                        <span>2024</span>
                        <span>Series</span>
                      </div>
                      
                      <p className="text-lg text-white/90 leading-relaxed mb-6 line-clamp-3">
                        This is a sample description for the featured content that would appear in the hero section.
                      </p>
                      
                      <div className="flex items-center space-x-4">
                        <button className="bg-white text-black font-semibold px-8 py-3 flex items-center space-x-2 hover:bg-white/80 transition-colors">
                          <PlayIconSolid className="h-5 w-5" />
                          <span>Play</span>
                        </button>
                        <button className="bg-gray-600/70 text-white font-semibold px-8 py-3 flex items-center space-x-2 hover:bg-gray-600/40 transition-colors">
                          <InformationCircleIcon className="h-5 w-5" />
                          <span>More Info</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Loading States Section */}
          <section id="loading" className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">Loading States</h2>
              <p className="text-gray-300 mb-6">
                Smooth loading animations and skeleton states for better perceived performance.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Pulse Animation</h3>
                    <div className="space-y-3">
                      <div className="h-6 bg-gray-700 loading-pulse"></div>
                      <div className="h-4 bg-gray-700 w-3/4 loading-pulse"></div>
                      <div className="h-4 bg-gray-700 w-1/2 loading-pulse"></div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Button Loading</h3>
                    <button className="btn-primary opacity-75 cursor-not-allowed">
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Loading...</span>
                      </div>
                    </button>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Image Loading (Shimmer)</h3>
                    <div className="aspect-video image-loading"></div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Card Skeleton</h3>
                    <div className="grid grid-cols-3 gap-1">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i}>
                          <div className="aspect-video bg-gray-800 loading-pulse"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Animations Section */}
          <section id="animations" className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">Animations & Transitions</h2>
              <p className="text-gray-300 mb-6">
                Smooth transitions and hover effects that enhance the user experience without being distracting.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Hover Effects</h3>
                    <div className="space-y-4">
                      <div className="bg-gray-800 p-4 hover:scale-105 transition-transform duration-200 cursor-pointer">
                        <div className="text-white text-sm">Hover to scale (1.05)</div>
                      </div>
                      <div className="bg-gray-800 p-4 hover:bg-gray-700 transition-colors duration-300 cursor-pointer">
                        <div className="text-white text-sm">Hover to change color</div>
                      </div>
                      <div className="bg-gray-800 p-4 hover:shadow-lg transition-shadow duration-300 cursor-pointer">
                        <div className="text-white text-sm">Hover for shadow</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Carousel Controls</h3>
                    <div className="flex items-center space-x-4">
                      <button className="bg-black/70 hover:bg-black/90 text-white p-2 transition-all duration-300 hover:scale-110">
                        <ChevronLeftIcon className="h-6 w-6" />
                      </button>
                      <button className="bg-black/70 hover:bg-black/90 text-white p-2 transition-all duration-300 hover:scale-110">
                        <ChevronRightIcon className="h-6 w-6" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Transition Timing</h3>
                    <div className="space-y-2 text-sm text-gray-300">
                      <div>• Fast (150ms): Quick interactions</div>
                      <div>• Normal (300ms): Standard transitions</div>
                      <div>• Slow (500ms): Dramatic effects</div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Easing Functions</h3>
                    <div className="space-y-2 text-sm text-gray-300">
                      <div>• ease: Standard cubic-bezier</div>
                      <div>• ease-in-out: Smooth acceleration</div>
                      <div>• cubic-bezier(0.4, 0, 0.6, 1): Custom easing</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Code Examples */}
          <section className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">Implementation Examples</h2>
              <p className="text-gray-300 mb-6">
                Common code patterns and Tailwind class combinations used throughout the platform.
              </p>
              
              <div className="space-y-6">
                <div className="bg-gray-900 p-6 border border-gray-800">
                  <h3 className="text-lg font-semibold text-white mb-4">Container Pattern</h3>
                  <pre className="bg-black p-4 text-green-400 text-sm overflow-x-auto">
{`<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  {/* Content */}
</div>`}
                  </pre>
                </div>

                <div className="bg-gray-900 p-6 border border-gray-800">
                  <h3 className="text-lg font-semibold text-white mb-4">Content Card</h3>
                  <pre className="bg-black p-4 text-green-400 text-sm overflow-x-auto">
{`<div className="relative group cursor-pointer transition-transform duration-200 hover:scale-105">
  <div className="aspect-video relative overflow-hidden bg-gray-900">
    <Image src={imageUrl} alt={title} fill className="object-cover" />
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
      <div className="absolute bottom-0 left-0 right-0 p-2">
        <h3 className="text-white font-medium text-xs line-clamp-2">{title}</h3>
      </div>
    </div>
  </div>
</div>`}
                  </pre>
                </div>

                <div className="bg-gray-900 p-6 border border-gray-800">
                  <h3 className="text-lg font-semibold text-white mb-4">Responsive Grid</h3>
                  <pre className="bg-black p-4 text-green-400 text-sm overflow-x-auto">
{`<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-1">
  {/* Grid items */}
</div>`}
                  </pre>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}