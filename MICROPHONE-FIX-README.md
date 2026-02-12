# Microphone Volume Fix for WhatsApp and Video Calls

## Problem Description

When using WhatsApp (Web or Desktop) for voice/video calls on Linux, your conversation partner may complain that your volume is too low. This is a common issue related to microphone input levels and audio system configuration.

## Common Causes

1. **Low Input Volume**: Microphone capture volume set too low (< 50%)
2. **Disabled Microphone Boost**: Hardware boost not enabled in ALSA
3. **Wrong Input Source**: System using incorrect microphone (e.g., laptop using external mic port instead of internal mic)
4. **Muted Microphone**: Input source accidentally muted
5. **No Automatic Gain Control (AGC)**: AGC disabled, causing inconsistent volume
6. **Missing Echo Cancellation**: Causes feedback and volume reduction
7. **Browser Permissions**: Browser not granted proper microphone access

## Solution Overview

This repository contains two scripts to diagnose and fix microphone volume issues:

### 1. Diagnostic Script (`diagnose-microphone.sh`)

Analyzes your current audio configuration and identifies issues.

**Usage:**
```bash
chmod +x diagnose-microphone.sh
./diagnose-microphone.sh
```

**What it checks:**
- Audio system (PulseAudio/PipeWire/ALSA)
- Available sound cards
- Input sources and default microphone
- Current volume levels
- Microphone boost settings
- Common configuration issues

### 2. Fix Script (`fix-microphone-volume.sh`)

Automatically applies optimal settings for WhatsApp and video calls.

**Usage:**
```bash
chmod +x fix-microphone-volume.sh
./fix-microphone-volume.sh
```

**What it does:**
- Unmutes your microphone
- Sets input volume to optimal 80%
- Enables microphone boost (ALSA)
- Enables echo cancellation (PulseAudio/PipeWire)
- Enables Automatic Gain Control (AGC)
- Sets echo-cancelled source as default

## Quick Fix Guide

### Step 1: Run Diagnostic
```bash
./diagnose-microphone.sh > mic-report.txt
cat mic-report.txt
```

### Step 2: Apply Fix
```bash
./fix-microphone-volume.sh
```

### Step 3: Test Your Microphone
```bash
# Record 5 seconds of audio
arecord -d 5 -f cd test.wav

# Play it back
aplay test.wav
```

### Step 4: Test in WhatsApp
Make a test call and ask your contact if the volume is better.

## Manual Configuration

### For PulseAudio/PipeWire Users

#### Check current volume:
```bash
pactl list sources | grep -E "(Name|Volume|Mute)"
```

#### Set volume to 80%:
```bash
pactl set-source-volume @DEFAULT_SOURCE@ 80%
```

#### Unmute microphone:
```bash
pactl set-source-mute @DEFAULT_SOURCE@ 0
```

#### Enable echo cancellation:
```bash
pactl load-module module-echo-cancel aec_method=webrtc \
  source_name=mic_echo_cancelled sink_name=speaker_echo_cancelled

pactl set-default-source mic_echo_cancelled
```

### For ALSA Users

#### Check current settings:
```bash
amixer get Capture
```

#### Set capture volume to 80%:
```bash
amixer set Capture 80% unmute
```

#### Enable microphone boost:
```bash
amixer set "Mic Boost" 2
amixer set "Internal Mic Boost" 2
```

#### Enable AGC:
```bash
amixer set "Auto-Gain Control" on
```

### Using GUI Tools

#### PulseAudio Volume Control (pavucontrol):
```bash
sudo apt-get install pavucontrol
pavucontrol
```

Navigate to:
1. **Input Devices** tab
2. Find your microphone
3. Adjust volume slider to 80-90%
4. Ensure it's not muted (🔇 icon should not be red)

#### ALSA Mixer (alsamixer):
```bash
alsamixer
```

Press `F4` for capture devices, then:
- Use arrow keys to navigate
- Press `M` to unmute
- Use arrow keys to adjust volume

## WhatsApp-Specific Settings

### WhatsApp Desktop
1. Open WhatsApp Desktop
2. Settings (⋮) → Notifications
3. Check "Audio Input Device"
4. Select the correct microphone
5. Test with "Test Microphone" button

### WhatsApp Web (Browser)
1. Go to web.whatsapp.com
2. Browser Settings → Privacy/Security → Site Permissions
3. Find web.whatsapp.com
4. Ensure "Microphone" is set to "Allow"
5. For Chrome: chrome://settings/content/microphone
6. For Firefox: about:preferences#privacy → Permissions → Microphone

## Persistent Configuration

### Make Changes Permanent (PulseAudio)

Edit `~/.config/pulse/default.pa`:
```bash
nano ~/.config/pulse/default.pa
```

Add these lines:
```
# Load echo cancellation
load-module module-echo-cancel aec_method=webrtc source_name=mic_echo_cancelled sink_name=speaker_echo_cancelled

# Set default source
set-default-source mic_echo_cancelled

# Set default volume for all sources
set-source-volume @DEFAULT_SOURCE@ 80%
```

Then restart PulseAudio:
```bash
pulseaudio -k
pulseaudio --start
```

### Make Changes Permanent (ALSA)

Save current ALSA state:
```bash
sudo alsactl store
```

To restore on boot, ensure `alsa-restore.service` is enabled:
```bash
sudo systemctl enable alsa-restore.service
```

## Troubleshooting

### Issue: No sound input at all
**Solution:**
```bash
# Check if microphone is detected
arecord -l

# Test recording
arecord -d 5 test.wav
```

### Issue: Volume still too low after fix
**Solutions:**
1. Increase volume to 100%: `pactl set-source-volume @DEFAULT_SOURCE@ 100%`
2. Enable all boost options: `amixer set "Mic Boost" 3`
3. Check if correct microphone is selected in WhatsApp settings
4. Move physically closer to microphone
5. Use an external USB microphone

### Issue: Echo cancellation not working
**Solutions:**
```bash
# Try different echo cancellation method
pactl unload-module module-echo-cancel
pactl load-module module-echo-cancel aec_method=speex source_name=mic_echo_cancelled
```

### Issue: Settings don't persist after reboot
**Solutions:**
- Follow "Persistent Configuration" section above
- For ALSA: `sudo alsactl store`
- For PulseAudio: Edit `~/.config/pulse/default.pa`

### Issue: Multiple microphones available
**Solution:**
```bash
# List all sources
pactl list sources short

# Set specific source as default
pactl set-default-source <source-name>
```

## Hardware Considerations

### Laptop Built-in Microphones
- Usually lower quality
- May require 100% volume + boost
- Consider using headset with microphone

### USB Microphones
- Generally better quality
- May have hardware volume control
- Check USB connection and drivers

### Headsets
- Best option for calls
- Boom microphone closer to mouth
- Many have inline volume control

## Recommended Settings for Different Scenarios

### WhatsApp/Video Calls (Recommended)
- **Volume**: 80%
- **Boost**: Level 2 (if available)
- **AGC**: Enabled
- **Echo Cancellation**: Enabled (webrtc method)

### Recording/Podcasting
- **Volume**: 60-70%
- **Boost**: Level 1
- **AGC**: Disabled (for consistent audio)
- **Echo Cancellation**: Disabled

### Gaming/Discord
- **Volume**: 70-80%
- **Boost**: Level 2
- **AGC**: Enabled
- **Echo Cancellation**: Enabled

## System Requirements

- Linux system with kernel 4.4+
- One of: PulseAudio, PipeWire, or ALSA
- bash shell
- Optional: alsa-utils, pulseaudio-utils

## Installation of Dependencies

### Debian/Ubuntu:
```bash
sudo apt-get update
sudo apt-get install pulseaudio pulseaudio-utils alsa-utils pavucontrol
```

### Fedora/RHEL:
```bash
sudo dnf install pulseaudio pulseaudio-utils alsa-utils pavucontrol
```

### Arch Linux:
```bash
sudo pacman -S pulseaudio pulseaudio-alsa alsa-utils pavucontrol
```

## Support

If you continue to experience issues after following this guide:

1. Run diagnostic script and save output
2. Check system logs: `journalctl -b | grep -i audio`
3. Test with different applications
4. Consider hardware issues
5. Try external USB microphone

## Additional Resources

- [PulseAudio Documentation](https://www.freedesktop.org/wiki/Software/PulseAudio/)
- [ALSA Project](https://www.alsa-project.org/)
- [PipeWire Documentation](https://docs.pipewire.org/)
- [WhatsApp Help Center](https://faq.whatsapp.com/)

## License

These scripts are provided as-is for diagnostic and configuration purposes.

## Version

Last updated: 2026-02-12
Compatible with: Ubuntu 20.04+, Fedora 35+, Debian 11+, Arch Linux
