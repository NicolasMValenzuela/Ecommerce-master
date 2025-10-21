package com.uade.tpo.demo.entity;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "pedido")
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idPedido") // nombre en snake_case
    private Long idPedido;

    @Builder.Default
    @Column(name = "fechaDeCreacion", nullable = false)
    private LocalDateTime fechaDeCreacion = LocalDateTime.now();

    @Column(name = "costoTotal", nullable = false)
    private Double costoTotal;

    @ManyToOne
    @JoinColumn(name = "idCliente", nullable = false) // FK a users
    private User cliente;

    @ManyToMany
    @JoinTable(
    name = "pedido_vehiculo", 
    joinColumns = @JoinColumn(name = "idPedido"), 
    inverseJoinColumns = @JoinColumn(name = "idVehiculo"))
    private List<Vehiculo> vehiculos;

    @ManyToOne
    @JoinColumn(name = "idVehiculo", nullable = true) // FK directa para vehículo principal/referencia
    private Vehiculo vehiculoPrincipal;

    @ManyToOne
    @JoinColumn(name = "idFormadePago", nullable = false) // FK a formas_de_pago
    @Enumerated(EnumType.STRING)
    private FormaDePago formaDePago;

    @Builder.Default
    @Column(nullable = false)
    private String estado = "PENDIENTE_PAGO";
}
