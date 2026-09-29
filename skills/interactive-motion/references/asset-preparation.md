# Prepare GIF, video and frame-sequence assets

Use before implementing recorded-media motion. Preserve the user's supplied asset, crop, brand and rights. The output is a media contract for the actual project: usable timeline, dimensions, color/alpha handling, responsive variants, poster, manifest and delivery policy. This reference contains tool recipes, not bundled media or a fixed website.

## Inspect before selecting an effect

Record container and codec, duration, constant/variable frame timing, encoded dimensions, rotation metadata, alpha, color/HDR tags, audio, first/last usable frame, visible camera path and subject safe area. Inspect actual frames, not only file metadata. Establish whether the asset can loop without a cut and whether it really exposes the views the brief requires.

GIF timing and frame disposal matter: a decoded frame can depend on previous frames. Obtain fully composited frames through a suitable decoder. A raw extraction of GIF subrectangles is not a valid JPG sequence. Animated WebP/APNG also need correct duration/disposal handling. JPEG cannot preserve alpha; choose another format or author a consistent background deliberately.

Keep the source immutable. Write derivatives to an identified output folder. Inspect a contact sheet plus playback after conversion for color shifts, missing transparency, duplicate frames, dropped detail, cadence and seams. Tools and codec availability vary; check the installed encoder's help before using a command. Never install system encoders or fetch external media without the authorization relevant to that environment.

## Video to numbered JPG files

For a constant-rate scroll sequence, choose an authored time range, a viewport-appropriate resolution and a deliberate sample rate. The following FFmpeg invocation is a parameterized starting recipe; replace filenames and numbers with the asset contract and create the output directory first:

```text
ffmpeg -n -i source.mp4 -ss 0.4 -t 3 -an -vf "fps=30,scale=960:-2" -q:v 3 -start_number 0 frames/frame-%04d.jpg
```

The [image2 muxer](https://ffmpeg.org/ffmpeg-formats.html#image2_002c-image2pipe) writes numbered files and supports an explicit starting number. `-n` requests non-overwrite behavior; still require a fresh empty directory for numbered outputs rather than relying on it to check every expanded filename. This also avoids leftovers from an earlier longer extraction. On Windows batch files, percent signs require batch escaping; the shown command is for an interactive shell or direct argument array. Use argument arrays when automating it.

The shown rate normalizes sampling and may duplicate/drop input frames. Do not claim that increasing it invents motion detail. Scaling to 960 px may upscale a smaller source; cap output dimensions to what the source and project justify. For variable-rate fidelity, preserve timestamps in a manifest and map normalized time through those timestamps instead of assuming uniform indices. Check the installed FFmpeg filter/options documentation for the chosen workflow.

After extraction, enumerate actual output files, sort by their numeric index, verify contiguity, decode sample frames, and generate the manifest from that inventory. Assert all files use the intended dimensions and source range. Never guess filenames/count from a requested duration. Select a matching poster from an intentional informative moment; the first frame may be an empty fade.

## Deliver a scrubbable video

For a short opaque clip, a candidate H.264 recipe is:

```text
ffmpeg -n -i source.mp4 -ss 0.4 -t 3 -an -vf "fps=30,scale=960:-2" -c:v libx264 -crf 20 -g 6 -keyint_min 6 -sc_threshold 0 -pix_fmt yuv420p -movflags +faststart output.mp4
```

These are contextual encoding proposals. The [libx264 encoder](https://ffmpeg.org/ffmpeg-codecs.html#libx264_002c-libx264rgb) must exist in the installed build. A short keyframe interval trades a larger file for less inter-frame decode work during seeks; benchmark the real output. Fast-start metadata placement helps startup, but cannot guarantee low-latency scrubbing. Alpha/HDR workflows require different decisions; this opaque output is unsuitable when those properties must be retained.

Serve correct MIME, caching and usable range responses. Test `currentTime` seeks on the actual hosting path and target browsers. A 200 response to every range request, inconsistent CORS, or a codec the device cannot decode can invalidate an otherwise correct controller. Provide an ordinary poster and retry/status policy. See [media scrubbing](media-scrubbing.md) for the single-owner queue and distinction between seek completion and presentation.

## Playback, GIF and decorative loops

For a decorative GIF, prefer a tested video derivative when it materially improves delivery and pause control. For an actual GIF image retain a separate still alternative for reduced motion and offscreen policy; an `img` element has no general timeline pause/seek API. A pointer can move or reveal its container independently of its playback clock.

For video loops use muted inline playback, handle rejected `play()` promises, pause when hidden/offscreen, and expose a pause mechanism when needed by the content. Autoplay is a capability to test, not a guarantee. Play on deliberate interaction when appropriate; do not attach audio to cursor motion. Essential speech needs accessible equivalent content/captions.

For a loop, compare end→start geometry, illumination, exposure and velocity as well as frame colors. A crossfade can hide a discontinuity while making a double subject; inspect it before adopting. Cursor-to-time sequences do not have to loop, but must remain coherent in reverse and at both ends.

## Handoff fields and checks

Carry source provenance; transformation commands/settings and tool version; output inventory/checksums; dimensions/count/timing; alpha/color decisions; crop/focal point; poster; variant mapping; transfer and decoded-memory budgets; failure behavior; and tested browser/host conditions. Keep sensitive source paths out of public manifests.

Without the required encoder or assets, write the exact preparation contract and integrate the poster/asset interface that can be verified. Report the missing conversion accurately. Do not fabricate generated frames or claim smooth playback from metadata alone.
