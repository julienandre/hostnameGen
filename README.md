# hostname Generator
The unique identifier generator for RPi 

## Install

```javascript
sudo npm install -g hostnameGen
```

## How does it work ?

- On RPi, a unique identifier depending ONLY from the CPU can be found into /proc/cpuinfos : Serial line (exple : 000000003f14bce2 )

- This unique identifier is not dependent from the OS or the SD card so you can cahnge and use any and still have the same identifier.

- Once this serial UID extracted, it is converted from base16 (Hex) to Base32 from [Douglas Crockford](http://www.crockford.com/wrmg/base32.html) to be more human friendly.

- Change /etc/hostname & /etc/hosts files.

## Usage

```shell
hostnamegen
```
Generate a UID based on CPU Serial and print it only.

```shell
sudo hostnamegen -s 
```
Generate and Setup hostname, need reboot after use to take effect.

```shell
sudo hostnamegen -s -f myhostname 
```
Setup Hostname with specific hostname in params.
