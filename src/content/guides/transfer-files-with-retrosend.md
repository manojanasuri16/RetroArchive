---
title: Send and receive files with RetroSend
summary: Use the LocalSend app on another device to send photos, music, files and text to and from the N79 over Wi-Fi.
order: 3
tags: [retrosend, wifi, transfer, localsend]
updated: 2026-11-22
---

[RetroSend](/apps/retrosend/) lets an old Nokia phone (S60 3rd Edition, for example the N79) send and receive files with the **LocalSend** app on Android, iPhone, Windows, macOS or Linux. Both devices must be on the same Wi-Fi. No cable is needed.

## Before you start

1. Install [Python for S60](/guides/install-pys60/) and then RetroSend.
2. On the other device, install [LocalSend](https://localsend.org).
3. In LocalSend, open **Settings** and turn **Encryption off**. RetroSend does not support encryption. If "Require PIN" is on, turn it off too.
4. Keep LocalSend open on the same Wi-Fi as the phone.

## First start on the phone

RetroSend asks once which Wi-Fi network to use, and remembers it. To change it later, go to **Options > Change Wi-Fi**.

## Sending

On the **Send** tab:

- **Send a photo** opens a thumbnail grid of the photos folder.
- **Send a video** or **Send music** opens a list of the videos or music folder.
- **Send any file or folder** lets you choose a drive and browse. To send a whole folder, use **Options > Mark whole folder**.
- **Send contacts**: tick contacts, then choose a device. They are sent as a `.vcf` file.
- **Send text message** sends a short message.

Mark several files, even in different folders, then choose **Options > Send marked**. Pick the device. If your device is not listed, choose **Scan again** (about 12 seconds), or **Enter IP address** and type the IP that LocalSend shows.

### Keys in the file picker

| Key | Action |
|---|---|
| Up / Down (or 2 / 8) | Move |
| Centre (or 5, or Right) | Open a folder, or mark or unmark a file |
| Left | Go up a folder |
| Right softkey | Back or cancel |

## Receiving

On the **Receive** tab the phone shows **Ready to receive**, its name and its IP address. When someone sends you files, RetroSend lists them and asks you to **Accept**. Progress shows in the title bar.

- Photos, music and videos go to the Gallery, Music and Videos folders, so the phone's own apps find them.
- Other files go to the RetroSend folder.
- **Auto-accept** can be switched on to skip the prompt.
- The **Received files** list keeps the last 30 files. Open one, send it on, or show it in its folder.

## Browser sharing

Turn on **Browser sharing** on the Receive tab, or use **Send > Share files to a browser**. On any phone, tablet or PC on the same Wi-Fi, open `http://<phone-ip>:53317/` in a browser to:

- download the files you chose to share
- upload files to the phone
- send a text message to the phone

Anyone on the same Wi-Fi can open that page while it is on, so turn it off when you are done.

## Cancelling and closing

During a transfer, the first Options item is **Cancel sending** (the other device is told) or **Stop receiving** (the partly received file is deleted).

To close RetroSend, use **Options > Exit**. On S60 the red key only hides the app.

## Troubleshooting

| Problem | Fix |
|---|---|
| Other device not found | Is LocalSend open? Is encryption off? Are both on the same Wi-Fi? Try **Scan again**, or **Enter IP address**. |
| The phone is not found by the other device | Add the N79 in LocalSend by hand, with the IP shown on the Receive tab. |
| "Create WLAN connection in offline mode?" | The phone is in the Offline profile. Answer Yes, or switch to the General profile. |
| The app pauses for 1 or 2 seconds at start | The phone is starting Wi-Fi. This is normal. |
| "Certificate expired" during install | Set the date to 2009, install, then set the date back. |
| "Needs a PIN" | Turn off Require PIN in LocalSend. |
| Anything else | Open the **Log** on the Receive tab, or read `E:\retrosend_log.txt` over USB in Mass storage mode. |
