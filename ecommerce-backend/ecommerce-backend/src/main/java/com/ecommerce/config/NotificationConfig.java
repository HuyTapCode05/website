package com.ecommerce.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Data
@Component
@ConfigurationProperties(prefix = "notify")
public class NotificationConfig {

    private boolean emailEnabled = true;
    private boolean smsEnabled = false;
    private boolean inappEnabled = true;
}
