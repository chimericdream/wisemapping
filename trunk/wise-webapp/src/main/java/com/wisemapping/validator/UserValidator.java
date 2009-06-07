/*
* Licensed to the Apache Software Foundation (ASF) under one or more
* contributor license agreements.  See the NOTICE file distributed with
* this work for additional information regarding copyright ownership.
* The ASF licenses this file to You under the Apache License, Version 2.0
* (the "License"); you may not use this file except in compliance with
* the License.  You may obtain a copy of the License at
*
*       http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*
* $Id: file 64488 2006-03-10 17:32:09Z paulo $
*/

package com.wisemapping.validator;

import com.wisemapping.controller.Messages;
import com.wisemapping.service.UserService;
import com.wisemapping.view.UserBean;
import com.wisemapping.model.Constants;
import org.springframework.validation.Errors;
import org.springframework.validation.ValidationUtils;
import org.springframework.validation.Validator;

public class UserValidator
        implements Validator {

    private UserService userService;

    public boolean supports(final Class clazz) {
        return clazz.equals(UserBean.class);
    }

    public void validate(Object obj, Errors errors) {
        UserBean user = (UserBean) obj;
        if (user == null) {
            errors.rejectValue("user", "error.not-specified");
        } else {

            // Validate email address ...
            final String email = user.getEmail();
            boolean isValid = Utils.isValidateEmailAddress(email);
            if (isValid) {
                if (userService.getUserBy(email) != null) {
                    errors.rejectValue("email", Messages.EMAIL_ALREADY_EXIST);
                }
            } else {
                Utils.validateEmailAddress(email, errors);
            }

            // Validate username ...
            final String username = user.getUsername();
            if (username != null && userService.getUserByUsername(username) != null) {
                errors.rejectValue("username", Messages.USERNAME_ALREADY_EXIST);
            } else {
                ValidationUtils.rejectIfEmpty(errors, "username", Messages.FIELD_REQUIRED);
            }

            ValidationUtils.rejectIfEmptyOrWhitespace(errors, "firstname", Messages.FIELD_REQUIRED);
            ValidationUtils.rejectIfEmptyOrWhitespace(errors, "lastname", Messages.FIELD_REQUIRED);
            ValidationUtils.rejectIfEmptyOrWhitespace(errors, "password", Messages.FIELD_REQUIRED);
            ValidationUtils.rejectIfEmptyOrWhitespace(errors, "retypePassword", Messages.FIELD_REQUIRED);
            ValidatorUtils.rejectIfExceeded(errors,
                                "firstname",
                                "The firstname must have less than "+ Constants.MAX_USER_FIRSTNAME_LENGTH + " characters.",
                                user.getFirstname(),
                                Constants.MAX_USER_FIRSTNAME_LENGTH);
            ValidatorUtils.rejectIfExceeded(errors,
                                "lastname",
                                "The lastname must have less than "+ Constants.MAX_USER_LASTNAME_LENGTH + " characters.",
                                user.getLastname(),
                                Constants.MAX_USER_LASTNAME_LENGTH);
            ValidatorUtils.rejectIfExceeded(errors,
                                "username",
                                "The username must have less than "+ Constants.MAX_USER_USERNAME_LENGTH + " characters.",
                                username,
                                Constants.MAX_USER_USERNAME_LENGTH);
            ValidatorUtils.rejectIfExceeded(errors,
                                "password",
                                "The password must have less than "+ Constants.MAX_USER_PASSWORD_LENGTH + " characters.",
                                user.getPassword(),
                                Constants.MAX_USER_PASSWORD_LENGTH);
            ValidatorUtils.rejectIfExceeded(errors,
                                "retypePassword",
                                "The retypePassword must have less than "+ Constants.MAX_USER_PASSWORD_LENGTH + " characters.",
                                user.getRetypePassword(),
                                Constants.MAX_USER_PASSWORD_LENGTH);

            final String password = user.getPassword();
            if (password != null && !password.equals(user.getRetypePassword())) {
                errors.rejectValue("password", Messages.PASSWORD_MISSMATCH);
            }
        }
    }

    public void setUserService(UserService userService) {
        this.userService = userService;
    }
}