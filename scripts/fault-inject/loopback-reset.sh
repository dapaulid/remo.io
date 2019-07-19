#!/bin/sh
set -e # exit on error

sudo tc qdisc del dev lo root

echo "[*] reset fault injection on loopback device"
