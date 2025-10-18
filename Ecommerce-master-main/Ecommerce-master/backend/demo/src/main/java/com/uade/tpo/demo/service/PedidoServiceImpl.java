package com.uade.tpo.demo.service;

import com.uade.tpo.demo.entity.Pedido;
import com.uade.tpo.demo.repository.PedidoRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class PedidoServiceImpl implements PedidoService {

    private final PedidoRepository pedidoRepository;

    public PedidoServiceImpl(PedidoRepository pedidoRepository) {
        this.pedidoRepository = pedidoRepository;
    }

    @Override
    public Pedido createPedido(Pedido pedido) {
        pedido.setFechaDeCreacion(LocalDateTime.now());
        // Suponiendo que el costoTotal ya viene calculado o lo calculas aquí
        return pedidoRepository.save(pedido);
    }

    @Override
    public List<Pedido> getAllPedidos() {
        return pedidoRepository.findAll();
    }

    @Override
    public Optional<Pedido> getPedidoById(Long id) {
        return pedidoRepository.findById(id);
    }

    @Override
    public Pedido updatePedido(Long id, Pedido pedidoDetails) {
        Pedido pedido = pedidoRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Pedido not found"));
        // No actualizamos fechaDeCreacion
        pedido.setCostoTotal(pedidoDetails.getCostoTotal());
        pedido.setCliente(pedidoDetails.getCliente());
        pedido.setVehiculos(pedidoDetails.getVehiculos());
        pedido.setFormaDePago(pedidoDetails.getFormaDePago());
        return pedidoRepository.save(pedido);
    }

    @Override
    public void deletePedido(Long id) {
        pedidoRepository.deleteById(id);
    }
}