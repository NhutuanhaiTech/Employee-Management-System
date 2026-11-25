package com.example.qlnv.repository;

import com.example.qlnv.dto.user.reponse.UserAuthRowDto;
import com.example.qlnv.dto.user.reponse.UserByRoleResponseDto;
import com.example.qlnv.entity.User;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface UserRepository extends Repository<User, UUID> {
    @Query(value = "SELECT check_email_exist(:email)", nativeQuery = true)
    boolean checkEmailExist(String email);

    @Query(value = "SELECT check_username_exist(:username)", nativeQuery = true)
    boolean checkUsernameExist(String username);

    @Query(value = "SELECT check_phone_exist(:phone)", nativeQuery = true)
    boolean checkPhoneExist(String phone);

    @Query(value = "SELECT * FROM get_user_by_username(:username)", nativeQuery = true)
    List<UserAuthRowDto> callSpGetUserByUsername(@Param("username") String username);

    @Query(value = "SELECT get_all_users(:page, :size)", nativeQuery = true)
    String callSpGetAllUsers(Integer page, Integer size);

    @Query(
            value = "SELECT func_create_new_user(CAST(:userJson AS jsonb))",
            nativeQuery = true
    )
    UUID createNewUser(
            String userJson
    );

    @Query(value = "SELECT * FROM func_get_users_by_role(:roleName)", nativeQuery = true)
    List<UserByRoleResponseDto> getLeadersByRole(@Param("roleName") String roleName);
}
