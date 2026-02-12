# Microphone Volume & Internet Fix for WhatsApp and Video Calls

## Problem Description

When using WhatsApp (Web or Desktop) for voice/video calls on Linux, your conversation partner may complain that your volume is too low or that your voice sounds choppy/robotic. This can be caused by **TWO main issues**:

### 1. Microphone Configuration Issues
Low microphone volume due to audio system settings

### 2. Internet Connection Issues
Poor call quality due to slow or unstable internet

**IMPORTANT**: Low internet speed (especially upload speed) can make your voice sound unclear to others, even if your microphone is configured correctly!

## Common Causes

### Audio Configuration Issues:
1. **Low Input Volume**: Microphone capture volume set too low (< 50%)
2. **Disabled Microphone Boost**: Hardware boost not enabled in ALSA
3. **Wrong Input Source**: System using incorrect microphone (e.g., laptop using external mic port instead of internal mic)
4. **Muted Microphone**: Input source accidentally muted
5. **No Automatic Gain Control (AGC)**: AGC disabled, causing inconsistent volume
6. **Missing Echo Cancellation**: Causes feedback and volume reduction
7. **Browser Permissions**: Browser not granted proper microphone access

### Internet Connection Issues:
1. **Low Upload Speed**: < 1 Mbps upload (YOUR voice is unclear to others)
2. **Low Download Speed**: < 1 Mbps download (You can't hear others clearly)
3. **High Latency**: > 150ms causes delays and echo
4. **Packet Loss**: > 1% causes choppy, robotic voice
5. **Unstable Connection**: WiFi drops or interference
6. **Bandwidth Competition**: Other apps consuming bandwidth
7. **Poor WiFi Signal**: Distance from router or interference

## Solution Overview

This repository contains **FOUR scripts** to diagnose and fix both microphone and internet issues:

### Audio Configuration Scripts:

#### 1. Microphone Diagnostic Script (`diagnose-microphone.sh`)

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

#### 2. Microphone Fix Script (`fix-microphone-volume.sh`)

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

### Internet Connection Scripts:

#### 3. Internet Diagnostic Script (`diagnose-internet.sh`)

Tests your internet connection quality for WhatsApp calls.

**Usage:**
```bash
chmod +x diagnose-internet.sh
./diagnose-internet.sh
```

**What it checks:**
- Internet connectivity and DNS resolution
- Download/upload bandwidth (Mbps)
- Latency (ping time)
- Packet loss percentage
- Network stability
- WhatsApp server connectivity
- WiFi signal strength
- Active network interface

#### 4. Internet Optimization Script (`fix-internet-for-calls.sh`)

Optimizes your internet connection for better call quality.

**Usage:**
```bash
chmod +x fix-internet-for-calls.sh
# Some optimizations require root:
sudo ./fix-internet-for-calls.sh
```

**What it does:**
- Configures fast DNS servers (Google DNS)
- Sets up QoS to prioritize VoIP traffic
- Detects bandwidth-consuming apps
- Optimizes WiFi settings
- Disables WiFi power management
- Provides browser optimization tips
- Tests optimized connection

## WhatsApp Call Requirements

Before troubleshooting, ensure your system meets these minimum requirements:

### Microphone Requirements:
- ✅ Working microphone (built-in or external)
- ✅ Proper audio drivers installed
- ✅ Microphone not muted
- ✅ Input volume > 50%

### Internet Requirements (CRITICAL):
- ✅ **Upload speed: 1+ Mbps** (for voice), 1.5+ Mbps (for video)
- ✅ **Download speed: 1+ Mbps** (for voice), 1.5+ Mbps (for video)
- ✅ **Latency: < 150ms**
- ✅ **Packet loss: < 1%**
- ✅ Stable connection without drops

**⚠️ IMPORTANT**: Low **upload speed** is the #1 reason others can't hear you clearly, even with perfect microphone settings!

## Quick Fix Guide

### FULL DIAGNOSTIC (Recommended):

#### Step 1: Check Internet Connection FIRST
```bash
chmod +x diagnose-internet.sh
./diagnose-internet.sh
```

**Why first?** Because if your internet is too slow, no amount of microphone tweaking will help!

Look for:
- Upload speed < 1 Mbps → ❌ YOUR VOICE WILL BE UNCLEAR
- High latency > 150ms → ❌ Delays and echo
- Packet loss > 1% → ❌ Choppy, robotic sound

#### Step 2: Check Microphone Configuration
```bash
chmod +x diagnose-microphone.sh
./diagnose-microphone.sh > mic-report.txt
cat mic-report.txt
```

#### Step 3: Apply Fixes

If internet is the problem:
```bash
chmod +x fix-internet-for-calls.sh
sudo ./fix-internet-for-calls.sh
```

If microphone is the problem:
```bash
chmod +x fix-microphone-volume.sh
./fix-microphone-volume.sh
```

#### Step 4: Test Your Microphone
```bash
# Record 5 seconds of audio
arecord -d 5 -f cd test.wav

# Play it back
aplay test.wav
```

#### Step 5: Test in WhatsApp
Make a test call and ask your contact if the quality is better.

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

## Internet Connection Troubleshooting

### Issue: Voice sounds choppy, robotic, or cuts out
**Most likely cause**: Poor internet connection, NOT microphone!

**Diagnosis:**
```bash
./diagnose-internet.sh
```

**Solutions:**

1. **Low Upload Speed** (< 1 Mbps):
   - Close bandwidth-heavy apps (torrents, YouTube, Netflix)
   - Pause cloud sync (Dropbox, Google Drive)
   - Stop system updates
   - Use wired connection instead of WiFi
   - Contact ISP for better plan

2. **High Latency** (> 150ms):
   - Move closer to WiFi router
   - Switch to wired ethernet
   - Change DNS to 8.8.8.8 or 1.1.1.1
   - Close VPN if not needed
   - Restart router

3. **Packet Loss** (> 1%):
   - Check WiFi signal strength
   - Update router firmware
   - Change WiFi channel (less interference)
   - Use 5GHz band instead of 2.4GHz
   - Check for loose cables

4. **Unstable Connection**:
   - Disable WiFi power management
   - Move away from interference sources (microwave, cordless phones)
   - Use WiFi extender or mesh system
   - Consider mobile hotspot as backup

### Issue: Others say my voice is unclear, but tests show good internet
**Solutions:**
```bash
# Test actual upload during a call
# In another terminal while on call:
speedtest-cli

# If upload drops during calls:
# 1. Close other apps
# 2. Use QoS on router to prioritize VoIP
# 3. Reduce video quality in WhatsApp
```

### Issue: Connection works for browsing but not for calls
**Cause**: VoIP requires consistent bandwidth, not just high speed.

**Solutions:**
- Enable QoS (Quality of Service) on router
- Prioritize UDP ports: 3478, 45395, 50318, 59234
- Disable router's SIP ALG if available
- Use wired connection

### Issue: Calls work on mobile data but not WiFi
**Solutions:**
```bash
# Check if router is blocking VoIP
sudo tcpdump -i any port 5222 or port 3478

# If blocked, configure router to allow WhatsApp ports:
# TCP: 80, 443, 5222
# UDP: 3478, 45395, 50318, 59234
```

### Quick Internet Optimization Checklist:
- [ ] Close all apps except WhatsApp
- [ ] Pause downloads/uploads
- [ ] Stop streaming services
- [ ] Move closer to WiFi router (or use ethernet)
- [ ] Turn off video if voice is more important
- [ ] Set WhatsApp to never auto-download media
- [ ] Restart router if connection is slow
- [ ] Switch to 5GHz WiFi if available
- [ ] Test during off-peak hours

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
