#!/bin/bash
# Internet Optimization Script for WhatsApp Calls
# Provides recommendations and fixes for poor call quality due to network issues

echo "======================================================="
echo "   Internet Optimization for WhatsApp Calls"
echo "======================================================="
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then
   echo "⚠️  Some optimizations require root privileges"
   echo "   Run with: sudo ./fix-internet-for-calls.sh"
   echo ""
fi

echo "This script will help optimize your internet for WhatsApp calls"
echo ""

echo "1. DNS OPTIMIZATION"
echo "-------------------"
echo "Fast DNS can reduce call connection time..."
echo ""

# Backup current DNS
if [ "$EUID" -eq 0 ]; then
    if [ -f /etc/resolv.conf ]; then
        cp /etc/resolv.conf /etc/resolv.conf.backup
        echo "✅ Backed up current DNS configuration"
    fi

    echo "Do you want to switch to Google DNS (8.8.8.8)? [y/N]"
    read -t 10 -r REPLY || REPLY="n"
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        cat > /etc/resolv.conf <<EOF
# Optimized DNS for WhatsApp calls
nameserver 8.8.8.8
nameserver 8.8.4.4
nameserver 1.1.1.1
EOF
        echo "✅ DNS updated to Google DNS (8.8.8.8)"
        echo "   Backup saved to /etc/resolv.conf.backup"
    else
        echo "⏭️  Skipped DNS change"
    fi
else
    echo "⚠️  Cannot modify DNS without root privileges"
    echo ""
    echo "To manually change DNS:"
    echo "  1. Edit /etc/resolv.conf (as root)"
    echo "  2. Add these lines:"
    echo "     nameserver 8.8.8.8"
    echo "     nameserver 1.1.1.1"
    echo ""
    echo "  Or use NetworkManager:"
    echo "     nmcli con mod <connection-name> ipv4.dns '8.8.8.8 1.1.1.1'"
fi
echo ""

echo "2. QoS - QUALITY OF SERVICE"
echo "---------------------------"
echo "Prioritizing WhatsApp traffic..."
echo ""

if [ "$EUID" -eq 0 ]; then
    if command -v tc &> /dev/null; then
        # Get active network interface
        INTERFACE=$(ip route | grep default | awk '{print $5}' | head -1)

        if [ -n "$INTERFACE" ]; then
            echo "Active interface: $INTERFACE"
            echo "Setting up QoS rules for VoIP traffic..."

            # Clear existing qdisc
            tc qdisc del dev "$INTERFACE" root 2>/dev/null

            # Add root qdisc
            tc qdisc add dev "$INTERFACE" root handle 1: htb default 30

            # Create classes
            tc class add dev "$INTERFACE" parent 1: classid 1:1 htb rate 100mbit
            tc class add dev "$INTERFACE" parent 1:1 classid 1:10 htb rate 50mbit prio 1
            tc class add dev "$INTERFACE" parent 1:1 classid 1:20 htb rate 30mbit prio 2
            tc class add dev "$INTERFACE" parent 1:1 classid 1:30 htb rate 20mbit prio 3

            # Add filters for WhatsApp ports
            # TCP ports 80, 443, 5222
            tc filter add dev "$INTERFACE" protocol ip parent 1:0 prio 1 u32 match ip dport 5222 0xffff flowid 1:10
            tc filter add dev "$INTERFACE" protocol ip parent 1:0 prio 1 u32 match ip sport 5222 0xffff flowid 1:10

            # UDP ports for voice/video
            tc filter add dev "$INTERFACE" protocol ip parent 1:0 prio 1 u32 match ip dport 3478 0xffff flowid 1:10
            tc filter add dev "$INTERFACE" protocol ip parent 1:0 prio 1 u32 match ip sport 3478 0xffff flowid 1:10

            echo "✅ QoS rules applied (WhatsApp traffic prioritized)"
        else
            echo "❌ Could not detect active network interface"
        fi
    else
        echo "⚠️  'tc' command not available"
        echo "   Install with: sudo apt-get install iproute2"
    fi
else
    echo "⚠️  QoS configuration requires root privileges"
    echo ""
    echo "Manual QoS setup commands:"
    echo "  sudo tc qdisc add dev <interface> root handle 1: htb default 30"
    echo "  sudo tc class add dev <interface> parent 1: classid 1:1 htb rate 100mbit"
    echo "  sudo tc class add dev <interface> parent 1:1 classid 1:10 htb rate 50mbit prio 1"
fi
echo ""

echo "3. DISABLE BANDWIDTH-HUNGRY APPS"
echo "---------------------------------"
echo "Checking for applications that may consume bandwidth..."
echo ""

# Check for common bandwidth consumers
BANDWIDTH_HOGS=(
    "transmission"
    "deluge"
    "qbittorrent"
    "steam"
    "dropbox"
    "nextcloud"
)

FOUND_HOGS=()
for app in "${BANDWIDTH_HOGS[@]}"; do
    if pgrep -f "$app" > /dev/null; then
        FOUND_HOGS+=("$app")
    fi
done

if [ ${#FOUND_HOGS[@]} -gt 0 ]; then
    echo "⚠️  Found bandwidth-intensive applications:"
    for hog in "${FOUND_HOGS[@]}"; do
        echo "   • $hog"
    done
    echo ""
    echo "Consider closing these during WhatsApp calls"
else
    echo "✅ No major bandwidth consumers detected"
fi
echo ""

echo "4. WIFI OPTIMIZATION (if applicable)"
echo "-------------------------------------"

if ip link show | grep -q "wlan\|wifi"; then
    echo "📶 WiFi connection detected"
    echo ""

    if command -v iwconfig &> /dev/null; then
        WIFI_INTERFACE=$(iwconfig 2>&1 | grep -v "no wireless" | grep "IEEE" | awk '{print $1}' | head -1)

        if [ -n "$WIFI_INTERFACE" ]; then
            echo "WiFi interface: $WIFI_INTERFACE"

            # Get signal strength
            SIGNAL=$(iwconfig "$WIFI_INTERFACE" 2>&1 | grep "Signal level" | grep -oP '=-\K\d+')
            if [ -n "$SIGNAL" ]; then
                if [ "$SIGNAL" -lt 50 ]; then
                    echo "✅ Strong WiFi signal: -${SIGNAL}dBm"
                elif [ "$SIGNAL" -lt 70 ]; then
                    echo "⚠️  Moderate WiFi signal: -${SIGNAL}dBm"
                    echo "   Recommendation: Move closer to router"
                else
                    echo "❌ Weak WiFi signal: -${SIGNAL}dBm"
                    echo "   Recommendation: Move closer to router or use ethernet"
                fi
            fi

            # Disable power management for WiFi
            if [ "$EUID" -eq 0 ]; then
                echo ""
                echo "Disabling WiFi power management (prevents disconnections)..."
                iwconfig "$WIFI_INTERFACE" power off 2>/dev/null && \
                    echo "✅ WiFi power management disabled" || \
                    echo "⚠️  Could not disable power management"
            fi
        fi
    fi

    echo ""
    echo "WiFi Optimization Tips:"
    echo "  ✓ Use 5GHz band if available (less interference)"
    echo "  ✓ Position router in central location"
    echo "  ✓ Keep router away from microwaves, cordless phones"
    echo "  ✓ Reduce number of connected devices"
    echo "  ✓ Update router firmware"
    echo "  ✓ Consider WiFi extender or mesh system"
    echo ""
else
    echo "✅ Wired connection detected (optimal for calls)"
fi
echo ""

echo "5. BROWSER OPTIMIZATION (for WhatsApp Web)"
echo "-------------------------------------------"
echo "Tips for better performance in browser:"
echo ""
echo "Chrome/Chromium:"
echo "  • Close unused tabs (each tab uses bandwidth)"
echo "  • Disable extensions during calls"
echo "  • Enable hardware acceleration:"
echo "    chrome://settings → Advanced → System"
echo "  • Clear cache: chrome://settings/clearBrowserData"
echo ""
echo "Firefox:"
echo "  • Close unused tabs"
echo "  • Disable extensions during calls"
echo "  • about:config → media.peerconnection.ice.tcp → false"
echo "    (forces UDP for better performance)"
echo ""

echo "6. WHATSAPP SETTINGS OPTIMIZATION"
echo "----------------------------------"
echo "Recommended WhatsApp settings:"
echo ""
echo "WhatsApp Desktop:"
echo "  Settings → Notifications"
echo "  • Disable auto-download of media (saves bandwidth)"
echo ""
echo "WhatsApp Web:"
echo "  Settings → Media auto-download"
echo "  • Set to 'Never' or 'WiFi only'"
echo ""
echo "During calls:"
echo "  • Turn off video if voice quality is poor"
echo "  • Close other apps using internet"
echo "  • Pause downloads/uploads"
echo ""

echo "7. NETWORK TESTING"
echo "------------------"
echo "Testing optimized connection..."
echo ""

if command -v ping &> /dev/null; then
    echo "Pinging WhatsApp server..."
    ping -c 5 web.whatsapp.com 2>&1 | tail -2
else
    echo "⚠️  Cannot test (ping not available)"
fi
echo ""

echo "======================================================="
echo "   OPTIMIZATION COMPLETE"
echo "======================================================="
echo ""
echo "✅ Applied optimizations"
echo ""
echo "IMMEDIATE ACTIONS TO IMPROVE CALLS:"
echo "-----------------------------------"
echo ""
echo "1. ⚡ Close bandwidth-heavy apps:"
echo "   • Torrent clients"
echo "   • Streaming services (YouTube, Netflix)"
echo "   • Cloud sync (Dropbox, Google Drive)"
echo "   • Large downloads"
echo ""
echo "2. 📶 Improve WiFi:"
echo "   • Move closer to router"
echo "   • Switch to 5GHz band"
echo "   • Or use ethernet cable"
echo ""
echo "3. 💻 Browser optimization:"
echo "   • Close all tabs except WhatsApp"
echo "   • Disable browser extensions"
echo "   • Restart browser"
echo ""
echo "4. 📱 WhatsApp settings:"
echo "   • Turn off auto-download"
echo "   • Use voice-only if video is laggy"
echo "   • Close WhatsApp on other devices"
echo ""
echo "5. 🔧 System optimization:"
echo "   • Close unnecessary applications"
echo "   • Stop system updates during calls"
echo "   • Disable cloud backups temporarily"
echo ""
echo "TEST YOUR CONNECTION:"
echo "Run: ./diagnose-internet.sh"
echo ""
echo "Minimum requirements for good quality:"
echo "  • Upload: 1+ Mbps (CRITICAL for your microphone!)"
echo "  • Download: 1+ Mbps"
echo "  • Latency: < 150ms"
echo "  • Packet loss: < 1%"
echo ""
echo "If your connection still doesn't meet requirements:"
echo "  → Contact your ISP for better plan"
echo "  → Use mobile data if WiFi is poor"
echo "  → Schedule calls during off-peak hours"
echo ""
