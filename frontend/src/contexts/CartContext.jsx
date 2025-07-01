//React Hooks
import { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
    return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
    // Initialize cartItems from localStorage if available, otherwise use an empty array
    const getInitialCart = () => {
        const savedCart = localStorage.getItem('cartItems');
        return savedCart ? JSON.parse(savedCart) : [];
    };

    const [cartItems, setCartItems] = useState(getInitialCart);

    // Effect to sync cartItems with localStorage whenever it changes
    useEffect(() => {
        if (cartItems.length > 0) {
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
        } else {
            console.log('Cart is empty, removing from localStorage.');
            localStorage.removeItem('cartItems');
        }
    }, [cartItems]); // This will run whenever cartItems changes

    const addToCart = (item) => {
      let status = { type: 'added', remaining: null }; // return object now
    
      setCartItems((prevItems) => {
        let itemFound = false;
        const updatedCartItems = prevItems.map(cartItem => {
          if (cartItem.id === item.id && cartItem.name === item.name) {
            itemFound = true;
            const currentQuantity = cartItem.quantity;
            const newQuantity = currentQuantity + item.quantity;
    
            if (newQuantity > 10) {
              status = { type: 'maxReached', remaining: 10 - currentQuantity };
              return cartItem; // ❗ DON'T CHANGE anything
            }
    
            return { ...cartItem, quantity: newQuantity };
          }
          return cartItem;
        });
    
        if (!itemFound) {
          const quantityToAdd = Math.min(item.quantity, 10);
    
          if (quantityToAdd > 10) {
            status = { type: 'maxReached', remaining: 0 };
            return prevItems; // ❗ Don't add anything
          }
    
          updatedCartItems.push({ ...item, quantity: quantityToAdd });
        }
    
        return updatedCartItems;
      });
    
      return status;
    };     
    
    const removeFromCart = (_id) => {
        console.log('Removing item with id:', _id);
        setCartItems((prevItems) => {
            const updatedCartItems = prevItems.filter(item => item._id !== _id);
            console.log('Updated cart after removal:', updatedCartItems);
            return updatedCartItems;
        });
    };

    const clearCart = () => {
        console.log('Clearing the cart');
        setCartItems([]); // Clear the cart state
    };

    const updateQuantity = (_id, quantity) => {
      setCartItems((prevItems) => {
        const updatedCartItems = prevItems.map(item =>
          item._id === _id ? { ...item, quantity } : item
        );
        return updatedCartItems;
      });
    };    

    const incrementQuantity = (_id) => {
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item._id === _id
            ? { ...item, quantity: Math.min(item.quantity + 1, 10) }
            : item
        )
      );
    };
    
    const decrementQuantity = (_id) => {
      setCartItems((prevItems) =>
        prevItems
          .map((item) =>
            item._id === _id
              ? { ...item, quantity: item.quantity - 1 }
              : item
          )
          .filter(item => item.quantity > 0)
      );
    };
    

    const cartTotal = cartItems.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);

    return (
        <CartContext.Provider value={{ 
          cartItems, 
          addToCart, 
          removeFromCart, 
          clearCart, 
          updateQuantity, 
          cartTotal, 
          incrementQuantity, 
          decrementQuantity
        }}>
            {children}
        </CartContext.Provider>
    );
};

export default CartProvider;
