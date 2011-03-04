# ox: Online X-Terminal

## Overview

ox is a highly *un*secure but *awesome* way to get terminals open on your
machine from anywhere in the cosmos (with internets).

Just run the server and browse to get your xterm up in your browser.

## Installation

To install you need a few modules which are not linked at the moment so each
has to be done individually (I am working on improving this)

      git clone git://github.com/gatapia/nclosure.git
      cd nclosure
      npm link

      git clone git://github.com/gatapia/ncnode.git

      git clone git://github.com/gatapia/ox.git

## Running!

      // Step 1 - We can have lots of fun
      node srv/ox.js

      // Step 2 - There's so much we can do
      Browse -> http://127.0.0.1:8124/


## License

Copyright 2011 Guido Tapia (guido@tapia.com.au)

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
