import zlib, struct, math, os

def make_png(width, height, get_pixel):
    raw_data = bytearray()
    for y in range(height):
        raw_data.append(0)  # filter type 0 (None)
        for x in range(width):
            r, g, b, a = get_pixel(x, y, width, height)
            raw_data.extend((int(r), int(g), int(b), int(a)))
    
    def chunk(tag, data):
        return struct.pack('>I', len(data)) + tag + data + struct.pack('>I', zlib.crc32(tag + data) & 0xffffffff)
    
    ihdr = struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0)
    idat = zlib.compress(bytes(raw_data), 9)
    return b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', ihdr) + chunk(b'IDAT', idat) + chunk(b'IEND', b'')

def render_profitcalci_icon(w, h, is_maskable=False):
    # Normalized coords from 0.0 to 1.0
    def pixel(x, y, width, height):
        nx = x / (width - 1)
        ny = y / (height - 1)
        
        # In maskable icons, content is centered within 80% safe zone
        scale = 0.72 if is_maskable else 0.88
        
        # Background gradient: Emerald #047857 (4, 120, 87) to Teal #0d9488 (13, 148, 136)
        t = (nx + ny) / 2.0
        bg_r = 4 * (1 - t) + 13 * t
        bg_g = 120 * (1 - t) + 148 * t
        bg_b = 87 * (1 - t) + 136 * t

        if not is_maskable:
            # Rounded corner calculation (squircle radius ~0.22)
            corner_r = 0.22
            dx = max(0.0, abs(nx - 0.5) - (0.5 - corner_r))
            dy = max(0.0, abs(ny - 0.5) - (0.5 - corner_r))
            dist = math.sqrt(dx * dx + dy * dy)
            if dist > corner_r:
                # Anti-alias boundary
                alpha = max(0.0, min(1.0, (corner_r + 0.01 - dist) / 0.01))
                return (0, 0, 0, alpha * 255)

        # Coordinate centered at (0.5, 0.5), normalized to [-1, 1] inside safe zone
        cx = (nx - 0.5) / (scale * 0.5)
        cy = (ny - 0.5) / (scale * 0.5)

        # Draw bold letter 'P'
        # Vertical stem: cx in [-0.55, -0.25], cy in [-0.60, 0.60]
        in_stem = (-0.55 <= cx <= -0.25) and (-0.60 <= cy <= 0.60)

        # Upper loop outer:
        # horizontal top: cx in [-0.35, 0.15], cy in [-0.60, -0.32]
        in_loop_top = (-0.35 <= cx <= 0.15) and (-0.60 <= cy <= -0.32)
        # horizontal bottom: cx in [-0.35, 0.15], cy in [-0.05, 0.22]
        in_loop_bot = (-0.35 <= cx <= 0.15) and (-0.05 <= cy <= 0.22)
        # outer arc center at (0.15, -0.19), radius 0.41, inner radius 0.15
        arc_cx, arc_cy = 0.15, -0.19
        arc_dist = math.sqrt((cx - arc_cx)**2 + (cy - arc_cy)**2)
        in_arc = (cx >= arc_cx) and (0.14 <= arc_dist <= 0.41) and (-0.60 <= cy <= 0.22)

        in_p = in_stem or in_loop_top or in_loop_bot or in_arc

        # Upward green-gold profit trend badge inside/near loop:
        # Triangle arrow center around (0.18, -0.19)
        arrow_cx, arrow_cy = 0.16, -0.19
        adx, ady = cx - arrow_cx, cy - arrow_cy
        in_arrow = (-0.08 <= adx <= 0.08 and -0.05 <= ady <= 0.12) or (ady < -0.05 and abs(adx) <= 0.16 * (1 - ((-0.05 - ady) / 0.15)) and ady >= -0.20)

        # Rupee coin badge at bottom right: center (0.42, 0.48), radius 0.22
        coin_cx, coin_cy = 0.45, 0.45
        coin_dist = math.sqrt((cx - coin_cx)**2 + (cy - coin_cy)**2)
        in_coin = coin_dist <= 0.22
        in_coin_border = 0.19 <= coin_dist <= 0.22

        if in_coin_border:
            return (180, 83, 9, 255) # Dark amber border
        elif in_coin:
            return (245, 158, 11, 255) # Gold coin fill
        elif in_arrow:
            return (251, 191, 36, 255) # Gold arrow
        elif in_p:
            return (255, 255, 255, 255) # White 'P'
        else:
            return (bg_r, bg_g, bg_b, 255)

    return make_png(w, h, pixel)

os.makedirs('public', exist_ok=True)

with open('public/pwa-192x192.png', 'wb') as f:
    f.write(render_profitcalci_icon(192, 192, is_maskable=False))

with open('public/pwa-512x512.png', 'wb') as f:
    f.write(render_profitcalci_icon(512, 512, is_maskable=False))

with open('public/pwa-maskable-512x512.png', 'wb') as f:
    f.write(render_profitcalci_icon(512, 512, is_maskable=True))

with open('public/apple-touch-icon.png', 'wb') as f:
    f.write(render_profitcalci_icon(180, 180, is_maskable=False))

with open('public/favicon.ico', 'wb') as f:
    # 48x48 icon for favicon
    f.write(render_profitcalci_icon(48, 48, is_maskable=False))

print("All icons successfully generated in /public!")
