#!/bin/sh
set -e # exit on error

# https://wiki.linuxfoundation.org/networking/netem
sudo tc qdisc add dev lo root netem loss 100%

echo "[*] discarding all traffic on loopback device"
