package com.dailycodework.dreamshops.service.order;

import com.dailycodework.dreamshops.enums.OrderStatus;
import com.dailycodework.dreamshops.exception.ResourceNotFoundException;
import com.dailycodework.dreamshops.model.Cart;
import com.dailycodework.dreamshops.model.Order;
import com.dailycodework.dreamshops.model.OrderItem;
import com.dailycodework.dreamshops.model.Product;
import com.dailycodework.dreamshops.repository.OrderRepository;
import com.dailycodework.dreamshops.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService implements IOrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;


    @Override
    public Order placeOrder(Long userId) {
        return null;
    }

    private Order createOrder(Cart cart) {
        Order order = new Order();
        // set the user
        order.setOrderStatus(OrderStatus.PENDING);
        order.setOrderDate(LocalDate.now());
        return order;
    }


    private List<OrderItem> createOrderItems(Order order, Cart cart) {
        return cart.getItems().stream()
                .map(cartItem -> {
                Product product = cartItem.getProduct();
                product.setInventory(product.getInventory() - cartItem.getQuantity());
                productRepository.save(product);
                return new OrderItem(
                        order,
                        product,
                        cartItem.getQuantity(),
                        cartItem.getUnitPrice());
    }).toList();
    }


    private BigDecimal calculateTotalAmount(List<OrderItem> orderItemList) {
        return orderItemList.stream()
                .map(item -> item.getPrice()
                        .multiply(new BigDecimal(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }



    @Override
    public Order getOrder(Long OrderId) {
        return orderRepository.findById(OrderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
    }
}
