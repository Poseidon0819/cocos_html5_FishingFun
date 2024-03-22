#!/bin/sh

DIRECTORY_DEFAULT="./frameworks/runtime-src/proj.android"
DIRECTORY_BACKUP="./frameworks/runtime-src/proj.android_backup"

if [ ! -d "$DIRECTORY_BACKUP" ]; then
    printf "FAILED! Backup Directory absent!" 
    exit 1
fi

printf "Restoring original proj.android...\n"
rm -rf $DIRECTORY_DEFAULT
mv $DIRECTORY_BACKUP $DIRECTORY_DEFAULT

./js_directory_restore.sh
