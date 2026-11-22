---
title: Memory card installs for PyS60 apps
summary: Why a Python for S60 app on a different drive from Python does not start, and how RetroSend, RetroTele and RetroTorch fix it.
order: 2
tags: [python, pys60, memory-card, troubleshooting]
updated: 2026-11-22
---

A Python for S60 1.4.5 app on a **different drive from Python itself** closes at once. No Python code runs and there is no error message. This guide explains why, and what to do.

## Why it happens

When an app starts, PyS60's app framework loads its resource file `\resource\apps\appuifwmodule.rsc` from the **app's** drive. Python for S60 installs that file only on its own drive (usually C:).

If the app is on the memory card (E:) and Python is on C:, the file is missing from E:, so the app stops before its Python code runs. A fix in Python does not help, because PyS60 loads `appuifw` before it runs the app's code.

## The fix in the apps

The three apps in My Apps (RetroSend 1.2.1 and later, RetroTele 0.7.4 and later, RetroTorch 1.3.0) include:

- a copy of `appuifwmodule.rsc` in `\resource\<app>\`
- a tiny native program, `<app>_rscfix.exe`, which the installer runs once

When the installer runs, the program copies `appuifwmodule.rsc` to `\resource\apps\` on the drive the app went to, if it is missing there. After that, the app starts from either drive.

The fix was found and tested on a Nokia N79, with the apps on the memory card and Python for S60 in phone memory.

## What you need

- **An unlocked phone.** Writing into `\resource` needs it. The usual way is the **Open4All** patch from [the unlock guide](/guides/unlock-n79/).
- Python for S60 1.4.5 installed.

## Option A: install on the same drive as Python (any phone)

If your phone is not unlocked, this is the simplest option. Install the app to the same drive as Python. For example, both on C: (phone memory).

## Option B: install to the memory card (unlocked phone)

1. Install Python for S60 1.4.5 to phone memory (C:).
2. Install the app and choose the **memory card** (E:) when the installer asks.
3. The installer runs the `_rscfix.exe` program. It copies the resource file if needed.
4. Start the app.

## Option C: copy the file by hand (phone not unlocked)

RetroTorch's release includes `appuifwmodule.rsc` as a separate file. You can copy it yourself:

1. Connect the phone by USB in **Mass storage** mode.
2. Copy `appuifwmodule.rsc` into `resource\apps\` on the app's drive (for example E:).
3. Disconnect the phone and start the app.

## What does not work

- **A `.sis` that installs the file to the other drive.** The phone gives an "Update error". It would replace Python's own copy on the other drive.
- **A launcher copied to C:**, or a Python-side fix in the app's `default.py`. PyS60 loads `appuifw` first, so these run too late.

## Summary

| Python | App | Phone | Result |
|---|---|---|---|
| C: | C: | any | works |
| C: | E: | unlocked | works, with the `_rscfix.exe` program |
| C: | E: | not unlocked | does not start. Copy the file by hand (Option C) or install on C: |
