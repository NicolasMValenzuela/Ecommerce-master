package com.uade.tpo.demo.service;

import com.uade.tpo.demo.entity.EstadoPedido;
import com.uade.tpo.demo.entity.Pedido;

import java.util.List;
import java.util.Optional;

public interface PedidoService {
    Pedido createPedido(Pedido pedido);
    List<Pedido> getAllPedidos();
    Optional<Pedido> getPedidoById(Long id);
    Pedido updatePedido(Long id, Pedido pedidoDetails);
    void deletePedido(Long id);
    Pedido updatePedidoEstado(Long id, EstadoPedido estado);
    List<Pedido> getPedidosByClienteId(Long clienteId);
}
