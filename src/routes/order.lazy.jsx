import Pizza from "../Pizza";
import Cart from "../Cart";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useContext } from "react"; // need useContext
import { CartContext } from "../contexts";


export const Route = createLazyFileRoute("/order")({
  component: Order,
});


const intl = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});
 function Order() {
  // const pizzaType = "pepperoni";
  // const pizzaSize = "M";
  const [pizzaType, setpizzaType ] = useState("pepperoni")
  const [pizzaSize, setPzzaSize] = useState("M")
  const [pizzaTypes, setPizzaTypes] = useState([]);
  const [cart, setCart] = useContext(CartContext);
const [loading, setLoading] = useState(true);

async function checkout() {
  setLoading(true);

  await fetch("/api/order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      cart,
    }),
  });

  setCart([]);
  setLoading(false);
}


let price, selectedPizza;
if(!loading){
  selectedPizza = pizzaTypes.find((pizza) => pizzaType === pizza.id)
  price = intl.format(selectedPizza.sizes[pizzaSize])
}

async function fetchPizzaTypes() {
  await new Promise((resolve) => setTimeout(resolve, 3000)); 

  const pizzasRes = await fetch("/api/pizzas");
  const pizzasJson = await pizzasRes.json();
  setPizzaTypes(pizzasJson);
  setLoading(false);
}

useEffect(() => {
  fetchPizzaTypes();
}, []);


  return (
    <div className="order">
      <h2>Create Order</h2>
      <form
  onSubmit={(e) => {
    e.preventDefault();
    setCart([...cart, { pizza: selectedPizza, size: pizzaSize, price }]);
  }}
>
        <div>
          <div>
            <label htmlFor="pizza-type">Pizza Type</label>
            <select
            onChange={(e)=>setpizzaType(e.target.value)}
            name="pizza-type" value={pizzaType}>
             {
  pizzaTypes.map((pizza) => (
    <option key={pizza.id} value={pizza.id}>
      {pizza.name}
    </option>
  ))}
            </select>
          </div> 
          <div>
            <label htmlFor="pizza-size">Pizza Size</label>
            <div >
              <span>
                <input
                  checked={pizzaSize === "S"}
                  type="radio"
                  name="pizza-size"
                  value="S"
                  onChange={(e)=> setPzzaSize(e.target.value)}
                  id="pizza-s"
                />
                <label htmlFor="pizza-s">Small</label>
              </span>
              <span>
                <input
                  checked={pizzaSize === "M"}
                  type="radio"
                  name="pizza-size"
                  value="M"
                  onChange={(e)=> setPzzaSize(e.target.value)}
                  id="pizza-m"
                />
                <label htmlFor="pizza-m">Medium</label>
              </span>
              <span>
                <input
                  checked={pizzaSize === "L"}
                  type="radio"
                  name="pizza-size"
                  value="L"
                  onChange={(e)=> setPzzaSize(e.target.value)}
                  id="pizza-l"
                />
                <label htmlFor="pizza-l">Large</label>
              </span>
            </div>
          </div>
          <button type="submit">Add to Cart</button>
        </div>
        {
    loading ? (
      <h3>Loading...</h3>
    ) : (
      <div className="order-pizza">
        <Pizza
          name={selectedPizza.name}
          description={selectedPizza.description}
          image={selectedPizza.image}
        />
        <p>{price}</p>
      </div>
    )
  }
</form>
{
  loading ? <h2>LOADING …</h2> : <Cart checkout={checkout} cart={cart} />
}
    </div>
  );
}