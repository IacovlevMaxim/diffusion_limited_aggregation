function downloadGif(n) {
    saveGif(`myAnimation_${frameCount}.gif`, n, { delay: 0, units: 'frames', notificationDuration: 5});
}