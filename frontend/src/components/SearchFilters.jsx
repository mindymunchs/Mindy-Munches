import { useState, useEffect } from 'react'
//eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion'

const SearchFilters = ({
  products,
  onFilteredProducts,
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy,
  showFilters,
  setShowFilters
}) => {
  // CHANGED: Set initial max price to 5000
  const [priceRange, setPriceRange] = useState([0, 5000])
  const [selectedRating, setSelectedRating] = useState(0)
  const [inStockOnly, setInStockOnly] = useState(false)
  const [featuredOnly, setFeaturedOnly] = useState(false)
  const [categories, setCategories] = useState(['All']) // Dynamic categories

  // Extract unique categories from products data
  useEffect(() => {
    if (products.length > 0) {
      console.log('Products data sample:', products[0]) // Debug log
      
      const uniqueCategories = new Set(['All']) // Start with 'All'
      
      products.forEach(product => {
        if (product.category) {
          // Handle different category formats
          let categoryName = product.category
          
          if (typeof product.category === 'object') {
            categoryName = product.category.name || product.category.title || product.category.label
          }
          
          if (categoryName && categoryName !== 'All') {
            uniqueCategories.add(categoryName)
          }
        }
      })
      
      const categoriesArray = Array.from(uniqueCategories)
      console.log('Extracted categories:', categoriesArray) // Debug log
      setCategories(categoriesArray)
    }
  }, [products])

  const sortOptions = [
    { value: 'name', label: 'Name A-Z' },
    { value: 'name-desc', label: 'Name Z-A' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'featured', label: 'Featured First' },
    { value: 'newest', label: 'Newest First' }
  ]

  // CHANGED: Calculate price range based on products with max cap of 5000
  useEffect(() => {
    if (products.length > 0) {
      const prices = products.map(p => p.price || 0).filter(price => price > 0)
      if (prices.length > 0) {
        const minPrice = Math.min(...prices)
        const maxPrice = Math.min(Math.max(...prices), 5000) // Cap at 5000
        setPriceRange([0, maxPrice]) // Start from 0 to maxPrice (capped at 5000)
      }
    }
  }, [products])

  // Apply all filters
  useEffect(() => {
    if (!products.length || typeof onFilteredProducts !== 'function') {
      return
    }

    console.log('Applying filters:', {
      searchTerm,
      selectedCategory,
      totalProducts: products.length
    }) // Debug log

    let filtered = [...products]

    // Text search
    if (searchTerm && searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim()
      filtered = filtered.filter(product =>
        (product.name && product.name.toLowerCase().includes(searchLower)) ||
        (product.description && product.description.toLowerCase().includes(searchLower)) ||
        (product.category && 
          typeof product.category === 'string' && 
          product.category.toLowerCase().includes(searchLower)) ||
        (product.category && 
          typeof product.category === 'object' && 
          (product.category.name || product.category.title || '').toLowerCase().includes(searchLower))
      )
    }

    // Category filter - IMPROVED LOGIC
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(product => {
        if (!product.category) return false
        
        let productCategory = product.category
        
        // Handle object categories
        if (typeof product.category === 'object') {
          productCategory = product.category.name || product.category.title || product.category.label
        }
        
        // Convert to string and compare
        const categoryStr = String(productCategory).trim()
        const selectedStr = String(selectedCategory).trim()
        
        console.log('Comparing categories:', { productCategory: categoryStr, selectedCategory: selectedStr }) // Debug log
        
        return categoryStr === selectedStr
      })
    }

    console.log('After category filter:', filtered.length) // Debug log

    // Price range filter
    filtered = filtered.filter(product =>
      (product.price || 0) >= priceRange[0] && (product.price || 0) <= priceRange[1]
    )

    // Rating filter
    if (selectedRating > 0) {
      filtered = filtered.filter(product => (product.rating || 5) >= selectedRating)
    }

    // Stock filter
    if (inStockOnly) {
      filtered = filtered.filter(product => (product.stock || 0) > 0)
    }

    // Featured filter
    if (featuredOnly) {
      filtered = filtered.filter(product => product.featured || product.isFeatured)
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return (a.name || '').localeCompare(b.name || '')
        case 'name-desc':
          return (b.name || '').localeCompare(a.name || '')
        case 'price-low':
          return (a.price || 0) - (b.price || 0)
        case 'price-high':
          return (b.price || 0) - (a.price || 0)
        case 'rating':
          return (b.rating || 5) - (a.rating || 5)
        case 'featured':
          const aFeatured = a.featured || a.isFeatured ? 1 : 0
          const bFeatured = b.featured || b.isFeatured ? 1 : 0
          return bFeatured - aFeatured
        case 'newest':
          const dateA = new Date(a.createdAt || a.dateAdded || a.created || 0)
          const dateB = new Date(b.createdAt || b.dateAdded || b.created || 0)
          return dateB - dateA
        default:
          return 0
      }
    })

    console.log('Final filtered products:', filtered.length) // Debug log
    onFilteredProducts(filtered)
  }, [
    products,
    searchTerm,
    selectedCategory,
    priceRange,
    selectedRating,
    inStockOnly,
    featuredOnly,
    sortBy,
    onFilteredProducts
  ])

  const formatPrice = (price) => {
    return `₹${price.toLocaleString('en-IN')}`
  }

  // CHANGED: Update clearAllFilters to use 5000 as max
  const clearAllFilters = () => {
    setSearchTerm('')
    setSelectedCategory('All')
    setSortBy('name')
    setPriceRange([0, 5000]) // Changed from 50000 to 5000
    setSelectedRating(0)
    setInStockOnly(false)
    setFeaturedOnly(false)
  }

  // CHANGED: Update hasActiveFilters check for 5000 max
  const hasActiveFilters = searchTerm || 
    selectedCategory !== 'All' || 
    sortBy !== 'name' || 
    priceRange[0] !== 0 || 
    priceRange[1] !== 5000 || // Changed from 50000 to 5000
    selectedRating > 0 || 
    inStockOnly || 
    featuredOnly

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
      {/* Debug info - Remove in production */}
      
      {/* Search and Sort Row */}
      <div className="flex flex-col lg:flex-row gap-4 items-center mb-6">
        {/* Search Input */}
        <div className="flex-1 min-w-0">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="text-sm font-medium text-gray-700 whitespace-nowrap">
            Sort by:
          </label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Filter Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
          </svg>
          Filters
          {hasActiveFilters && (
            <span className="bg-primary-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              !
            </span>
          )}
        </button>
      </div>

      {/* Advanced Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t pt-6 space-y-6"
          >
            {/* Category and Quick Filters Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Category Filter - NOW DYNAMIC */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category ({categories.length - 1} available)
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    console.log('Category changed to:', e.target.value) // Debug log
                    setSelectedCategory(e.target.value)
                  }}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Rating Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Rating
                </label>
                <select
                  value={selectedRating}
                  onChange={(e) => setSelectedRating(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value={0}>Any Rating</option>
                  <option value={4}>4+ Stars</option>
                  <option value={4.5}>4.5+ Stars</option>
                </select>
              </div>

              {/* Quick Filters */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Quick Filters
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">In Stock Only</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={featuredOnly}
                    onChange={(e) => setFeaturedOnly(e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Featured Only</span>
                </label>
              </div>

              {/* CHANGED: Price Range - Updated max to 5000 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Price: {formatPrice(priceRange[1])}
                </label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="5000" // CHANGED: Maximum value set to 5000
                    step="50" // CHANGED: Step size to 50 for smoother control
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([0, Number(e.target.value)])}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>₹0</span>
                    <span>₹5,000</span> {/* CHANGED: Display max as 5,000 */}
                  </div>
                </div>
              </div>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <div className="pt-4 border-t">
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-gray-600 hover:text-gray-800 underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default SearchFilters
