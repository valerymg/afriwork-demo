#!/bin/bash
# Microphone Volume Fix Script for Linux
# This script optimizes microphone settings for WhatsApp and video calls

set -e

echo "================================================="
echo "   Microphone Volume Optimization Script"
echo "================================================="
echo ""
echo "This script will optimize your microphone settings"
echo "for better audio quality in WhatsApp and video calls."
echo ""

# Detect audio system
if command -v pactl &> /dev/null; then
    AUDIO_SYSTEM="pulseaudio"
    echo "✅ Detected: PulseAudio"
elif command -v pipewire &> /dev/null; then
    AUDIO_SYSTEM="pipewire"
    echo "✅ Detected: PipeWire (uses PulseAudio compatibility)"
else
    AUDIO_SYSTEM="alsa"
    echo "✅ Detected: ALSA only"
fi
echo ""

# Function to set PulseAudio/PipeWire volume
fix_pulseaudio() {
    echo "Applying PulseAudio fixes..."
    echo "----------------------------"

    # Get default source
    DEFAULT_SOURCE=$(pactl get-default-source 2>/dev/null)

    if [ -z "$DEFAULT_SOURCE" ]; then
        echo "❌ Could not detect default microphone"
        echo "   Available sources:"
        pactl list sources short
        exit 1
    fi

    echo "Default microphone: $DEFAULT_SOURCE"

    # Unmute the microphone
    echo "1. Unmuting microphone..."
    pactl set-source-mute "$DEFAULT_SOURCE" 0
    echo "   ✅ Microphone unmuted"

    # Set volume to 80% (optimal for most scenarios)
    echo "2. Setting input volume to 80%..."
    pactl set-source-volume "$DEFAULT_SOURCE" 80%
    echo "   ✅ Volume set to 80%"

    # Enable echo cancellation if module is available
    echo "3. Checking for echo cancellation module..."
    if pactl list modules short | grep -q "echo-cancel"; then
        echo "   ✅ Echo cancellation already loaded"
    else
        echo "   Loading echo cancellation module..."
        pactl load-module module-echo-cancel aec_method=webrtc source_name=mic_echo_cancelled sink_name=speaker_echo_cancelled 2>/dev/null && \
            echo "   ✅ Echo cancellation enabled" || \
            echo "   ⚠️  Could not enable echo cancellation (may require different parameters)"
    fi

    # Set as default if echo-cancelled source exists
    if pactl list sources short | grep -q "mic_echo_cancelled"; then
        echo "4. Setting echo-cancelled microphone as default..."
        pactl set-default-source mic_echo_cancelled
        echo "   ✅ Echo-cancelled microphone is now default"
    fi

    echo ""
    echo "Current microphone settings:"
    pactl list sources | grep -A 15 "Name: $(pactl get-default-source)" | grep -E "(Volume|Mute|Description)"
}

# Function to set ALSA volume
fix_alsa() {
    echo "Applying ALSA fixes..."
    echo "---------------------"

    # Check if amixer is available
    if ! command -v amixer &> /dev/null; then
        echo "❌ amixer command not found"
        echo "   Please install alsa-utils: sudo apt-get install alsa-utils"
        exit 1
    fi

    # Unmute and set capture volume
    echo "1. Setting Capture volume to 80%..."
    amixer set Capture 80% unmute 2>/dev/null && \
        echo "   ✅ Capture volume set" || \
        echo "   ⚠️  Capture control not available"

    # Enable microphone boost if available
    echo "2. Enabling Microphone Boost..."
    for control in "Mic Boost" "Internal Mic Boost" "Front Mic Boost"; do
        amixer set "$control" 2 unmute 2>/dev/null && \
            echo "   ✅ $control enabled" || true
    done

    # Unmute Front Mic if present
    echo "3. Unmuting Front Mic..."
    amixer set "Front Mic" unmute 2>/dev/null && \
        echo "   ✅ Front Mic unmuted" || true

    # Set AGC (Automatic Gain Control) if available
    echo "4. Enabling Auto-Gain Control..."
    amixer set "Auto-Gain Control" on 2>/dev/null && \
        echo "   ✅ AGC enabled" || \
        echo "   ⚠️  AGC not available on this device"

    echo ""
    echo "Current ALSA settings:"
    amixer get Capture 2>/dev/null || echo "No Capture control"
}

# Apply fixes based on detected system
if [ "$AUDIO_SYSTEM" = "pulseaudio" ] || [ "$AUDIO_SYSTEM" = "pipewire" ]; then
    fix_pulseaudio
else
    fix_alsa
fi

echo ""
echo "================================================="
echo "   Optimization Complete!"
echo "================================================="
echo ""
echo "✅ Microphone settings have been optimized"
echo ""
echo "RECOMMENDATIONS:"
echo "1. Test your microphone in WhatsApp"
echo "2. If volume is still low, try:"
echo "   • Check WhatsApp audio settings"
echo "   • Verify browser microphone permissions"
echo "   • Move closer to the microphone"
echo "   • Check for background noise suppression"
echo ""
echo "3. For WhatsApp Desktop:"
echo "   • Settings → Notifications → Microphone"
echo "   • Ensure input device is correct"
echo ""
echo "4. For WhatsApp Web (Browser):"
echo "   • Browser settings → Privacy → Microphone"
echo "   • Grant permissions to web.whatsapp.com"
echo ""
echo "5. Test microphone with:"
echo "   arecord -d 5 -f cd test.wav && aplay test.wav"
echo ""
echo "If issues persist, run: ./diagnose-microphone.sh"
echo ""
