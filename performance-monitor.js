/**
 * Performance Monitoring Utility
 * Tracks frame rate, animation performance, and provides optimization recommendations
 */

class PerformanceMonitor {
    constructor(options = {}) {
        this.enabled = options.enabled !== false;
        this.targetFPS = options.targetFPS || 60;
        this.sampleInterval = options.sampleInterval || 1000; // 1 second
        this.frameCount = 0;
        this.lastTime = performance.now();
        this.fps = 60;
        this.fpsHistory = [];
        this.maxHistoryLength = 60; // Keep last 60 samples
        this.isMonitoring = false;
        this.animationFrameId = null;
        this.metrics = {
            avgFPS: 0,
            minFPS: 60,
            maxFPS: 60,
            droppedFrames: 0,
            totalFrames: 0
        };
    }

    start() {
        if (this.isMonitoring || !this.enabled) return;

        this.isMonitoring = true;
        this.frameCount = 0;
        this.lastTime = performance.now();
        this.fpsHistory = [];
        this.metrics = {
            avgFPS: 0,
            minFPS: 60,
            maxFPS: 60,
            droppedFrames: 0,
            totalFrames: 0
        };

        this.monitorFrame();
    }

    monitorFrame() {
        if (!this.isMonitoring) return;

        const now = performance.now();
        const deltaTime = now - this.lastTime;

        // Calculate FPS every sample interval
        if (deltaTime >= this.sampleInterval) {
            this.fps = Math.round((this.frameCount * 1000) / deltaTime);
            this.fpsHistory.push(this.fps);

            // Keep history size manageable
            if (this.fpsHistory.length > this.maxHistoryLength) {
                this.fpsHistory.shift();
            }

            // Update metrics
            this.updateMetrics();

            // Check for performance issues
            if (this.fps < this.targetFPS * 0.9) {
                this.metrics.droppedFrames++;
            }

            this.frameCount = 0;
            this.lastTime = now;
        }

        this.frameCount++;
        this.metrics.totalFrames++;

        this.animationFrameId = requestAnimationFrame(() => this.monitorFrame());
    }

    updateMetrics() {
        if (this.fpsHistory.length === 0) return;

        const sum = this.fpsHistory.reduce((a, b) => a + b, 0);
        this.metrics.avgFPS = Math.round(sum / this.fpsHistory.length);
        this.metrics.minFPS = Math.min(...this.fpsHistory);
        this.metrics.maxFPS = Math.max(...this.fpsHistory);
    }

    stop() {
        if (!this.isMonitoring) return;

        this.isMonitoring = false;
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
    }

    getMetrics() {
        return {
            ...this.metrics,
            currentFPS: this.fps,
            fpsHistory: [...this.fpsHistory]
        };
    }

    getReport() {
        const metrics = this.getMetrics();
        const isPerformant = metrics.avgFPS >= this.targetFPS * 0.95;

        return {
            isPerformant,
            metrics,
            recommendations: this.getRecommendations(metrics)
        };
    }

    getRecommendations(metrics) {
        const recommendations = [];

        if (metrics.avgFPS < this.targetFPS * 0.9) {
            recommendations.push('⚠️ Average FPS is below target. Consider reducing animation complexity.');
        }

        if (metrics.minFPS < this.targetFPS * 0.7) {
            recommendations.push('⚠️ Minimum FPS dropped significantly. Check for layout thrashing or heavy computations.');
        }

        if (metrics.droppedFrames > 10) {
            recommendations.push('⚠️ Multiple frame drops detected. Enable GPU acceleration for animations.');
        }

        if (recommendations.length === 0) {
            recommendations.push('✓ Performance is optimal!');
        }

        return recommendations;
    }

    logReport() {
        const report = this.getReport();
        console.group('📊 Performance Report');
        console.log('Current FPS:', report.metrics.currentFPS);
        console.log('Average FPS:', report.metrics.avgFPS);
        console.log('Min FPS:', report.metrics.minFPS);
        console.log('Max FPS:', report.metrics.maxFPS);
        console.log('Dropped Frames:', report.metrics.droppedFrames);
        console.log('Total Frames:', report.metrics.totalFrames);
        console.log('Status:', report.isPerformant ? '✓ Performant' : '⚠️ Needs Optimization');
        console.log('Recommendations:');
        report.recommendations.forEach(rec => console.log('  ' + rec));
        console.groupEnd();
    }

    destroy() {
        this.stop();
    }
}

// Export for use in tests and modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerformanceMonitor;
}
