
set shell := ["bash", "-uc"]

dev:
    npm run dev

tauri-dev:
    npm run tauri dev

test-all:
    npm run test:all

# This was tested on Manjaro Gnome, though it should work always on Gnome.
build-and-deploy-locally:
    npm run tauri build

    cp ./src-tauri/target/release/summarum ~/.local/bin/summarum
    mkdir -p ~/.local/share/summarum
    cp ./src-tauri/icons/icon.png ~/.local/share/summarum/icon.png
    cp ./src-tauri/local-dist/summarum.desktop ~/.local/share/applications/summarum.desktop
    chmod +x ~/.local/share/applications/summarum.desktop
    # Maybe this is needed:
    # update-desktop-database ~/.local/share/applications/
    echo "App deployed locally."
    echo "If it isn't in your applications menu, try running:"
    echo ""
    echo "  update-desktop-database ~/.local/share/applications/"
    echo ""
    echo "Also make sure that ~/.local/bin is in your PATH."

build-parser:
    npm run prepare-grammar
