const { spawn } = require("child_process");
const loudness = require("loudness");

class Player {
  childProcess = null;

  constructor(streamURL, log) {
    this.streamURL = streamURL;
    this.playing = false;
    this.lastVolume = 1;
    this.log = log
  }

  isPlaying() {
    return this.playing;
  }

  async play() {
    if (!this.playing) {
      this.volume = 20;
      this.playing = true;
      await loudness.setVolume(this.volume);
      this.log.info(`Playing stream ${this.streamURL}`)
      this.childProcess = spawn("mpg123", [this.streamURL]);
    }
  }

  stop() {
    if (this.childProcess) {
      this.childProcess.kill();
      this.log.info("Child process stopped.");
      this.playing = false;
    } else {
    this.log.warn("No child process running.");
      this.playing = false;
    }
  }

  async setVolume(value) {
    this.lastVolume = value;
    this.volume = value;
    await loudness.setVolume(100 * value);
  }

  getVolume() {
    return this.lastVolume;
  }

  mute() {
    this.lastVolume = 0;
    this.volume = 0;
    this.stop();
  }
}

module.exports = Player;
