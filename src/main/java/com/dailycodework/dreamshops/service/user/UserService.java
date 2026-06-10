package com.dailycodework.dreamshops.service.user;

import com.dailycodework.dreamshops.exception.AlreadyExistException;
import com.dailycodework.dreamshops.exception.ResourceNotFoundException;
import com.dailycodework.dreamshops.model.User;
import com.dailycodework.dreamshops.repository.UserRepository;
import com.dailycodework.dreamshops.request.CreateUserRequest;
import com.dailycodework.dreamshops.request.UserUpdateRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService implements IUserService{

    UserRepository userRepository;

    @Override
    public User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

    }

    @Override
    public User createUser(CreateUserRequest request) {
        return Optional.of(request)
                .filter(user -> !userRepository.existsByEmail(request.getEmail()))
                .map(req -> {
                    User user = new User();
                    user.setEmail(request.getEmail());
                    user.setFirstName(request.getFirstName());
                    user.setLastName(request.getLastName());
                    return userRepository.save(user);
                }) .orElseThrow(() -> new AlreadyExistException("Ooops!" + request.getEmail() + " already exist"));

    }

    @Override
    public User updateUser(UserUpdateRequest request, Long userId) {
        return userRepository.findById(userId)
                .map(existingUser -> {
                    existingUser.setFirstName(request.getFirstName());
                    existingUser.setLastName(request.getLastName());
                    return userRepository.save(existingUser);
                    }).orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    @Override
    public void deleteUser(Long userId) {
        userRepository.findById(userId).ifPresentOrElse(userRepository :: delete, () ->{
            throw new ResourceNotFoundException("User not found");
        });
    }
}
