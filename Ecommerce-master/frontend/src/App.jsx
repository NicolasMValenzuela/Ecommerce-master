import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./Views/Navbar";
import Catalogo from "./Views/Catalogo";
import Login from "./components/Login";
import Contacto from "./Views/Contacto";
import Inicio from './Views/Inicio';
import AboutUs from './Views/AboutUs';
import Registrarse from "./Views/Registrarse";
import AutoDetalle from "./Views/AutoDetalle";
import Carrito from "./Views/Carrito";
import { CarritoProvider } from "./context/CarritoContext";

function App() {
  return (
    <CarritoProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/login" element={<Login />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/Inicio" element={<Inicio />} />
        <Route path="/Nosotros" element={<AboutUs />} />
        <Route path="/registrarse" element={<Registrarse />} />
        <Route path="/catalogo/:id" element={<AutoDetalle />} />
        <Route path="/carrito" element={<Carrito />} />
      </Routes>
    </CarritoProvider>
  );
}

export default App;
