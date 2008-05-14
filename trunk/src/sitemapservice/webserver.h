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

// This file defines a class for simple HTTP web server.
// It listens the port, accept client connection, and deal with HTTP request.
// It allows passing through a callback function to deal with the HTTP request.
// It supports both single/multi-threads to deal with each request, but in this
// project, the callback function class (PageController) only support single 
// thread.

#ifndef SITEMAPSERVICE_WEBSERVER_H__
#define SITEMAPSERVICE_WEBSERVER_H__

#include <string>
#include <map>

#include "sitemapservice/activesocket.h"

class HttpProto;
class WebServer {
public:
  // destructor
  ~WebServer();

  // singleton factory
  static WebServer* GetInstance();

  // The type of the callback function to deal with the HTTP request
  typedef void (*request_func) (HttpProto*); 

  // Start the webserver listening, will block the thread or return false
  // if some error occur..
  // Note, in current implementation, "singleThread" MUST be true.
  // The underlying code is not thread-safe.
  bool Start(unsigned int port_to_listen, request_func, bool single_thread);

  // Parses the HTTP request and call the callback function to deal with it,
  // then pack the response and send it back to the client.
  void ProcessRequest(const ActiveSocket& s);

private:
  // The singleton
  static WebServer* instance_;

  // Initializes the listening socket
  bool StartListen(int port, int connections, bool is_blocking = true);

  // Accepts the connection
  ActiveSocket* Accept();

  // The listening socket
  SOCKET listen_socket_;

  // The callback function
  request_func request_func_;
};
#endif
