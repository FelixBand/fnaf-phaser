precision mediump float;

uniform sampler2D uMainSampler;
uniform vec2 uMouse; // in normalized coords or pixels relative to sprite, depends on setup

varying vec2 outTexCoord; // UV coords from Phaser, normalized 0..1 within sprite

void main() {
    vec2 uv = outTexCoord;

    float depth = 5.0;
    float mouse_speed_divisor = 800.0;

    float dx = abs(uv.x - 0.5);
    float dy = abs(uv.y - 0.5);

    float offset = (dx * 0.2) * dy;

    float dir = (uv.y <= 0.5) ? 1.0 : -1.0;

    vec2 coords = vec2(uv.x, uv.y + dx * (offset * depth * dir));

    // Adjust this based on how you want the mouse to influence coords
    vec2 nuv = coords + uMouse / mouse_speed_divisor;

    gl_FragColor = texture2D(uMainSampler, nuv);
}
