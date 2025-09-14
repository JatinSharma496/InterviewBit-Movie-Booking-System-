package com.cinema.util;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class PasswordUtilTest {

    @Test
    public void testPasswordHashing() {
        String password = "testPassword123";
        String hashed = PasswordUtil.hashPassword(password);
        
        assertNotNull(hashed);
        assertNotEquals(password, hashed);
        assertTrue(hashed.length() > 0);
    }

    @Test
    public void testPasswordVerification() {
        String password = "testPassword123";
        String hashed = PasswordUtil.hashPassword(password);
        
        assertTrue(PasswordUtil.verifyPassword(password, hashed));
        assertFalse(PasswordUtil.verifyPassword("wrongPassword", hashed));
    }

    @Test
    public void testDifferentHashesForSamePassword() {
        String password = "testPassword123";
        String hashed1 = PasswordUtil.hashPassword(password);
        String hashed2 = PasswordUtil.hashPassword(password);
        
        // Should be different due to different salts
        assertNotEquals(hashed1, hashed2);
        
        // But both should verify correctly
        assertTrue(PasswordUtil.verifyPassword(password, hashed1));
        assertTrue(PasswordUtil.verifyPassword(password, hashed2));
    }
}
