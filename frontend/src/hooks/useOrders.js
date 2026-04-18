import { useState, useEffect } from 'react'
import useAuthStore from '../store/authStore'

export const useOrders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const { user, token, isAuthenticated } = useAuthStore()

  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated || (!user?._id && !user?.id) || !token) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`${import.meta.env.VITE_API_URL}/orders`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || `HTTP ${response.status}`)
        }

        const data = await response.json()
        const ordersArray = data.data?.orders || data.orders || []
        setOrders(Array.isArray(ordersArray) ? ordersArray : [])

      } catch (err) {
        console.error('Error fetching orders:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [user?._id || user?.id, token, isAuthenticated, refreshKey])

  const currentOrders = orders.filter(order =>
    ['pending', 'confirmed', 'processing', 'shipped'].includes(order.orderStatus)
  )

  const completedOrders = orders.filter(order =>
    ['delivered', 'cancelled'].includes(order.orderStatus)
  )

  const refetch = () => {
    if (isAuthenticated && (user?._id || user?.id) && token) {
      setError(null)
      setRefreshKey(k => k + 1)
    }
  }

  return {
    orders,
    currentOrders,
    completedOrders,
    loading,
    error,
    refetch
  }
}
