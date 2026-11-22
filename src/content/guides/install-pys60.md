---
title: Install Python for S60 on the N79
summary: Install the PyS60 1.4.5 runtime once, so Python apps like RetroSend, RetroTele and RetroTorch can run.
order: 1
tags: [python, pys60, setup]
updated: 2026-11-22
---

Python for S60 1.4.5 is the runtime behind every app in the My Apps list. Install it once, on the phone.

## What you need

- A Nokia S60 3rd Edition phone. This guide is written for the N79 (S60 3rd Edition FP2).
- **`PythonForS60_1_4_5_3rdEd.sis`**. It is in the [RetroSend release](https://github.com/manojanasuri16/RetroSend/releases/latest) and is also listed in [Python for S60 1.4.5](/sdks/pys60-runtime/).
- Optional: **`PythonScriptShell_1_4_5_3rdEd.SIS`**. It lets you run a single `.py` file from the Python menu, without installing it as an app. It is useful for seeing errors.
- A USB cable, Bluetooth, or a card reader to copy the files.

## Step 1: Change the App. mgr. settings

1. Open **Menu > Applications > App. mgr.**
2. Select **Options > Settings**.
3. Set **Software installation** to **All**.
4. Set **Online certificate check** to **Off**.

## Step 2: Copy the files to the phone

Connect the phone by USB in **Mass storage** mode, or send the files by Bluetooth. You can also use a card reader. Copy the files to the phone memory (C:) or the memory card. Then open them in **File manager**.

## Step 3: Install the runtime

1. Open **PythonForS60_1_4_5_3rdEd.sis** in File manager and install it.
2. Accept the untrusted-supplier warning if it appears.

If the phone says **"Certificate expired"**, Nokia's runtime certificate is old. Do this:

1. Set the phone's date to **2009**.
2. Install the file again.
3. Set the date back to the real date.


## Step 4: Install the Script Shell (optional)

Open **PythonScriptShell_1_4_5_3rdEd.SIS** and install it the same way.

## Step 5: Check that it works

Install any of the apps in My Apps. If the app opens, the runtime is working.

If an app does nothing when you open it, the runtime is missing or damaged. This can happen with the old combined packages of RetroSend 1.0.0 to 1.1.1. Those packages could remove Python when replaced. Remove the app and Python in App. mgr., then install Python and the app again, in that order.

## Where to put Python

Keep Python in phone memory (C:). That is the setup that was tested. Apps can then be installed to the phone memory or the memory card, but a memory-card app on a phone that is not unlocked will not start. See [memory card installs](/guides/memory-card-installs/).
