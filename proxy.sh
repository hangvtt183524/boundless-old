#!/bin/bash
 npx ws --compress -v -p 8001 --rewrite '/portal/(.*) -> http://localhost:8000/portal/$1'
