fx_version 'cerulean'
game 'gta5'
lua54 'yes'

author 'Astinox'
description 'Astinox Electrical Lock'
version '1.0.0'

escrow_ignore {
    'config.lua',
}

shared_scripts {
    'config.lua',
    'shared/*.lua',
}

client_scripts {
    'client/*.lua',
}

server_scripts {
    'server/*.lua',
}

files {
  'ui/index.html',
  'ui/scripts/*.js',
  'ui/styles/*.css',
  'ui/images/*.png',
  'ui/images/*.jpg',
  'ui/images/*.webp',
  'ui/sounds/*.ogg',
}

ui_page 'ui/index.html'