import { httpVideo } from ".";
import HttpResource from "./http-resource";

const VideoResource = new HttpResource(httpVideo, "videos");
export default VideoResource;