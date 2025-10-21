package com.uade.tpo.demo.controllers;

import com.uade.tpo.demo.entity.Pedido;
import com.uade.tpo.demo.entity.User;
import com.uade.tpo.demo.entity.EstadoPedido;
import com.uade.tpo.demo.service.PedidoService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/pedidos")
public class PedidoController {

    private final PedidoService pedidoService;

    public PedidoController(PedidoService pedidoService) {
        this.pedidoService = pedidoService;
    }

    // ... (métodos POST, GET all, GET by id, etc. existentes)

    @GetMapping
    public ResponseEntity<List<Pedido>> getAllPedidos() {
        return ResponseEntity.ok(pedidoService.getAllPedidos());
    }

    // NUEVO ENDPOINT PARA CLIENTES
    @GetMapping("/mis-pedidos")
    public ResponseEntity<List<Pedido>> getMisPedidos(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        List<Pedido> pedidos = pedidoService.getPedidosByClienteId(user.getIdCliente());
        return ResponseEntity.ok(pedidos);
    }

    // NUEVO ENDPOINT PARA ADMIN
    @PatchMapping("/{id}/estado")
    public ResponseEntity<Pedido> updateEstadoPedido(@PathVariable Long id, @RequestBody Map<String, String> body) {
        try {
            EstadoPedido nuevoEstado = EstadoPedido.valueOf(body.get("estado"));
            Pedido pedidoActualizado = pedidoService.updatePedidoEstado(id, nuevoEstado);
            return ResponseEntity.ok(pedidoActualizado);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build(); // Si el estado no es válido
        }
    }
}