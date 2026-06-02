package com.dailycodework.dreamshops.exception;

public class ProductNotFoundException extends RuntimeException{
    public ProductNotFoundException(String message) {

        super(message);
    }
}
