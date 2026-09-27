let player;
let checkTimer = null;
let currentIndex = 0;
let segments = [];

function extractVideoId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : url;
}

// تحميل API الخاص بـ YouTube iframe dynamic
const tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
const firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

function onYouTubeIframeAPIReady() {
    // جلب البيانات من كائن lessonData المعرف في game01.js
    segments = (typeof lessonData !== 'undefined' && lessonData.segments) ? lessonData.segments : [];
    const videoUrl = (typeof lessonData !== 'undefined' && lessonData.youtubeUrl) ? lessonData.youtubeUrl : "";
    const videoId = extractVideoId(videoUrl);

    player = new YT.Player('player', {
        videoId: videoId,
        playerVars: {
            'playsinline': 1,
            'rel': 0,
            'controls': 1
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
    document.getElementById('statusInfo').innerText = "جاهز";
    // القفز تلقائياً لبداية أول مقطع عند التحميل
    if (segments.length > 0) {
        player.seekTo(segments[0][0], true);
    }
    updateButtonsState();
}

function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.PLAYING) {
        document.getElementById('playBtn').innerText = "⏹";
        startMonitoring();
    } else {
        document.getElementById('playBtn').innerText = "▶";
        stopMonitoring();
    }
}

// فحص التوقيت ومراقبة نهاية المقطع الحالي
function startMonitoring() {
    stopMonitoring();
    checkTimer = setInterval(() => {
        if (!player || !player.getCurrentTime || segments.length === 0) return;

        const currentTime = player.getCurrentTime();
        const [start, end] = segments[currentIndex];

        // إذا تجاوز الوقت نهاية المقطع الحالي يتوقف تلقائياً
        if (currentTime >= end) {
            player.pauseVideo();
            player.seekTo(end, true);
            document.getElementById('statusInfo').innerText = `توقف عند نهاية المقطع: ${formatTime(end)}`;
        }
    }, 200);
}

function stopMonitoring() {
    if (checkTimer) clearInterval(checkTimer);
}

// تكرار المقطع الحالي فقط (من نقطة بدايته المحددة)
function repeatCurrentSegment() {
    if (!player || segments.length === 0) return;
    const [start, end] = segments[currentIndex];
    player.seekTo(start, true);
    player.playVideo();
    document.getElementById('statusInfo').innerText = `إعادة المقطع الحالي: ${formatTime(start)} - ${formatTime(end)}`;
}

// الانتقال للمقطع التالي (والقفز لبدايته مباشرة)
function goToNextSegment() {
    if (!player || segments.length === 0) return;
    if (currentIndex < segments.length - 1) {
        currentIndex++;
        const [start, end] = segments[currentIndex];
        player.seekTo(start, true);
        player.playVideo();
        document.getElementById('statusInfo').innerText = `المقطع (${currentIndex + 1}/${segments.length}): ${formatTime(start)} - ${formatTime(end)}`;
        updateButtonsState();
    }
}

// الانتقال للمقطع السابق (والقفز لبدايته مباشرة)
function goToPreviousSegment() {
    if (!player || segments.length === 0) return;
    if (currentIndex > 0) {
        currentIndex--;
    }
    const [start, end] = segments[currentIndex];
    player.seekTo(start, true);
    player.playVideo();
    document.getElementById('statusInfo').innerText = `المقطع (${currentIndex + 1}/${segments.length}): ${formatTime(start)} - ${formatTime(end)}`;
    updateButtonsState();
}

function togglePlayPause() {
    if (!player) return;
    const state = player.getPlayerState();
    if (state === YT.PlayerState.PLAYING) {
        player.pauseVideo();
    } else {
        player.playVideo();
    }
}

function toggleLandscape() {
    const container = document.getElementById('playerContainer');
    const btn = document.getElementById('rotateBtn');
    
    container.classList.toggle('landscape-mode');
    btn.classList.toggle('active');

    if (document.documentElement.requestFullscreen) {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().then(() => {
                if (screen.orientation && screen.orientation.lock) {
                    screen.orientation.lock('landscape').catch(() => {});
                }
            }).catch(() => {});
        } else {
            document.exitFullscreen().catch(() => {});
            if (screen.orientation && screen.orientation.unlock) {
                screen.orientation.unlock();
            }
        }
    }
}

function updateButtonsState() {
    document.getElementById('prevBtn').disabled = (currentIndex === 0);
    document.getElementById('nextBtn').disabled = (currentIndex >= segments.length - 1);
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
      }
