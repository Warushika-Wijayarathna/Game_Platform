package com.zenova.back_end.service.impl;

import com.zenova.back_end.dto.UserDTO;
import com.zenova.back_end.entity.User;
import com.zenova.back_end.repo.UserRepository;
import com.zenova.back_end.service.UserService;
import com.zenova.back_end.util.Role;
import com.zenova.back_end.util.VarList;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;


@Service
@Transactional
public class UserServiceImpl implements UserDetailsService, UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email);
        return new org.springframework.security.core.userdetails.User(user.getEmail(), user.getPassword(), getAuthority(user));
    }

    public UserDTO loadUserDetailsByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(username);
        return modelMapper.map(user,UserDTO.class);
    }

    private Set<SimpleGrantedAuthority> getAuthority(User user) {
        Set<SimpleGrantedAuthority> authorities = new HashSet<>();
        authorities.add(new SimpleGrantedAuthority(user.getRole().name()));
        return authorities;
    }

    @Override
    public UserDTO searchUser(String username) {
        if (userRepository.existsByEmail(username)) {
            User user=userRepository.findByEmail(username);
            return modelMapper.map(user,UserDTO.class);
        } else {
            return null;
        }
    }

    @Override
    public int loginUser(UserDTO userDTO) {
        if (userRepository.existsByEmail(userDTO.getEmail())) {
            User user = userRepository.findByEmail(userDTO.getEmail());
            BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
            if (passwordEncoder.matches(userDTO.getPassword(), user.getPassword())) {
                return VarList.OK;
            } else {
                return VarList.Not_Acceptable;
            }
        } else {
            return VarList.Not_Acceptable;
        }
    }

    @Override
    public List<UserDTO> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream()
                    .map(user -> modelMapper.map(user, UserDTO.class))
                    .collect(Collectors.toList());
    }

    @Override
    public void updateUser(UserDTO userDTO) {
        if (userRepository.existsByEmail(userDTO.getEmail())) {
            User user = userRepository.findByEmail(userDTO.getEmail());
            modelMapper.map(userDTO, user);
            if (userDTO.getPassword() != null) {
                BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
                user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
            }

            userRepository.save(user);

        }
    }

    @Override
    public void deactivateUser(UUID userId) {
        if (userRepository.existsById(userId)) {
            User user = userRepository.findById(userId).orElse(null);
            if (user != null) {
                user.setActive(false);
                userRepository.save(user);
            }
        }
    }

    @Override
    public List<UserDTO> getAllDevelopers() {
        List<UserDTO> users = getAllUsers();
        return users.stream()
                    .filter(user -> user.getRole().equals(Role.DEVELOPER))
                    .collect(Collectors.toList());
    }

    @Override
    public UserDTO getUserByEmail(String email) {
        if (userRepository.existsByEmail(email)) {
            User user = userRepository.findByEmail(email);
            System.out.println("User: " + user);
            return modelMapper.map(user, UserDTO.class);
        } else {
            return null;
        }
    }

    @Override
    public void activateUser(UUID userId) {
        if (userRepository.existsById(userId)) {
            User user = userRepository.findById(userId).orElse(null);
            if (user != null) {
                user.setActive(true);
                userRepository.save(user);
            }
        }
    }

    @Override
    public boolean validatePassword(String email, String existingPassword) {
        if (userRepository.existsByEmail(email)) {
            User user = userRepository.findByEmail(email);
            BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
            return passwordEncoder.matches(existingPassword, user.getPassword());
        } else {
            return false;
        }
    }

    @Override
    public void updatePassword(String email, String newPassword) {
        if (userRepository.existsByEmail(email)) {
            User user = userRepository.findByEmail(email);
            BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
            user.setPassword(passwordEncoder.encode(newPassword));
            userRepository.save(user);
        }
    }

    @Override
    public int saveUser(UserDTO userDTO) {
        if (userRepository.existsByEmail(userDTO.getEmail())) {
            return VarList.Not_Acceptable;
        } else {
            BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
            userDTO.setPassword(passwordEncoder.encode(userDTO.getPassword()));
            if (!userDTO.getEmail().contains("@zplay.com")) {
                userDTO.setRole(Role.USER);
            } else {
                userDTO.setRole(Role.ADMIN);
            }
            userRepository.save(modelMapper.map(userDTO, User.class));
            return VarList.Created;
        }
    }


}
