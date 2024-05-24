# Web Radio Player for HomeBridge

Based off [github.com/m-reiniger/homebridge-radioplayer](https://github.com/m-reiniger/homebridge-radioplayer)

Hack spawning a `mpg123` sub-process because `node-speaker` in M-series Mac CPUs was a pain to set up.

Presents itself as a lightbulb to be controllable via Apple Home, speakers do not seem to be supported via HomeBridge.

If you want to configure more accessories, just add them like in the example configuration

> NOTE:
> You need to have the `mpg123` binary in your system.

## Installation

Clone and

```npm install -g```

for now.

## Configuration

You can configure more than one accessory, although volume is going to be shared among them.

The web radio stream needs to be `mp3`, since it is what mpg123 understands. I haven't bothered looking for an `aac` player yet.

``` 
{
    …rest of HomeBridge config…
    "accessories": [
        {
            "accessory": "CLIPlayer",
            "name": "Swiss Jazz",
            "streamUrl": "https://stream.srg-ssr.ch/m/rsj/mp3_128"
        },
        {
            "accessory": "CLIPlayer",
            "name": "Swiss Pop",
            "streamUrl": "https://stream.srg-ssr.ch/m/rsp/mp3_128"
        }
    ],
}
```