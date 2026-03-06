package com.focus.focus.service;

import com.focus.focus.dto.AuthResponse;
import com.focus.focus.dto.LoginRequest;
import com.focus.focus.dto.RegisterRequest;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);
}
