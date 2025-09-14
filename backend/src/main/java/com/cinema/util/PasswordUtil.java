package com.cinema.util;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.Base64;

public class PasswordUtil {
    
    private static final String ALGORITHM = "SHA-256";
    private static final int SALT_LENGTH = 16;
    
    public static String hashPassword(String password) {
        try {
            // Generate a random salt
            SecureRandom random = new SecureRandom();
            byte[] salt = new byte[SALT_LENGTH];
            random.nextBytes(salt);
            
            // Hash the password with salt
            MessageDigest md = MessageDigest.getInstance(ALGORITHM);
            md.update(salt);
            byte[] hashedPassword = md.digest(password.getBytes());
            
            // Combine salt and hashed password
            byte[] combined = new byte[salt.length + hashedPassword.length];
            System.arraycopy(salt, 0, combined, 0, salt.length);
            System.arraycopy(hashedPassword, 0, combined, salt.length, hashedPassword.length);
            
            return Base64.getEncoder().encodeToString(combined);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Error hashing password", e);
        }
    }
    
    public static boolean verifyPassword(String password, String hashedPassword) {
        try {
            // Check if it's a plain text password (old format)
            if (password.equals(hashedPassword)) {
                return true;
            }
            
            // Try to decode as Base64 (new format)
            try {
                byte[] combined = Base64.getDecoder().decode(hashedPassword);
                
                // If we can decode it and it has the right length, it's the new format
                if (combined.length > SALT_LENGTH) {
                    // Extract salt and hashed password
                    byte[] salt = new byte[SALT_LENGTH];
                    byte[] storedHash = new byte[combined.length - SALT_LENGTH];
                    System.arraycopy(combined, 0, salt, 0, SALT_LENGTH);
                    System.arraycopy(combined, SALT_LENGTH, storedHash, 0, storedHash.length);
                    
                    // Hash the input password with the same salt
                    MessageDigest md = MessageDigest.getInstance(ALGORITHM);
                    md.update(salt);
                    byte[] inputHash = md.digest(password.getBytes());
                    
                    // Compare the hashes
                    return MessageDigest.isEqual(storedHash, inputHash);
                }
            } catch (IllegalArgumentException e) {
                // Not a valid Base64 string, treat as plain text
                return password.equals(hashedPassword);
            }
            
            // Fallback to plain text comparison
            return password.equals(hashedPassword);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Error verifying password", e);
        }
    }
}
