package com.example.chatapp.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.PathResourceResolver;


@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/static/assets/**")
                .addResourceLocations("classpath:/static/assets/")
                .setCachePeriod(31556926) // 1 год кэширования
                .resourceChain(true)
                .addResolver(new PathResourceResolver());
    }
}
