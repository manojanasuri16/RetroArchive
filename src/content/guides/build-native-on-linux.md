---
title: Build native Symbian code on Linux
summary: Set up the S60 3rd Edition FP2 toolchain on Linux and build a native PyS60 .pyd module for the N79.
order: 6
tags: [toolchain, developer, linux, pyd, sis]
updated: 2026-11-22
---

This guide sets up a Symbian C++ toolchain for **S60 3rd Edition FP2** (the N79) on modern Linux, using the [Symbian S60v3 toolchain](/sdks/symbian-s60v3-toolchain/). It can build native Symbian DLLs and the `.pyd` modules that Python for S60 apps load. It is for FP2 only. FP1 phones such as the N82 need the FP1 SDK.

The toolchain is the one that RetroTorch and RetroTele use.

## Before you start

- A Linux PC with enough free disk space for the 466 MB Nokia S60 SDK archive and its unpacked files.
- Host packages (Manjaro / Arch):

```sh
sudo pacman -S --needed base-devel unshield perl flex bison zlib unzip curl lib32-glibc
```

On Debian or Ubuntu, use `build-essential`, `unshield`, `perl`, `flex`, `bison`, `zlib1g-dev`, `unzip`, `curl`, and `libc6:i386` (after `sudo dpkg --add-architecture i386`).

Wine is not needed.

## Step 1: Get the toolchain

```sh
git clone https://github.com/manojanasuri16/symbian-s60v3-toolchain.git
cd symbian-s60v3-toolchain
```

## Step 2: Run setup

```sh
sh setup.sh
```

The script:

1. Downloads the archives into `downloads/` and checks each one against `SHA256SUMS`. The open archives come from the repository's `archives` release. The two Nokia SDK files come from archive.org, because their licences do not allow re-hosting.
2. Unpacks the CodeSourcery GCCE 3.4.3 compiler into `csl-gcc/`.
3. Builds GnuPoc's native tools into `csl-gcc/bin/`.
4. Unpacks the S60 3.2 SDK into `s60_32/`. This is `EPOCROOT`.
5. Copies the PyS60 1.4.5 headers and `python222.dso` into the SDK.
6. Adds the ECam advanced settings API from the FP2 API Plug-In Pack.
7. Writes `env.sh`.

When it ends with `Symbian toolchain ready`, it works. Running it again is safe. Finished steps are skipped.

## Step 3: Set the environment

```sh
. ./env.sh
```

This sets `EPOCROOT` and the `PATH`. To use the toolchain from another project, point at it with a variable:

```sh
S=${SYMBIAN_SDK:-$HOME/symbian-s60v3-toolchain}
export EPOCROOT=$S/s60_32/            # the trailing slash matters
export PATH=$S/gnupoc-bin:$S/csl-gcc/bin:$PATH
```

`EPOCROOT` must end with `/`.

## Step 4: Build the example

```sh
sh examples/hellopyd/build.sh   # creates examples/hellopyd/out/hellopyd.pyd
```

Only the `gcce` target works. `abld build gcce urel` builds a release for the phone. The emulator target needs Windows-only tools and is not supported.

## Writing a native .pyd module

The rules that PyS60 1.4.5 enforces on the N79:

- Use `TARGET foo.pyd`, `TARGETTYPE dll`, and a unique UID. The range `0xE0000000` to `0xEFFFFFFF` is for self-signed and test builds.
- Export `initfoo` at **ordinal 1** (`EXPORTS initfoo @ 1 NONAME` in the `.def` file, and `NOSTRICTDEF` in the `.mmp`). PyS60 loads modules with `imp.load_dynamic` and calls ordinal 1.
- A DLL must have at least every capability of the process that loads it. A self-signed app usually has `LocalServices NetworkServices ReadUserData WriteUserData UserEnvironment`, so give the DLL all of those.
- The C API is **Python 2.2**.
- On the phone the file goes to `C:\sys\bin\foo.pyd`. Only the installer can write there, so it must be inside a `.sis`.

Two lessons from the real apps:

- Hardware APIs such as the camera or the lights can close the process with no Python error while the UI is drawing. Start hardware after the UI is up.
- Callbacks arrive through the active scheduler while Python waits. Never call into Python from a callback. Set a flag and let Python poll it.

## Packaging a .sis

GnuPoc's `makesis` is skipped, because it needs OpenSSL 1.0. Use **ensymble** (Python 2) with `py2sis`, and put the `.pyd` into the package with `--extrasdir`:

```sh
mkdir -p extras/sys/bin && cp out/foo.pyd extras/sys/bin/
python2 ensymble.py py2sis --uid=0xE.......  --appname=MyApp --version=1.0.0 \
  --caps=LocalServices+NetworkServices+ReadUserData+WriteUserData+UserEnvironment \
  --extrasdir=extras --cert=cert.pem --privkey=key.pem  app_dir/  MyApp.sis
```

Make a self-signed certificate that is valid from 2008 to 2037. It keeps working when the phone's clock is wrong:

```sh
openssl req -x509 -newkey rsa:1024 -sha1 -nodes -not_before 20080101000000Z \
  -not_after 20371231000000Z -subj "/CN=MyApp" -keyout key.pem -out cert.pem
openssl rsa -in key.pem -traditional -out key.pem
```

Run ensymble with `</dev/null`, or it waits for a passphrase.

The phone needs Python for S60 1.4.5 installed. See [install Python for S60](/guides/install-pys60/).

## Fixes built into setup.sh

You do not need to apply these yourself. They are listed so they are not lost.

| Problem | Fix |
|---|---|
| GnuPoc tools fail with modern GCC defaults | Wrap `gcc` and `g++` in `compat-bin/` to build as gnu89 and gnu++98 |
| `bmconv` fails with "ordered comparison of pointer with integer" | Change `(foundPath > 0)` to `(foundPath != 0)` in `pbmcomp.cpp` |
| `makesis` needs OpenSSL 1.0 | Skipped, use ensymble |
| GnuPoc's `make-3.81` does not build | Skipped, system `make` is used |
| SDK perl fails on `defined(%hash)` | Patched with `perl -pi` in the SDK tools |
| GnuPoc expects the compiler in `~/csl-gcc` | Path rewritten in `gnupoc-common.sh` |
| ECam advanced settings missing from the public SDK | Copied from the FP2 API Plug-In Pack |
| PyS60 headers missing from the SDK | Copied from the PyS60 1.4.5 SDK plug-in |

## Troubleshooting

- `arm-none-symbianelf-gcc: No such file or directory`, although the file exists: install the 32-bit loader (`lib32-glibc` or `libc6:i386`).
- `abld` cannot find `epoc32`: `EPOCROOT` is not set, or it does not end with `/`. Run `. ./env.sh`.
- Checksum mismatch in `fetch.sh`: the download was cut off. Delete the file in `downloads/` and run again.
- The `.pyd` builds but `import foo` fails on the phone: check the ordinal-1 export, the capabilities, and that the file is in `C:\sys\bin`.
- A different distro or GCC gives a new error in a GnuPoc tool: add a flag to `compat-bin` or a `sed` patch, as in the table above.
