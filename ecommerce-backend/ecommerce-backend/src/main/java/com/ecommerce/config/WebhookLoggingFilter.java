package com.ecommerce.config;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Enumeration;

@Component
@Order(1)
public class WebhookLoggingFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        String path = httpRequest.getRequestURI();
        
        // Chỉ log requests đến webhook endpoint
        if (path.contains("/api/sepay/webhook")) {
            System.out.println("========================================");
            System.out.println("🌐 INCOMING REQUEST TO WEBHOOK");
            System.out.println("========================================");
            System.out.println("Method: " + httpRequest.getMethod());
            System.out.println("URL: " + httpRequest.getRequestURL());
            System.out.println("Path: " + path);
            System.out.println("Remote Address: " + httpRequest.getRemoteAddr());
            System.out.println("User-Agent: " + httpRequest.getHeader("User-Agent"));
            
            // Log all headers
            System.out.println("Headers:");
            Enumeration<String> headerNames = httpRequest.getHeaderNames();
            while (headerNames.hasMoreElements()) {
                String headerName = headerNames.nextElement();
                String headerValue = httpRequest.getHeader(headerName);
                // Mask sensitive headers
                if (headerName.toLowerCase().contains("secret") || headerName.toLowerCase().contains("key")) {
                    headerValue = "***";
                }
                System.out.println("  " + headerName + ": " + headerValue);
            }
            
            // Note: Request body will be logged in controller to avoid consuming the stream
            
            System.out.println("========================================");
        }
        
        chain.doFilter(request, response);
    }
}

