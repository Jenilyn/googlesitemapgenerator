// Copyright 2008 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// This file defines a class to deal with the issues related to security.
// It checks the user session id and IP address in the http request. It also
// verifies the user login password, checks the static pages' access path, and
// provides strong random-generated session id.

#ifndef SITEMAPSERVICE_SECURITYMANAGER_H__
#define SITEMAPSERVICE_SECURITYMANAGER_H__

#include <string>

class HttpProto;
class SessionManager;
class SettingManager;

class SecurityManager {
public:
  // Check if the access is valid.
  static bool SecurityCheck(HttpProto *r, SessionManager* sess, 
    bool allow_remote);

  // Functions for IP

  // Checks if the IP for the request is allowed.
  static bool CheckIp(HttpProto *r, bool allow_remote);

  // Functions for password

  // Validates the login password
  static bool VerifyPasswd(HttpProto *r, SettingManager* setting);

  // Checks the access path from the HTTP request.
  // Forbidden the '../' path
  static bool CheckPath(HttpProto* r);

  // Returns random-generated session id (weak version)
  static std::string GenerateSimpleRandomId(const std::string& seed);

  // Returns random-generated session id (strong version)
  static std::string GenerateRandomId(const std::string& seed);

};
#endif // SITEMAPSERVICE_SECURITYMANAGER_H__
