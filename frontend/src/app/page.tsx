'use client'
import Image from 'next/image'
import { useState } from 'react'

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState('ALL')

  const categories = [
    'ALL',
    'NUTRITION',
    'PHYSICAL FITNESS',
    'WEIGHT LOSS',
    'SKIN HEALTH',
    'MENTAL HEALTH',
  ]

  const articles = [
    {
      id: 1,
      title: 'How Monitoring Glucose Levels Can Improve Skin Health',
      category: 'NUTRITION',
      desc: 'Real-time glucose monitoring provides insight into the physiology of weight gain and loss.',
      image: '/loginArt.jpg',
      featured: true,
    },
    {
      id: 2,
      title: 'The Power of Personalized Data: A Conversation With Todd Rose',
      category: 'NUTRITION',
      desc: 'Interview with Todd Rose, author and researcher exploring human individuality.',
      image: '/signupArt.jpg',
      featured: false,
    },
    {
      id: 3,
      title: 'Understanding Weight Loss: Why Tracking Glucose May Be More Insightful',
      category: 'WEIGHT LOSS',
      desc: 'Explore how glucose tracking may outperform calorie counting in long-term health goals.',
      image: '/loginArt.jpg',
      featured: false,
    },
    {
      id: 4,
      title: 'Do Alcohol and Metabolic Fitness Mix?',
      category: 'PHYSICAL FITNESS',
      desc: 'Discover how alcohol affects your metabolism and long-term health outcomes.',
      image: '/signupArt.jpg',
      featured: false,
    },
  ]

  const filteredArticles =
    activeCategory === 'ALL'
      ? articles
      : articles.filter((a) => a.category === activeCategory)
  return (
    <div className="min-h-screen bg-white text-gray-900 mb-4">
      {/* HERO SECTION */}
      <section className="max-w-6xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-6">
        {/* Main featured article */}
        <div className="relative md:col-span-2 rounded-xl  group">
          <Image
            src={articles[0].image}
            alt={articles[0].title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute bottom-0 p-6 text-white max-w-md">
            <p className="text-sm uppercase tracking-wide opacity-90 mb-2">{articles[0].category}</p>
            <h1 className="text-2xl md:text-3xl font-bold mb-3">{articles[0].title}</h1>
            <p className="text-sm opacity-90 mb-3">{articles[0].desc}</p>
            <button className="bg-white text-gray-900 font-medium px-4 py-2 rounded-lg hover:bg-gray-200">
              Read more
            </button>
          </div>
        </div>

        {/* Two sub-featured articles */}
        <div className="flex flex-col gap-6">
          {articles.slice(1, 3).map((a) => (
            <div
              key={a.id}
              className="bg-gray-50 border border-gray-200 rounded-xl p-6 hover:shadow-md transition"
            >
              <h3 className="font-semibold mb-2">{a.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{a.desc}</p>
              <button className="text-sm text-gray-900 font-medium hover:underline">
                Read more →
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORY FILTERS */}
      <section className="border-t border-gray-200 py-6">
        <div className="max-w-6xl mx-auto px-6 flex flex-wrap gap-4 text-sm font-medium">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-full transition ${
                activeCategory === cat
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* ALL ARTICLES SECTION */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-bold mb-8">All Articles</h2>
        <div className="flex flex-col gap-10">
          {filteredArticles.map((a) => (
            <div
              key={a.id}
              className="grid md:grid-cols-2 gap-6 items-center border-b border-gray-100 pb-6"
            >
              <div className="relative h-56 md:h-64 rounded-xl overflow-hidden">
                <Image
                  src={a.image}
                  alt={a.title}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">{a.category}</p>
                <h3 className="text-xl font-semibold mb-2">{a.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{a.desc}</p>
                <button className="text-sm font-medium text-gray-900 hover:underline">
                  Read more →
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
