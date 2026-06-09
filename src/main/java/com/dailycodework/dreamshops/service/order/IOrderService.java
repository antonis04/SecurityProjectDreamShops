package com.dailycodework.dreamshops.service.order;

import com.dailycodework.dreamshops.model.Order;

import java.util.List;

public interface IOrderService {

    Order placeOrder(Long userId);

    Order getOrder(Long OrderId);

    List<Order> getUserOrders(Long userId);
}
