import { Config } from "@remotion/cli/config";

Config.setEntryPoint("./remotion/index.ts");
// PNG intermediates, not JPEG. The art is flat colour with 3px hard edges and
// JPEG rings visibly along every one of them; the h264 pass is the only
// lossy step this way.
Config.setVideoImageFormat("png");
Config.setOverwriteOutput(true);
