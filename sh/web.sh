#!/bin/bash
cd build
#cd ..
LISTEN_PORT=8040 LISTEN_ADDR=127.0.0.1 GRACE_JAIL=1 deno run --allow-read --allow-net --allow-env ../deno/grace/grace.mjs
exit