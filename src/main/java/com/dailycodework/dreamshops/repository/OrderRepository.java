package com.dailycodework.dreamshops.repository;

import com.dailycodework.dreamshops.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {
}
