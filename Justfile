
set shell := ["bash", "-uc"]

dev:
    npm run dev

tauri-dev:
    npm run tauri dev

test-all:
    npm run test:all

test-playwright:
    npm run test:playwright

# This was tested on Manjaro Gnome, though it should work always on Gnome.
# For distributions that are not Manjaro or Arch, you may include the AppImage build again, as this supposedly
# only doesn't work there. For more information, see: https://github.com/tauri-apps/tauri/issues/5781.
build-and-deploy-locally:
    # Remove "appimage" from `tauri.conf.json`, as it doesn't work on Manjaro / Arch
    cp ./src-tauri/tauri.conf.json ./src-tauri/tauri.conf.json.backup
    sed -i 's/"appimage",//g' ./src-tauri/tauri.conf.json
    npm run tauri build
    # Replace `tauri.conf.json` again with the original version (with "appimage" included)
    mv ./src-tauri/tauri.conf.json.backup ./src-tauri/tauri.conf.json

    cp ./src-tauri/target/release/summarum ~/.local/bin/summarum
    mkdir -p ~/.local/share/summarum
    cp ./src-tauri/icons/icon.png ~/.local/share/summarum/icon.png
    cp ./src-tauri/local-dist/summarum.desktop ~/.local/share/applications/summarum.desktop
    chmod +x ~/.local/share/applications/summarum.desktop

    @printf "\n\n"
    @echo "App deployed locally. ✅ "
    @echo ""
    @echo "If it isn't in your applications menu, try running:"
    @echo ""
    @echo "  update-desktop-database ~/.local/share/applications/"
    @echo ""
    @echo "Also make sure that ~/.local/bin is in your PATH."

build-parser:
    npm run prepare-grammar
