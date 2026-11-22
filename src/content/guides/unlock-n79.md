---
title: Unlock the N79 with EasyHackKit
summary: Condensed walkthrough for removing Symbian signing and capability limits on your own N79, so unsigned apps install.
order: 5
tags: [unlock, hack, easyhackkit, n79, rompatcher]
updated: 2026-11-22
---

This guide condenses the [symbian-unlock-guide](https://github.com/manojanasuri16/symbian-unlock-guide) repository, which covers the N79 and N82 with EasyHackKit 2.0. The full guide has device notes, troubleshooting and a glossary. Read it before you start.

**Only do this on a phone you own.** On Symbian, "hacking" means removing Platform Security. It lets the phone install unsigned apps and reach the protected folders. The phone then stops checking signatures, so only install files you trust. Disabling this security is at your own risk. Carrier unlocking is not part of it.

**Credits:** EasyHackKit 2.0 is by **Alireza.M** ([s60world.ir](http://s60world.ir)). Its help file is by Alireza Elahi (2025). ROMPatcher+ and SafeManager are third-party tools bundled by the kit.

## What the hack does

- Symbian's signing certificates have expired, and the signing servers are gone. An unhacked phone refuses most new installs.
- EasyHackKit replaces the trusted certificate store with one that accepts self-signed apps.
- ROMPatcher+ applies two patches to the running system at each boot:
  - **Install Server RP+**: lets unsigned `.sis` and `.sisx` files install.
  - **Open4All RP+**: removes capability limits. This gives full access to `C:\sys`, `C:\resource` and `C:\private`.

## Before you start

1. **Remove the SIM card.** You can put it back afterwards.
2. **Set the phone date to 2019.** Use **Menu > Settings > Phone > Date and time**. Only the year matters. The certificates are expired, so the phone must think it is 2019 during the hack.
3. In **App. mgr. > Options > Settings**, set **Software installation** to **All** and **Online certificate check** to **Off**.
4. Copy **EasyHackKit 2.0.sisx** to the phone. You can use USB in Mass storage mode, or Bluetooth.

When you install EasyHackKit, install everything to **C: (phone memory)**. All of the hacking files go there.

## The steps

**Step 0: Install EasyHackKit.** Open the file in File manager. Accept the untrusted warning and install to C:. Open EasyHackKit and press **Start**. Answer **Yes** to "Is SIM card removed?", then press OK through the two info screens.

**Step 1: Install SafeManager.** Install it to C:. Press **No** to every prompt it shows. Its pop-ups are not part of the hack.

**Step 2: Replace the certificate store.** In SafeManager, go to **Other > FileMgr**.

1. Open `C:\data\` and select `updatedswicertstore.dat`. Choose **Options > Copy**.
2. Go to `C:\resource\swicertstore\dat\`. Choose **Options > Paste**.
3. Type the confirmation code shown on your screen. Answer **Yes** to "Replace file?".
4. Close SafeManager and switch back to EasyHackKit. Press **Next**.

This step makes the phone trust self-signed apps. If the paste fails, the troubleshooting section of the full guide covers it.

**Step 3: Choose the phone type.** For the N79:

| Question | Answer |
|---|---|
| "Does your phone run S60v3 FP1?" | No |
| "Does your phone run Belle FP2?" | No |
| "Other platforms selected. Continue?" | Yes |

**Step 4: Install ROMPatcher+.** Dismiss the note. Install it to C:. If SafeManager asks to deny ROMPatcher autostart, press **Cancel** or **No**, because you want autostart. Open ROMPatcher+. For **each** of Install Server RP+ and Open4All RP+:

1. Select it and apply it. It should show a **green tick**.
2. Choose **Options > Add to Auto**. This re-applies the patch on every boot.

Close ROMPatcher+ and press **Next** in EasyHackKit.

**Step 5: Test (optional).** Press **Test**. The wizard installs a sample app called HackTest. If it installs without an error, the hack worked. Press **End**.

**Step 6: Clean up.** Uninstall **SafeManager** first, then **EasyHackKit**. **Keep ROMPatcher+**, because the hack depends on it loading at each boot. Put the SIM back.

## After the hack

- Unsigned apps install without a certificate error.
- Apps can reach the protected folders. Be careful, because a wrong change to a system file can break the phone.
- ROMPatcher+ must stay installed. If it is removed, the hack stops working until the patches are applied again.
- The changes live in memory and are re-applied at boot. The phone's firmware is not rewritten. A factory reset returns the phone to stock.

## Troubleshooting (short)

- **Certificate error when installing:** check the date (2019), the certificate check (Off) and the software installation setting (All). Finish the wizard first.
- **Capability or access-denied errors:** Open4All RP+ is not active. Apply it again and choose **Add to Auto**.
- **HackTest fails:** check the date, that the certificate store was replaced, and that both patches are green and set to Auto.
- **Patches gone after a reboot:** you did not choose **Add to Auto**. Apply both patches again and set Auto.
