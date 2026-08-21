import re

with open('src/views/HamsterPopQuiz.tsx', 'r') as f:
    content = f.read()

# Fix handleTimeUpdate
old_handle = """  const handleTimeUpdate = (state: any) => {
    const currentSeconds = state.playedSeconds;"""
new_handle = """  const handleTimeUpdate = (e: any) => {
    const currentSeconds = e?.currentTarget?.currentTime || e?.target?.currentTime || 0;"""
content = content.replace(old_handle, new_handle)

# Fix seekTo
old_seek = """      if (videoRef.current && typeof videoRef.current.seekTo === 'function') {
        videoRef.current.seekTo(triggeredQuiz.timeTrigger, 'seconds');
      }"""
new_seek = """      if (videoRef.current) {
        if (typeof videoRef.current.seekTo === 'function') {
          videoRef.current.seekTo(triggeredQuiz.timeTrigger, 'seconds');
        } else {
          videoRef.current.currentTime = triggeredQuiz.timeTrigger;
        }
      }"""
content = content.replace(old_seek, new_seek)

# Fix Player component props
old_player = """            <Player 
              ref={videoRef}
              url={videoUrl || "https://media.w3.org/2010/05/sintel/trailer_hd.mp4"}
              width="100%"
              height="100%"
              playing={isPlaying && !activeQuiz}
              onProgress={handleTimeUpdate}
              onEnded={() => setIsPlaying(false)}
              onDuration={(duration: number) => setVideoDuration(duration)}
              controls={true}
              style={{ position: 'absolute', top: 0, left: 0 }}
            />"""
new_player = """            <Player 
              ref={videoRef}
              src={videoUrl || "https://media.w3.org/2010/05/sintel/trailer_hd.mp4"}
              width="100%"
              height="100%"
              playing={isPlaying && !activeQuiz}
              onTimeUpdate={handleTimeUpdate}
              onEnded={() => setIsPlaying(false)}
              onDurationChange={(e: any) => {
                const duration = e?.currentTarget?.duration || e?.target?.duration || 120;
                setVideoDuration(duration);
              }}
              controls={true}
              style={{ position: 'absolute', top: 0, left: 0 }}
            />"""
content = content.replace(old_player, new_player)

with open('src/views/HamsterPopQuiz.tsx', 'w') as f:
    f.write(content)
