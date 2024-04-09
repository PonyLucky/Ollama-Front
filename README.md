# Ollama front

![screenshot.png](img/screenshot.png)

This is a frontend project in electron to use your local LLM models in a GUI via ollama.

## Shortcuts

- `Ctrl + Enter` to send the message. There are protections to avoid sending empty messages and when one is already
processing. Don't worry about faulty peripherals. So you can enter a new line with `Enter` or `Shift + Enter`.
- `Ctrl + R` to reset the history (clicking on a model does the same thing).r
- `Ctrl + Q` (Linux/Mac) or `Alt + F4` (Windows) to close the app.

## Install

### For users

Download the latest release from the [releases](https://github.com/PonyLucky/Ollama-Front/releases).
If you don't see a release for your platform, you can build it yourself. See the [For the Dev](#for-the-dev) section.

I did not take the time to build it for Windows (don't have a Apple device yet). Please open an issue if you need it.

#### On Linux

If `wget` is not installed, you can install it with:
- `sudo apt install wget` on Debian based OS (Ubuntu, Mint).
- `sudo pacman -S wget` on Arch based OS (Manjaro, Garuda).
- `sudo dnf install wget` on Fedora based OS (Nobara).

Here is a script to install the app in your system. You can paste it in your terminal:

```bash
# Create the tree
mkdir -p ~/.local/share/OllamaFront
# Download the AppImage
wget https://github.com/PonyLucky/Ollama-Front/releases/download/v1.2/OllamaFront.AppImage \
    -O ~/.local/share/OllamaFront/OllamaFront.AppImage
# Make it executable
chmod +x ~/.local/share/OllamaFront/OllamaFront.AppImage
# Download the icon
wget https://raw.githubusercontent.com/PonyLucky/Ollama-Front/master/img/icon.png \
    -O ~/.local/share/OllamaFront/icon.png
# Download the desktop file
wget https://raw.githubusercontent.com/PonyLucky/Ollama-Front/master/OllamaFront.desktop \
    -O ~/.local/share/applications/OllamaFront.desktop
# Make the desktop file executable
chmod +x ~/.local/share/applications/OllamaFront.desktop
# Log out and log in again
echo "Please log out and log in again to see the changes."
````

### For devs

This project needs [Node.js](https://nodejs.org/) to run. *I use Node v20.10.0.*

```bash
npm install
```

#### Usage

```bash
npm start
```

#### Build

```bash
npm run build
```

## License
This code is under the [MIT](https://choosealicense.com/licenses/mit/) license.
Basically, as is. Use it as you wish. I am not responsible for anything.

I do not own the rights to [highlightjs](https://highlightjs.org/) and the
[trash icon](https://icons8.com/icon/4B0kCMNiLlmW/trash) used in the  project. They are under their respective licenses.
