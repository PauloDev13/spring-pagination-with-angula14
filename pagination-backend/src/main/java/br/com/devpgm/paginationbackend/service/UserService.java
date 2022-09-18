package br.com.devpgm.paginationbackend.service;

import br.com.devpgm.paginationbackend.domain.User;
import org.springframework.data.domain.Page;

public interface UserService {
    Page<User> getUsers(String name, int page, int size);
}
