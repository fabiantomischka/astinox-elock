# About Elock

Astinox Elock is a puzzle for FiveM servers. It is a standalone package and can be used in any framework. It has the following features:

✅ A custom "Lights Out" implementation, a grid of elements where all have to be turned on
✅ Highly customizable: Grid size, tries per play and a timeout for the amount of seconds to play
✅ Immersive: Sounds are global for every player, perfect for RP scenarios e.g. to hear if somebody failed it

## Installation

1. Download the GitHub repository
2. Create a folder `astinox-elock` in your resources folder
3. Move the files from the repository in that folder
4. Edit your server.cfg and add `ensure astinox-elock` to your resource list
5. Thats it, you are ready to go!

## Usage

```lua
  local lockOpened = exports['astinox-elock']:Start()

  if lockOpened then print('Elock was opened!') else print('Elock was not opened!') end
```

## Contributing
Thank you! Our software is open source and lives through its contributions and we welcome contributions!

## License
Our software is open source software licensed under the [MIT license](LICENSE).