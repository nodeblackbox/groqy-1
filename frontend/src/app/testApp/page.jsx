"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingCart, User, LogIn, LogOut } from "lucide-react";

// Dummy product data
const products = [
  {
    id: 1,
    name: "Smart Home Hub",
    price: 129.99,
    image:
      "https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=500&h=500&fit=crop",
  },
  {
    id: 2,
    name: "Wireless Earbuds",
    price: 89.99,
    image:
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&h=500&fit=crop",
  },
  {
    id: 3,
    name: "Fitness Tracker",
    price: 59.99,
    image:
      "https://images.unsplash.com/photo-1557438159-51eec7a6c9e8?w=500&h=500&fit=crop",
  },
  {
    id: 4,
    name: "Portable Charger",
    price: 39.99,
    image:
      "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500&h=500&fit=crop",
  },
];

export default function ProductStore() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">TechGadgets</h1>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="relative">
              <ShoppingCart className="h-6 w-6" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </Button>
            {isLoggedIn ? (
              <Button variant="ghost" onClick={() => setIsLoggedIn(false)}>
                <LogOut className="h-6 w-6 mr-2" />
                Logout
              </Button>
            ) : (
              <Button variant="ghost" onClick={() => setIsLoggedIn(true)}>
                <LogIn className="h-6 w-6 mr-2" />
                Login
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="flex flex-col justify-between">
              <CardHeader>
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-md"
                />
                <CardTitle className="mt-4">{product.name}</CardTitle>
                <CardDescription>${product.price.toFixed(2)}</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button className="w-full" onClick={() => addToCart(product)}>
                  Add to Cart
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>

      <footer className="bg-white shadow-md mt-12">
        <div className="container mx-auto px-4 py-6">
          <Tabs defaultValue="cart" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="cart">Shopping Cart</TabsTrigger>
              <TabsTrigger value="checkout">Checkout</TabsTrigger>
            </TabsList>
            <TabsContent value="cart">
              <Card>
                <CardHeader>
                  <CardTitle>Your Cart</CardTitle>
                  <CardDescription>
                    You have {cart.length} item(s) in your cart
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center"
                    >
                      <span>{item.name}</span>
                      <div>
                        <span className="mr-4">${item.price.toFixed(2)}</span>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removeFromCart(item.id)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
                <CardFooter>
                  <div className="w-full text-right">
                    <p className="text-lg font-semibold">
                      Total: ${totalPrice.toFixed(2)}
                    </p>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="checkout">
              <Card>
                <CardHeader>
                  <CardTitle>Checkout</CardTitle>
                  <CardDescription>Complete your purchase</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="space-y-1">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" placeholder="John Doe" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" placeholder="john@example.com" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="card">Card Number</Label>
                    <Input id="card" placeholder="4111 1111 1111 1111" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">
                    Pay ${totalPrice.toFixed(2)}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </footer>
    </div>
  );
}
