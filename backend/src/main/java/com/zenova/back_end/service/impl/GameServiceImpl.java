package com.zenova.back_end.service.impl;

import com.zenova.back_end.dto.GameDTO;
import com.zenova.back_end.dto.PurchaseDTO;
import com.zenova.back_end.dto.UserDTO;
import com.zenova.back_end.entity.Category;
import com.zenova.back_end.entity.Game;
import com.zenova.back_end.entity.Purchase;
import com.zenova.back_end.entity.User;
import com.zenova.back_end.repo.CategoryRepository;
import com.zenova.back_end.repo.GameRepository;
import com.zenova.back_end.repo.PurchaseRepository;
import com.zenova.back_end.repo.UserRepository;
import com.zenova.back_end.service.GameService;

import com.zenova.back_end.util.JwtUtil;
import com.zenova.back_end.util.Role;
import io.jsonwebtoken.Claims;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class GameServiceImpl implements GameService {
    @Autowired
    private final GameRepository gameRepository;

    @Autowired
    private final PurchaseRepository purchaseRepository;

    @Autowired
    private final UserRepository userRepository;

    @Autowired
    private final CategoryRepository categoryRepository;

    @Autowired
    ModelMapper modelMapper;

    @Autowired
    private final JwtUtil jwtUtil;

    public GameServiceImpl(GameRepository gameRepository, PurchaseRepository purchaseRepository, UserRepository userRepository, CategoryRepository categoryRepository, JwtUtil jwtUtil) {
        this.gameRepository = gameRepository;
        this.purchaseRepository = purchaseRepository;
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.jwtUtil = jwtUtil;
    }

    @Transactional
    @Override
    public GameDTO addGame(GameDTO gameDTO) {
        Game game = modelMapper.map(gameDTO, Game.class);
        Category category = game.getCategory();
        if (category != null && category.getId() == 0) {
            category = categoryRepository.save(category);
            game.setCategory(category);
        }
        game = gameRepository.save(game);
        if(gameDTO.getUploadedBy().getRole()== Role.USER){
            User user = userRepository.findByUid(gameDTO.getUploadedBy().getUid());
            user.setRole(Role.ADMIN);
            userRepository.save(user);
        }
        return modelMapper.map(game, GameDTO.class);
    }

    @Override
    public GameDTO updateGame(GameDTO gameDTO) {
        Game game = gameRepository.findById(String.valueOf(gameDTO.getId()))
                .orElseThrow(() -> new RuntimeException("Game not found"));
        modelMapper.map(gameDTO, game);
        game = gameRepository.save(game);
        return modelMapper.map(game, GameDTO.class);
    }

    @Override
    public void deleteGame(Long id) {
        gameRepository.deleteById(String.valueOf(id));
    }

    @Override
    public GameDTO getGame(Long id) {
        Game game = gameRepository.findById(String.valueOf(id))
                .orElseThrow(() -> new RuntimeException("Game not found"));
        return modelMapper.map(game, GameDTO.class);
    }

    @Override
    public List<GameDTO> getAllGames() {
        List<Game> games = gameRepository.findAll();
        return games.stream()
                .map(game -> modelMapper.map(game, GameDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public Object deactivateGame(Long id) {
        Game game = gameRepository.findById(String.valueOf(id))
                .orElseThrow(() -> new RuntimeException("Game not found"));
        game.setActive(false);
        System.out.println("Game deactivated attribute: " + game.isActive());
        gameRepository.save(game);
        System.out.println("Game deactivated: " + game.isActive());
        GameDTO gameDTO = modelMapper.map(game, GameDTO.class);
        System.out.println("Game deactivated DTO: " + gameDTO);
        return modelMapper.map(game, GameDTO.class);
    }

    @Override
    public List<GameDTO> getAllActiveGames() {
        List<Game> games = gameRepository.findAllByActiveTrue();
        return games.stream()
                .map(game -> modelMapper.map(game, GameDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public Object purchaseGame(String token, Long id) {
        Claims claims = jwtUtil.getUserRoleCodeFromToken(token);
        String email = claims.getSubject();
        User user = userRepository.findByEmail(email);

        Game game = gameRepository.findById(String.valueOf(id))
                .orElseThrow(() -> new RuntimeException("Game not found or inactive"));

        Purchase purchase = new Purchase();
        purchase.setUser(user);
        purchase.setGame(game);
        purchase.setPurchaseDate(LocalDateTime.now());
        purchaseRepository.save(purchase);

        return modelMapper.map(purchase, PurchaseDTO.class);
    }

    @Override
    public Object uploadGame(GameDTO gameDTO, UserDTO userDTO) {
        User user = userRepository.findByUid(userDTO.getUid());
        Game game = modelMapper.map(gameDTO, Game.class);

        if (game.getPrice() == null || game.getPrice().isEmpty()) {
            game.setPrice("0.00");
        }

        if (game.getIsApproved() == null) {
            game.setIsApproved(false);
        }

        game.setUploadedBy(user);

        Category category = game.getCategory();
        if (category != null && category.getId() == 0) {
            category = categoryRepository.save(category);
            game.setCategory(category);
        }

        game = gameRepository.save(game);

        if(user.getRole()== Role.USER){
            user.setRole(Role.DEVELOPER);
            userRepository.save(user);
        }

        return modelMapper.map(game, GameDTO.class);
    }

}
