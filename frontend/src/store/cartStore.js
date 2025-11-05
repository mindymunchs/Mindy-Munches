import { create } from "zustand";
import { persist } from "zustand/middleware";

const useCartStore = create(
  persist(
    (set, get) => ({
      // State
      items: [],
      loading: false,
      error: null,
      isGuest: false,

      // ✅ Helper function to transform backend cart items
      transformCartItems: (backendItems) => {
        if (!backendItems || !Array.isArray(backendItems)) return [];

        return backendItems
          .map((item) => {
            const product = item.product || item;
            const productId = product._id || product.id || item._id || item.id;

            // ✅ Handle image being an object, array, or string
            let imageUrl = "";

            // Get raw image data
            const rawImage = product.images?.[0] || product.image || item.image;

            // Extract URL based on type
            if (typeof rawImage === "string") {
              imageUrl = rawImage;
            } else if (rawImage && typeof rawImage === "object") {
              // Handle image object (e.g., {url: "...", publicId: "..."})
              imageUrl =
                rawImage.url || rawImage.secure_url || rawImage.link || "";
            }

            console.log("Image transformation:", {
              name: product.name,
              rawImage: rawImage,
              finalUrl: imageUrl,
            });

            return {
              _id: productId,
              id: productId,
              name: product.name || item.name,
              price: item.price || product.price,
              image: imageUrl,
              category: product.category || item.category || "",
              quantity: item.quantity || 1,
              stock: product.stock || item.stock,
            };
          })
          .filter((item) => item.name && item.price);
      },

      // Fetch cart from backend (authenticated users only)
      fetchCart: async () => {
        try {
          set({ loading: true, error: null });

          const token = localStorage.getItem("token");
          if (!token) {
            set({ loading: false, isGuest: true });
            return;
          }

          const response = await fetch(`${import.meta.env.VITE_API_URL}/cart`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          if (!response.ok) {
            console.warn("Failed to fetch cart from backend, using local cart");
            set({ loading: false, isGuest: true });
            return;
          }

          const data = await response.json();
          if (data.success) {
            // ✅ Transform backend items before setting state
            const transformedItems = get().transformCartItems(
              data.data.cart.items
            );

            set({
              items: transformedItems,
              loading: false,
              isGuest: false,
            });
          }
        } catch (error) {
          console.error("Fetch cart error:", error);
          set({ error: error.message, loading: false, isGuest: true });
        }
      },

      // Helper method to add item locally
      addItemLocally: (product) => {
        const { items } = get();
        const existingItem = items.find(
          (item) => (item._id || item.id) === (product._id || product.id)
        );

        let newItems;
        if (existingItem) {
          newItems = items.map((item) =>
            (item._id || item.id) === (product._id || product.id)
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          // ✅ Extract image URL from object or array
          let imageUrl = "";
          const rawImage = product.images?.[0] || product.image;

          if (typeof rawImage === "string") {
            imageUrl = rawImage;
          } else if (rawImage && typeof rawImage === "object") {
            imageUrl =
              rawImage.url || rawImage.secure_url || rawImage.link || "";
          }

          const cartItem = {
            _id: product._id || product.id,
            id: product._id || product.id,
            name: product.name,
            price: product.price,
            image: imageUrl, // ✅ Now properly extracted
            category: product.category,
            quantity: 1,
          };
          newItems = [...items, cartItem];
        }

        set({
          items: newItems,
          loading: false,
          isGuest: true,
          error: null,
        });

        get().showSuccessNotification(product.name);
      },

      // Show success notification
      showSuccessNotification: (productName) => {
        const notification = document.createElement("div");
        notification.className =
          "fixed top-20 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 text-sm";
        notification.textContent = `${productName} added to cart!`;
        document.body.appendChild(notification);

        setTimeout(() => {
          if (document.body.contains(notification)) {
            document.body.removeChild(notification);
          }
        }, 3000);
      },

      // Add item to cart
      addItem: async (product) => {
        try {
          set({ loading: true, error: null });

          const token = localStorage.getItem("token");

          if (!token) {
            get().addItemLocally(product);
            return;
          }

          try {
            const response = await fetch(
              `${import.meta.env.VITE_API_URL}/cart/add`,
              {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  productId: product._id || product.id,
                  quantity: 1,
                }),
              }
            );

            const data = await response.json();

            if (!response.ok) {
              throw new Error(data.message || "Backend cart failed");
            }

            if (data.success) {
              // ✅ Transform backend items before setting state
              const transformedItems = get().transformCartItems(
                data.data.cart.items
              );

              set({
                items: transformedItems,
                loading: false,
                isGuest: false,
              });

              get().showSuccessNotification(product.name);
              return;
            }
          } catch (apiError) {
            console.warn(
              "Backend cart failed, using local cart:",
              apiError.message
            );
            get().addItemLocally(product);
            return;
          }
        } catch (error) {
          console.error("Add to cart error:", error);
          get().addItemLocally(product);
        }
      },

      // Remove item
      removeItem: async (productId) => {
        try {
          set({ loading: true, error: null });

          const token = localStorage.getItem("token");
          const { isGuest } = get();

          if (!token || isGuest) {
            const { items } = get();
            const newItems = items.filter(
              (item) => (item._id || item.id) !== productId
            );
            set({
              items: newItems,
              loading: false,
            });
            return;
          }

          try {
            const response = await fetch(
              `${import.meta.env.VITE_API_URL}/cart/remove/${productId}`,
              {
                method: "DELETE",
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
            );

            if (!response.ok) {
              throw new Error("Backend remove failed");
            }

            const data = await response.json();

            if (data.success) {
              // ✅ Transform backend items before setting state
              const transformedItems = get().transformCartItems(
                data.data.cart.items
              );

              set({
                items: transformedItems,
                loading: false,
              });
              return;
            }
          } catch (apiError) {
            console.warn(
              "Backend remove failed, using local removal:",
              apiError.message
            );
          }

          const { items } = get();
          const newItems = items.filter(
            (item) => (item._id || item.id) !== productId
          );
          set({
            items: newItems,
            loading: false,
            isGuest: true,
          });
        } catch (error) {
          console.error("Remove item error:", error);
          const { items } = get();
          const newItems = items.filter(
            (item) => (item._id || item.id) !== productId
          );
          set({
            items: newItems,
            loading: false,
            isGuest: true,
            error: null,
          });
        }
      },

      // Update quantity
      updateQuantity: async (productId, quantity) => {
        if (quantity < 1) return;

        try {
          set({ loading: true, error: null });

          const token = localStorage.getItem("token");
          const { isGuest } = get();

          if (!token || isGuest) {
            const { items } = get();
            const newItems = items.map((item) =>
              (item._id || item.id) === productId ? { ...item, quantity } : item
            );
            set({
              items: newItems,
              loading: false,
            });
            return;
          }

          try {
            const response = await fetch(
              `${import.meta.env.VITE_API_URL}/cart/update/${productId}`,
              {
                method: "PUT",
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ quantity }),
              }
            );

            if (!response.ok) {
              throw new Error("Backend update failed");
            }

            const data = await response.json();

            if (data.success) {
              // ✅ Transform backend items before setting state
              const transformedItems = get().transformCartItems(
                data.data.cart.items
              );

              set({
                items: transformedItems,
                loading: false,
              });
              return;
            }
          } catch (apiError) {
            console.warn(
              "Backend update failed, using local update:",
              apiError.message
            );
          }

          const { items } = get();
          const newItems = items.map((item) =>
            (item._id || item.id) === productId ? { ...item, quantity } : item
          );
          set({
            items: newItems,
            loading: false,
            isGuest: true,
          });
        } catch (error) {
          console.error("Update quantity error:", error);
          const { items } = get();
          const newItems = items.map((item) =>
            (item._id || item.id) === productId ? { ...item, quantity } : item
          );
          set({
            items: newItems,
            loading: false,
            isGuest: true,
            error: null,
          });
        }
      },

      // Clear cart
      clearCart: async () => {
        try {
          set({ loading: true, error: null });

          const token = localStorage.getItem("token");
          const { isGuest } = get();

          if (!token || isGuest) {
            set({
              items: [],
              loading: false,
            });
            return;
          }

          try {
            const response = await fetch(
              `${import.meta.env.VITE_API_URL}/cart/clear`,
              {
                method: "DELETE",
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
            );

            if (!response.ok) {
              throw new Error("Backend clear failed");
            }

            const data = await response.json();

            if (data.success) {
              set({
                items: [],
                loading: false,
              });
              return;
            }
          } catch (apiError) {
            console.warn(
              "Backend clear failed, using local clear:",
              apiError.message
            );
          }

          set({
            items: [],
            loading: false,
            isGuest: true,
          });
        } catch (error) {
          console.error("Clear cart error:", error);
          set({
            items: [],
            loading: false,
            isGuest: true,
            error: null,
          });
        }
      },

      // Sync local cart to backend when user logs in
      syncCartToBackend: async () => {
        const token = localStorage.getItem("token");
        const { items, isGuest } = get();

        if (!token || !isGuest || !items.length) {
          return;
        }

        try {
          set({ loading: true });

          for (const item of items) {
            try {
              await fetch(`${import.meta.env.VITE_API_URL}/cart/add`, {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  productId: item._id || item.id,
                  quantity: item.quantity,
                }),
              });
            } catch (itemError) {
              console.warn(`Failed to sync item ${item.name}:`, itemError);
            }
          }

          await get().fetchCart();
        } catch (error) {
          console.error("Cart sync error:", error);
          set({ loading: false });
        }
      },

      // Helper functions
      getTotal: () => {
        const { items } = get();
        return items.reduce((total, item) => {
          const price =
            typeof item.price === "number"
              ? item.price
              : parseFloat(item.price) || 0;
          return total + price * item.quantity;
        }, 0);
      },

      getItemCount: () => {
        const { items } = get();
        return items.reduce((count, item) => count + item.quantity, 0);
      },

      clearLocalCart: () => {
        set({ items: [], error: null, isGuest: false });
      },

      hasItems: () => {
        const { items } = get();
        return items.length > 0;
      },

      isGuestMode: () => {
        const { isGuest } = get();
        return isGuest;
      },

      forceLocalMode: () => {
        set({ isGuest: true });
      },
    }),
    {
      name: "cart-storage",
      version: 3, // ✅ Increment version to clear old cached data
    }
  )
);

export default useCartStore;
