---
title: Install Java ME apps on the N79
summary: General steps for installing MIDP 2.0 Java apps (.jar with a .jad) by cable, Bluetooth or memory card.
order: 4
tags: [java, midp, install]
updated: 2026-11-22
---

The N79 runs Java ME apps written for **MIDP 2.0** and **CLDC 1.1**. Most of them come as two files: a `.jar` (the program) and a `.jad` (a short text descriptor). This is a general guide. Nothing in this archive has been tested with it yet.

## Before you start

- Get both the `.jar` and the `.jad` for the app. Put them in the **same folder**. The `.jad` must match the `.jar`.
- Check that the app says it supports MIDP 2.0. Older apps (MIDP 1.0) may not run.
- Set App. mgr. > Options > Settings > **Software installation** to **All** if the app is unsigned. Some apps also need **Online certificate check** set to **Off**.

## Method 1: copy with a cable

1. Connect the phone by USB in **Mass storage** mode.
2. Copy the `.jar` and `.jad` into a folder on the phone (phone memory or the memory card).
3. Disconnect the phone. Open **File manager** and go to the folder.
4. Select the **.jad** file and install it. The `.jar` must be in the same folder.

## Method 2: send by Bluetooth

1. Turn on Bluetooth on both devices, and pair them.
2. Send the `.jad` and the `.jar` to the N79 from the other device.
3. Accept the files on the phone. They are saved to the Bluetooth inbox.
4. Open the inbox in **File manager**, select the **.jad**, and install it.

## Method 3: copy to the memory card

1. Put the files in a folder on the memory card. You can copy them with a card reader on a computer.
2. Put the card in the phone, open **File manager**, and go to the folder.
3. Select the **.jad** and install it.

## Security prompts

Unsigned Java apps can show security questions when they install or run. Allow them only for apps from a source you trust. Answer **No** to anything you do not understand.

## If the install fails

- The `.jad` and `.jar` must be from the same build. Download both again if one is missing.
- Check that the app supports MIDP 2.0.
- Check the App. mgr. settings above.
