#!/bin/sh

DIRECTORY_JS_DEFAULT="./src"
DIRECTORY_JS_BACKUP="./src_backup"

SED_REPLACE="s|__EXIT_URL__|$1|g"

if [ ! -d "$DIRECTORY_JS_BACKUP" ]; then
    printf "FAILED! Backup Directory absent!\n" 
    exit 1
fi

printf "\nSet exit redirect url...\n"
sed -i $SED_REPLACE $DIRECTORY_JS_DEFAULT/Globals.js



