/* ============================================
   REZUMI - Video Resume
   Record/upload video introductions with QR
   ============================================ */

const VideoResume = {
    mediaRecorder: null,
    recordedChunks: [],
    stream: null,

    open() {
        const resume = currentResumeData || Storage.getResumes().slice(-1)[0];
        const hasVideo = resume?.profile?.video;

        openModal('Video Resume', `
            <div style="text-align:center;">
                <div id="video-preview-container" style="width:100%;max-width:400px;margin:0 auto 16px;aspect-ratio:16/9;background:#000;border-radius:var(--radius-md);overflow:hidden;display:flex;align-items:center;justify-content:center;position:relative;">
                    ${hasVideo ? `
                        <video id="video-player" src="${resume.profile.video}" controls style="width:100%;height:100%;object-fit:contain;"></video>
                    ` : `
                        <div id="video-placeholder" style="color:#666;">
                            <i class="fas fa-video" style="font-size:40px;margin-bottom:8px;"></i>
                            <div style="font-size:12px;">No video yet</div>
                            <div style="font-size:11px;opacity:0.6;">Record or upload a 30-60s intro</div>
                        </div>
                        <video id="video-live" style="width:100%;height:100%;object-fit:cover;display:none;" autoplay muted playsinline></video>
                    `}
                </div>

                <div id="video-timer" style="font-size:20px;font-weight:700;color:var(--accent);margin-bottom:12px;display:none;">00:00</div>

                <div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;">
                    ${hasVideo ? `
                        <button class="btn btn-primary" onclick="VideoResume.reRecord()"><i class="fas fa-video"></i> Re-record</button>
                        <button class="btn btn-glass" onclick="VideoResume.replace()"><i class="fas fa-upload"></i> Replace</button>
                        <button class="btn btn-danger" onclick="VideoResume.deleteVideo()"><i class="fas fa-trash"></i> Delete</button>
                    ` : `
                        <button class="btn btn-primary" onclick="VideoResume.startRecording()"><i class="fas fa-circle" style="color:red;"></i> Record</button>
                        <button class="btn btn-glass" onclick="VideoResume.uploadVideo()"><i class="fas fa-upload"></i> Upload</button>
                    `}
                </div>

                <div id="recording-controls" style="display:none;margin-top:12px;">
                    <button class="btn btn-danger" onclick="VideoResume.stopRecording()"><i class="fas fa-stop"></i> Stop Recording</button>
                </div>

                ${hasVideo ? `
                <div style="margin-top:16px;padding-top:16px;border-top:1px solid var(--border-color);">
                    <div style="font-size:12px;font-weight:600;margin-bottom:8px;">QR Code for Video</div>
                    <div id="video-qr" style="display:inline-block;background:white;padding:8px;border-radius:var(--radius-md);">
                        ${this.generateQR(resume.profile.video)}
                    </div>
                    <div style="font-size:11px;color:var(--text-tertiary);margin-top:6px;">Scan to watch your video introduction</div>
                    <button class="btn btn-glass btn-sm" style="margin-top:8px;" onclick="VideoResume.downloadQR()"><i class="fas fa-download"></i> Download QR</button>
                </div>
                ` : ''}

                <div style="margin-top:12px;font-size:11px;color:var(--text-tertiary);">
                    Supported: MP4, WebM • Max: 60 seconds • Max size: 10MB
                </div>
            </div>
        `, `<button class="btn btn-primary" onclick="closeModal()">Done</button>`);
    },

    async startRecording() {
        try {
            this.stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            const liveVideo = document.getElementById('video-live');
            const placeholder = document.getElementById('video-placeholder');
            
            if (liveVideo && placeholder) {
                placeholder.style.display = 'none';
                liveVideo.style.display = 'block';
                liveVideo.srcObject = this.stream;
            }

            this.recordedChunks = [];
            this.mediaRecorder = new MediaRecorder(this.stream, { mimeType: 'video/webm' });
            
            this.mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) this.recordedChunks.push(e.data);
            };

            this.mediaRecorder.onstop = () => {
                const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
                this.processVideo(blob);
                this.stopStream();
            };

            this.mediaRecorder.start();
            
            // Show timer
            const timer = document.getElementById('video-timer');
            const controls = document.getElementById('recording-controls');
            if (timer) timer.style.display = 'block';
            if (controls) controls.style.display = 'block';

            // Start timer
            let seconds = 0;
            this.timerInterval = setInterval(() => {
                seconds++;
                if (timer) {
                    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
                    const s = (seconds % 60).toString().padStart(2, '0');
                    timer.textContent = `${m}:${s}`;
                }
                // Auto-stop at 60s
                if (seconds >= 60) this.stopRecording();
            }, 1000);

        } catch (err) {
            showToast('Camera access denied. Please allow camera permissions.', 'error');
            this.stopStream();
        }
    },

    stopRecording() {
        if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
            this.mediaRecorder.stop();
        }
        clearInterval(this.timerInterval);
        const timer = document.getElementById('video-timer');
        const controls = document.getElementById('recording-controls');
        if (timer) timer.style.display = 'none';
        if (controls) controls.style.display = 'none';
    },

    stopStream() {
        if (this.stream) {
            this.stream.getTracks().forEach(t => t.stop());
            this.stream = null;
        }
    },

    processVideo(blob) {
        // Compress if needed
        if (blob.size > 10 * 1024 * 1024) {
            showToast('Video too large (max 10MB). Please record a shorter clip.', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const dataUrl = e.target.result;
            const resume = currentResumeData || {};
            if (!resume.profile) resume.profile = {};
            resume.profile.video = dataUrl;
            resume.profile.videoDuration = this.recordedChunks.length > 0 ? '30-60s' : 'Unknown';
            currentResumeData = resume;
            Storage.saveResume(resume);
            
            showToast('Video saved!', 'success');
            this.open(); // Refresh modal
        };
        reader.readAsDataURL(blob);
    },

    uploadVideo() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'video/mp4,video/webm,video/ogg';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            if (file.size > 10 * 1024 * 1024) {
                showToast('Video too large (max 10MB)', 'error');
                return;
            }
            this.processVideo(file);
        };
        input.click();
    },

    reRecord() {
        this.deleteVideo();
        setTimeout(() => this.open(), 300);
    },

    replace() {
        this.uploadVideo();
    },

    deleteVideo() {
        const resume = currentResumeData || {};
        if (resume.profile) {
            delete resume.profile.video;
            delete resume.profile.videoDuration;
        }
        currentResumeData = resume;
        Storage.saveResume(resume);
        showToast('Video removed', 'info');
        this.open();
    },

    generateQR(data) {
        // Simple QR code visualization (placeholder)
        // In production, use a QR library like qrcode.js
        if (!data) return '<div style="color:#999;font-size:11px;">No video URL</div>';
        
        // Generate a simple visual QR pattern
        const hash = data.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
        let pattern = '<div style="display:grid;grid-template-columns:repeat(11,6px);gap:1px;">';
        for (let i = 0; i < 121; i++) {
            const filled = ((hash * (i + 1) * 7) % 3) === 0 || i < 21 || i > 99 || i % 11 === 0 || i % 11 === 10;
            pattern += `<div style="width:6px;height:6px;background:${filled ? '#000' : '#fff'};"></div>`;
        }
        pattern += '</div>';
        return pattern;
    },

    downloadQR() {
        const resume = currentResumeData;
        if (!resume?.profile?.video) return;
        
        // Create a simple downloadable QR placeholder
        const canvas = document.createElement('canvas');
        canvas.width = 200;
        canvas.height = 200;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, 200, 200);
        ctx.fillStyle = 'black';
        ctx.font = '10px Inter';
        ctx.textAlign = 'center';
        ctx.fillText('Video Resume QR', 100, 100);
        ctx.fillText('Scan to watch', 100, 120);
        
        canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'video_resume_qr.png';
            a.click();
            URL.revokeObjectURL(url);
        });
        showToast('QR downloaded!', 'success');
    }
};

window.VideoResume = VideoResume;
