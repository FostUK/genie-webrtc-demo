import { Home } from "../node_modules/genie/src/components/home.js";
import { Select } from "../node_modules/genie/src/components/select/select-screen.js";
import { HowToPlay } from "../node_modules/genie/src/components/how-to-play.js";
import { Pause } from "../node_modules/genie/src/components/overlays/pause.js";
import { Game } from "./components/game.js";
import { Results } from "../node_modules/genie/src/components/results/results-screen.js";
import { startup } from "../node_modules/genie/src/core/startup.js";
import { settingsChannel } from "../node_modules/genie/src/core/settings.js";
import { eventBus } from "../node_modules/genie/src/core/event-bus.js";
import "../node_modules/genie/lib/SpinePlugin.min.js"; //CAN BE REMOVED IF NOT USING SPINE

// Setup for BBC settings control
const settings = {
    pages: [
        {
            title: "Custom Settings",
            settings: [
                {
                    key: "custom1",
                    type: "toggle",
                    title: "Custom setting",
                    description: "Description of custom setting",
                },
            ],
        },
    ],
};

// Example of responding to custom game settings
eventBus.subscribe({
    channel: settingsChannel,
    name: "custom1",
    callback: value => {
        console.log("Custom 1 setting changed to " + value);
    },
});

// Additional game options can be passed to phaser here
const gameOptions = {
    pixelArt: true,
};

const screens = {
    home: {
        scene: Home,
        routes: {
            debug: "debug",
            //Example of custom routing function
            next: "game",
        },
    },
    game: {
        scene: Game,
        settings: {
            physics: {
                default: "arcade",
                arcade: {},
            },
        },
        routes: {
            next: "results",
            home: "home",
            restart: "game",
        },
    },
    results: {
        scene: Results,
        routes: {
            continue: "level-select",
            restart: "game",
            home: "home",
        },
    },
    // Overlays
    "how-to-play": {
        scene: HowToPlay,
        routes: {
            home: "home",
        },
    },
    pause: {
        scene: Pause,
        routes: {
            home: "home",
        },
    },
};

startup({ screens, settings, gameOptions });
