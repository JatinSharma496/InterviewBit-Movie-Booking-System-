package com.cinema.util;

public class PasswordTest {
    public static void main(String[] args) {
        String password = "123456";
        String hashed = PasswordUtil.hashPassword(password);
        
        System.out.println("Password: " + password);
        System.out.println("Hashed: " + hashed);
        System.out.println("Verification: " + PasswordUtil.verifyPassword(password, hashed));
        
        // Test with a simple hash (old format)
        String simpleHash = "123456"; // This might be what's in the database
        System.out.println("Simple hash verification: " + PasswordUtil.verifyPassword(password, simpleHash));
    }
}
