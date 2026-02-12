#!/bin/bash
# Microphone Volume Diagnostic Script for Linux
# This script diagnoses microphone configuration and volume settings

echo "================================================="
echo "   Microphone Volume Diagnostic Report"
echo "================================================="
echo ""

# Check if running as root
if [ "$EUID" -eq 0 ]; then
   echo "⚠️  Warning: Running as root. Some checks may not reflect user settings."
   echo ""
fi

echo "1. AUDIO SYSTEM DETECTION"
echo "-------------------------"

# Check for PulseAudio
if command -v pactl &> /dev/null; then
    echo "✅ PulseAudio detected"
    AUDIO_SYSTEM="pulseaudio"
    PA_VERSION=$(pactl --version | head -1)
    echo "   Version: $PA_VERSION"
elif command -v pipewire &> /dev/null; then
    echo "✅ PipeWire detected"
    AUDIO_SYSTEM="pipewire"
    PW_VERSION=$(pipewire --version 2>/dev/null || echo "Version unknown")
    echo "   Version: $PW_VERSION"
else
    echo "⚠️  Neither PulseAudio nor PipeWire detected"
    AUDIO_SYSTEM="alsa"
fi
echo ""

echo "2. SOUND CARDS DETECTED"
echo "----------------------"
if [ -f /proc/asound/cards ]; then
    cat /proc/asound/cards
else
    echo "❌ Cannot read /proc/asound/cards"
fi
echo ""

echo "3. MICROPHONE INPUT SOURCES"
echo "---------------------------"
if [ "$AUDIO_SYSTEM" = "pulseaudio" ] && command -v pactl &> /dev/null; then
    echo "Available input sources:"
    pactl list sources short
    echo ""

    # Get default source
    DEFAULT_SOURCE=$(pactl get-default-source 2>/dev/null)
    echo "Default input source: $DEFAULT_SOURCE"
    echo ""

    # Get detailed info about default source
    if [ -n "$DEFAULT_SOURCE" ]; then
        echo "Detailed information for default source:"
        pactl list sources | grep -A 20 "Name: $DEFAULT_SOURCE" | grep -E "(Volume|Mute|Base Volume|Sample)"
    fi
elif command -v arecord &> /dev/null; then
    echo "ALSA capture devices:"
    arecord -l
fi
echo ""

echo "4. CURRENT VOLUME LEVELS"
echo "------------------------"
if [ "$AUDIO_SYSTEM" = "pulseaudio" ] && command -v pactl &> /dev/null; then
    # Get volume for all sources
    pactl list sources | grep -E "(Name:|Volume:|Mute:)" | while read line; do
        echo "$line"
    done
elif command -v amixer &> /dev/null; then
    echo "ALSA Mixer settings for Capture:"
    amixer get Capture 2>/dev/null || echo "No 'Capture' control found"
fi
echo ""

echo "5. MICROPHONE BOOST SETTINGS"
echo "----------------------------"
if command -v amixer &> /dev/null; then
    # Check for common boost controls
    for control in "Mic Boost" "Capture" "Front Mic Boost" "Rear Mic Boost" "Internal Mic Boost"; do
        RESULT=$(amixer get "$control" 2>/dev/null)
        if [ $? -eq 0 ]; then
            echo "Control: $control"
            echo "$RESULT" | grep -E "(Playback|Capture|Mono:|Front|Limits)"
            echo ""
        fi
    done
else
    echo "⚠️  amixer not available for boost detection"
fi
echo ""

echo "6. WHATSAPP/WEB BROWSER AUDIO PERMISSIONS"
echo "-----------------------------------------"
echo "For WhatsApp Web/Desktop, ensure:"
echo "  • Browser has microphone permissions"
echo "  • WhatsApp has been granted microphone access"
echo "  • No other application is blocking the microphone"
echo ""

echo "7. COMMON ISSUES AND RECOMMENDATIONS"
echo "-----------------------------------"
echo "Low microphone volume can be caused by:"
echo "  1. Low input volume (< 50%)"
echo "  2. Disabled microphone boost"
echo "  3. Wrong input source selected"
echo "  4. Muted microphone"
echo "  5. AGC (Automatic Gain Control) disabled"
echo ""

echo "8. TESTING YOUR MICROPHONE"
echo "-------------------------"
echo "To test your microphone, run:"
echo "  arecord -d 5 -f cd test.wav && aplay test.wav"
echo ""

echo "================================================="
echo "   End of Diagnostic Report"
echo "================================================="
echo ""
echo "To fix microphone issues, run: ./fix-microphone-volume.sh"
