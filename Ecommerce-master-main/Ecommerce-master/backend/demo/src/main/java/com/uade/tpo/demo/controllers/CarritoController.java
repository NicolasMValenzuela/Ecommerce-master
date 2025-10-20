package com.uade.tpo.demo.controllers;

import com.uade.tpo.demo.entity.Carrito;
import com.uade.tpo.demo.entity.CarritoVehiculo;
import com.uade.tpo.demo.dto.CarritoDTO;
import com.uade.tpo.demo.dto.CarritoVehiculoDTO;
import com.uade.tpo.demo.entity.Pedido;
import com.uade.tpo.demo.entity.User;
import com.uade.tpo.demo.service.CarritoService;
import com.uade.tpo.demo.repository.FormaDePagoRepository;
import com.uade.tpo.demo.entity.FormaDePago;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/carritos")
@RequiredArgsConstructor
public class CarritoController {

    private final CarritoService carritoService;
    private final FormaDePagoRepository formaDePagoRepository;

    @PostMapping
    public ResponseEntity<CarritoDTO> createCarrito(@RequestBody Carrito carrito) {
        Carrito created = carritoService.createCarrito(carrito);
        CarritoDTO dto = mapToDto(created);
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CarritoDTO> getCarrito(@PathVariable Long id) {
        return carritoService.getCarritoById(id)
                .map(c -> ResponseEntity.ok(mapToDto(c)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/items")
    public ResponseEntity<CarritoDTO> addItem(@PathVariable Long id, @RequestBody CarritoVehiculo item) {
        Carrito updated = carritoService.addVehiculoToCarrito(id, item);
        return ResponseEntity.ok(mapToDto(updated));
    }

    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<Void> removeItem(@PathVariable Long itemId) {
        carritoService.removeItem(itemId);
        return ResponseEntity.noContent().build();
    }

    // Reemplaza el método checkout() existente por este:
    @PostMapping("/{id}/checkout")
    public ResponseEntity<Pedido> checkout(@PathVariable Long id, @RequestBody FormaDePago formaDePago) {
        // Primero, persistimos la forma de pago si es necesario.
        FormaDePago.TipoFormaDePago tipo = formaDePago.getFormaDePago();
        FormaDePago formaPersist = formaDePagoRepository.findByFormaDePago(tipo).orElseGet(() -> {
            return formaDePagoRepository.save(formaDePago);
        });

        // Llamamos al servicio con la lógica centralizada.
        Pedido nuevoPedido = carritoService.confirmarCarritoYGenerarPedido(id, formaPersist);
        return ResponseEntity.ok(nuevoPedido);
    }

    // Simple mapper to DTO to avoid serializing JPA entities and session issues
    private CarritoDTO mapToDto(Carrito c) {
        CarritoDTO dto = new CarritoDTO();
        dto.setIdCarrito(c.getIdCarrito());
        dto.setClienteId(c.getCliente() != null ? c.getCliente().getIdCliente() : null);
        if (c.getCarritoVehiculos() != null) {
            List<CarritoVehiculoDTO> items = new java.util.ArrayList<>();
            for (CarritoVehiculo iv : c.getCarritoVehiculos()) {
                CarritoVehiculoDTO ivd = new CarritoVehiculoDTO();
                ivd.setId(iv.getId());
                ivd.setValor(iv.getValor() != null ? iv.getValor().doubleValue() : null);
                ivd.setVehiculoId(iv.getVehiculo() != null ? iv.getVehiculo().getIdVehiculo() : null);
                items.add(ivd);
            }
            dto.setItems(items);
        }
        return dto;
    }

    @GetMapping("/mine")
    public ResponseEntity<CarritoDTO> getMyCarrito(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        Carrito carrito = carritoService.getOrCreateCarritoForUser(user);
        return ResponseEntity.ok(mapToDto(carrito));
}
}
