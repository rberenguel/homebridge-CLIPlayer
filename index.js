const Player = require("./player");

let Service, Characteristic;

module.exports = function (homebridge) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  homebridge.registerAccessory(
    "homebridge-cliplayer",
    "CLIPlayer",
    CLIPlayerPlugin
  );
};

class CLIPlayerPlugin {
  /**
   * Creates an instance of CLIPlayerPlugin.
   * @param {any} log
   * @param {any} config
   * @memberof CLIPlayerPlugin
   */
  constructor(log, config) {
    this.log = log;
    this.name = config.name;
    this.streamUrl =
      config.streamUrl || "https://stream.srg-ssr.ch/m/rsj/mp3_128";

    this.informationService = new Service.AccessoryInformation();
    this.informationService
      .setCharacteristic(Characteristic.Manufacturer, "Ruben Berenguel")
      .setCharacteristic(Characteristic.Model, "v0.1.0")
      .setCharacteristic(Characteristic.SerialNumber, "100-66-978");

    this.speakerService = new Service.Lightbulb(this.name);
    this.speakerService
      .getCharacteristic(Characteristic.On)
      .on("get", this.getSwitchOnCharacteristic.bind(this))
      .on("set", this.setSwitchOnCharacteristic.bind(this));

    this.speakerService
      .getCharacteristic(Characteristic.Brightness)
      .on("get", this.getVolume.bind(this))
      .on("set", this.setVolume.bind(this));

    this.player = new Player(this.streamUrl, this.log);

    this.shutdownTimer = 0;
  }

  /**
   *
   *
   * @returns
   * @memberof CLIPlayerPlugin
   */
  getServices() {
    return [this.informationService, this.speakerService];
  }

  /**
   *
   *
   * @param {any} next
   * @returns
   * @memberof CLIPlayerPlugin
   */
  getSwitchOnCharacteristic(next) {
    const currentState = this.player.isPlaying();
    return next(null, currentState);
  }

  /**
   *
   *
   * @param {any} on
   * @param {any} next
   * @returns
   * @memberof CLIPlayerPlugin
   */
  setSwitchOnCharacteristic(on, next) {
    // set player state here
    if (on) {
      if (
        // I wonder why this is needed.
        new Date().getTime() - this.shutdownTimer > 3000 &&
        !this.player.isPlaying()
      ) {
        this.log.info("Turning " + this.name + " on");
        this.player.play();
      }
    } else {
      this.log.info("Turning " + this.name + " off");
      this.shutdownTimer = new Date().getTime();
      this.player.stop();
    }
    return next();
  }

  /**
   *
   *
   * @param {any} next
   * @returns
   * @memberof CLIPlayerPlugin
   */
  getVolume(next) {
    const volume = this.player.getVolume() * 100;
    return next(null, volume);
  }

  /**
   *
   *
   * @param {any} volume
   * @param {any} next
   * @returns
   * @memberof CLIPlayerPlugin
   */
  setVolume(volume, next) {
    this.log("Setting " + this.name + " to " + volume + "%");
    this.player.setVolume(volume / 100);
    return next();
  }
}
