#!/bin/sh
DIRECTORY_DEFAULT="./src"
DIRECTORY_BACKUP="./src_backup"

DIRECTORY_RES_DEFAULT="./res"
DIRECTORY_RES_BACKUP="./res_backup"

SED_REPLACE="s|__TOUCH_OFF__|__TOUCH_ON__|g";

if [ ! -d "$DIRECTORY_BACKUP" ]; then
    printf "FAILED! Js Backup Directory absent!\n" 
    exit 1
fi

if [ ! -d "$DIRECTORY_RES_BACKUP" ]; then
    printf "FAILED! Res Backup Directory absent!\n" 
    exit 1
fi

printf "\nCopy touch graphics...\n"
cp -rf ./touch/res/graph/* ./res/graph

printf "\nEnable touch in Globals.js...\n"
sed -i $SED_REPLACE $DIRECTORY_DEFAULT/Globals.js




