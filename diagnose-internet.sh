#!/bin/bash
# Internet Connection Diagnostic for WhatsApp Calls
# Tests network quality, bandwidth, latency, and packet loss

echo "======================================================="
echo "   Internet Connection Diagnostic for WhatsApp"
echo "======================================================="
echo ""
echo "WhatsApp call quality depends on:"
echo "  • Download speed: minimum 1 Mbps (voice), 1.5 Mbps (video)"
echo "  • Upload speed: minimum 1 Mbps (voice), 1.5 Mbps (video)"
echo "  • Latency: < 150ms recommended"
echo "  • Packet loss: < 1% recommended"
echo "  • Stable connection without drops"
echo ""

# Check if running with root privileges
if [ "$EUID" -eq 0 ]; then
   echo "⚠️  Running as root"
   echo ""
fi

echo "1. BASIC CONNECTIVITY TEST"
echo "---------------------------"

# Test DNS resolution
echo "Testing DNS resolution..."
if host google.com &>/dev/null || nslookup google.com &>/dev/null; then
    echo "✅ DNS resolution working"
else
    echo "❌ DNS resolution failed - check your network settings"
fi
echo ""

# Test basic connectivity
echo "Testing internet connectivity..."
if command -v ping &> /dev/null; then
    echo ""
    echo "Pinging Google DNS (8.8.8.8)..."
    PING_RESULT=$(ping -c 10 8.8.8.8 2>&1)

    if [ $? -eq 0 ]; then
        echo "✅ Internet connection active"
        echo ""
        echo "Ping statistics:"
        echo "$PING_RESULT" | grep -E "(rtt|packet loss)"

        # Extract packet loss
        PACKET_LOSS=$(echo "$PING_RESULT" | grep -oP '\d+(?=% packet loss)' | head -1)
        if [ -n "$PACKET_LOSS" ]; then
            if [ "$PACKET_LOSS" -eq 0 ]; then
                echo "✅ No packet loss detected"
            elif [ "$PACKET_LOSS" -lt 2 ]; then
                echo "⚠️  Packet loss: ${PACKET_LOSS}% (acceptable)"
            else
                echo "❌ High packet loss: ${PACKET_LOSS}% (may affect calls)"
            fi
        fi

        # Extract average latency
        AVG_LATENCY=$(echo "$PING_RESULT" | grep -oP 'avg = \K[\d.]+' || echo "$PING_RESULT" | grep -oP 'rtt.*avg \K[\d.]+')
        if [ -n "$AVG_LATENCY" ]; then
            AVG_INT=$(printf "%.0f" "$AVG_LATENCY")
            if [ "$AVG_INT" -lt 50 ]; then
                echo "✅ Excellent latency: ${AVG_LATENCY}ms"
            elif [ "$AVG_INT" -lt 150 ]; then
                echo "✅ Good latency: ${AVG_LATENCY}ms"
            elif [ "$AVG_INT" -lt 300 ]; then
                echo "⚠️  Fair latency: ${AVG_LATENCY}ms (may cause delays)"
            else
                echo "❌ High latency: ${AVG_LATENCY}ms (poor quality expected)"
            fi
        fi
    else
        echo "❌ Cannot reach internet"
    fi
else
    echo "⚠️  'ping' command not available"
    echo "   Install with: sudo apt-get install iputils-ping"
fi
echo ""

echo "2. BANDWIDTH TEST"
echo "-----------------"
echo "Testing download/upload speeds..."
echo ""

if command -v speedtest-cli &> /dev/null; then
    echo "Running speed test (this may take 30-60 seconds)..."
    SPEED_RESULT=$(speedtest-cli --simple)
    echo "$SPEED_RESULT"
    echo ""

    # Parse speeds
    DOWNLOAD=$(echo "$SPEED_RESULT" | grep "Download" | grep -oP '\d+\.\d+')
    UPLOAD=$(echo "$SPEED_RESULT" | grep "Upload" | grep -oP '\d+\.\d+')

    if [ -n "$DOWNLOAD" ]; then
        DOWNLOAD_INT=$(printf "%.0f" "$DOWNLOAD")
        echo "Download Analysis:"
        if [ "$DOWNLOAD_INT" -lt 1 ]; then
            echo "❌ Download too slow: ${DOWNLOAD} Mbps (need 1+ Mbps for voice calls)"
        elif [ "$DOWNLOAD_INT" -lt 2 ]; then
            echo "⚠️  Download marginal: ${DOWNLOAD} Mbps (OK for voice, may struggle with video)"
        elif [ "$DOWNLOAD_INT" -lt 5 ]; then
            echo "✅ Download adequate: ${DOWNLOAD} Mbps (good for voice and video calls)"
        else
            echo "✅ Download excellent: ${DOWNLOAD} Mbps"
        fi
    fi

    if [ -n "$UPLOAD" ]; then
        UPLOAD_INT=$(printf "%.0f" "$UPLOAD")
        echo "Upload Analysis:"
        if [ "$UPLOAD_INT" -lt 1 ]; then
            echo "❌ Upload too slow: ${UPLOAD} Mbps (YOUR VOICE WILL BE UNCLEAR)"
        elif [ "$UPLOAD_INT" -lt 2 ]; then
            echo "⚠️  Upload marginal: ${UPLOAD} Mbps (voice OK, video may have issues)"
        elif [ "$UPLOAD_INT" -lt 5 ]; then
            echo "✅ Upload adequate: ${UPLOAD} Mbps (good for voice and video calls)"
        else
            echo "✅ Upload excellent: ${UPLOAD} Mbps"
        fi
        echo ""
        echo "⚠️  UPLOAD SPEED IS CRITICAL FOR YOUR MICROPHONE!"
        echo "   Low upload = Others can't hear you well"
    fi

elif command -v curl &> /dev/null; then
    echo "⚠️  speedtest-cli not installed, using basic test..."
    echo "   Install for detailed results: sudo apt-get install speedtest-cli"
    echo ""

    # Basic download test
    echo "Testing download speed (downloading 10MB file)..."
    START_TIME=$(date +%s.%N)
    curl -o /dev/null -s https://speed.cloudflare.com/__down?bytes=10000000 2>/dev/null
    END_TIME=$(date +%s.%N)
    DURATION=$(echo "$END_TIME - $START_TIME" | bc)
    SPEED=$(echo "scale=2; 10 / $DURATION" | bc)
    echo "Approximate download speed: ${SPEED} MB/s ($(echo "$SPEED * 8" | bc) Mbps)"

else
    echo "❌ No bandwidth testing tools available"
    echo "   Install: sudo apt-get install speedtest-cli curl"
fi
echo ""

echo "3. NETWORK INTERFACE STATUS"
echo "---------------------------"
if command -v ip &> /dev/null; then
    echo "Active network interfaces:"
    ip -brief addr show | grep -v "lo\|DOWN"
    echo ""

    # Check for WiFi
    if ip link show | grep -q "wlan\|wifi"; then
        echo "📶 WiFi detected"
        if command -v iwconfig &> /dev/null; then
            WIFI_INFO=$(iwconfig 2>&1 | grep -E "Quality|Signal level" | head -1)
            if [ -n "$WIFI_INFO" ]; then
                echo "WiFi status: $WIFI_INFO"
            fi
        fi
        echo ""
        echo "⚠️  WiFi Tips for Better Calls:"
        echo "   • Move closer to router"
        echo "   • Use 5GHz band if available"
        echo "   • Reduce interference (microwaves, other devices)"
    elif ip link show | grep -q "eth\|enp"; then
        echo "🔌 Wired connection detected"
        echo "✅ Wired connections are more stable for calls"
    fi
else
    ifconfig | grep -E "^[a-z]|inet " | head -10
fi
echo ""

echo "4. WHATSAPP SERVER CONNECTIVITY"
echo "--------------------------------"
echo "Testing connectivity to WhatsApp servers..."

WHATSAPP_SERVERS=(
    "web.whatsapp.com"
    "v.whatsapp.net"
    "g.whatsapp.net"
)

if command -v ping &> /dev/null; then
    for server in "${WHATSAPP_SERVERS[@]}"; do
        echo -n "Testing $server... "
        if ping -c 3 -W 2 "$server" &>/dev/null; then
            echo "✅ Reachable"
        else
            echo "⚠️  Unreachable (may be blocked or DNS issue)"
        fi
    done
else
    echo "⚠️  ping not available for server testing"
fi
echo ""

echo "5. FIREWALL AND PORTS"
echo "---------------------"
echo "WhatsApp uses:"
echo "  • TCP ports: 80, 443, 5222"
echo "  • UDP ports: 3478, 45395, 50318, 59234"
echo ""

if command -v ss &> /dev/null; then
    echo "Checking established connections..."
    WHATSAPP_CONN=$(ss -tunap 2>/dev/null | grep -i whatsapp | wc -l)
    if [ "$WHATSAPP_CONN" -gt 0 ]; then
        echo "✅ $WHATSAPP_CONN active WhatsApp connection(s) detected"
    else
        echo "ℹ️  No active WhatsApp connections (open WhatsApp and try again)"
    fi
else
    echo "⚠️  Cannot check active connections (ss command not available)"
fi
echo ""

echo "6. NETWORK STABILITY TEST"
echo "-------------------------"
if command -v ping &> /dev/null; then
    echo "Testing connection stability (30 second test)..."
    STABILITY_TEST=$(ping -c 30 -i 1 8.8.8.8 2>&1)

    # Check for variation in latency
    echo "$STABILITY_TEST" | tail -2

    PACKET_LOSS=$(echo "$STABILITY_TEST" | grep -oP '\d+(?=% packet loss)')
    if [ "$PACKET_LOSS" -eq 0 ]; then
        echo "✅ Stable connection (no packet loss)"
    else
        echo "⚠️  Unstable connection (${PACKET_LOSS}% packet loss)"
    fi
else
    echo "⚠️  Cannot perform stability test"
fi
echo ""

echo "7. DNS PERFORMANCE"
echo "------------------"
echo "Current DNS servers:"
if [ -f /etc/resolv.conf ]; then
    grep "nameserver" /etc/resolv.conf
    echo ""
    echo "Testing DNS resolution speed..."

    if command -v dig &> /dev/null; then
        START=$(date +%s.%N)
        dig @8.8.8.8 web.whatsapp.com +short &>/dev/null
        END=$(date +%s.%N)
        DURATION=$(echo "($END - $START) * 1000" | bc)
        echo "DNS query time: ${DURATION}ms"

        DURATION_INT=$(printf "%.0f" "$DURATION")
        if [ "$DURATION_INT" -lt 50 ]; then
            echo "✅ Fast DNS resolution"
        elif [ "$DURATION_INT" -lt 150 ]; then
            echo "✅ Acceptable DNS resolution"
        else
            echo "⚠️  Slow DNS resolution (consider using 8.8.8.8 or 1.1.1.1)"
        fi
    fi
else
    echo "⚠️  Cannot read DNS configuration"
fi
echo ""

echo "======================================================="
echo "   DIAGNOSIS SUMMARY"
echo "======================================================="
echo ""
echo "WhatsApp Call Requirements:"
echo "  Voice calls: 1 Mbps up/down, <150ms latency"
echo "  Video calls: 1.5 Mbps up/down, <150ms latency"
echo ""
echo "If your connection doesn't meet these requirements:"
echo "  ❌ Your voice will sound choppy or robotic"
echo "  ❌ Others can't hear you clearly (low upload)"
echo "  ❌ Call may drop frequently"
echo "  ❌ Delays in conversation"
echo ""
echo "Run: ./fix-internet-for-calls.sh for optimization tips"
echo ""
